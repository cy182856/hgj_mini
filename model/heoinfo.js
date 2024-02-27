const { queryHeoPraiseList } = require('../const/api');
const util = require('../utils/util');

var app = getApp(),
p = require('../const/path.js'),
u = require('../utils/util'),
api = require('../const/api'),
st = require('../const/storage'),
n = null,
h ={
  init: function() {
    n = (0, u.getCurrentPage)();
  },
  initHeoTypeList:function(){
    var queryHeoTypeParam = {
      stat:'N'
    }
    n.showLoading(!0);
    app.req.postRequest(api.queryHeoTypeList, queryHeoTypeParam).then(function (res) {
      console.log("queryHeoTypeList 返回", res);
      if(res.data.RESPCODE == "000"
        && res.data.data){
          res.data.data.unshift({heoType:"",heoTypeDesc:'全部',select:true})
          var heoTypeList = new Array();
        for(var index in res.data.data){
          if(index % 2 == 0){
            res.data.data[index].flex = 'left'
          }else{
            res.data.data[index].flex = 'right'
          }
        }
        for(var i= 0 ; i < (res.data.data.length + 1)/2; i++){
          var heoTypeObj = {}
          heoTypeObj.id = i;
          var heoTypes = new Array()
          var k = 0;
          for(var d in res.data.data){
            var heoType = res.data.data[d]
            if(k==2){
              continue;
            }
            if(!heoType.hasCheck){
              k = k+1;
              heoType.hasCheck = true;
              heoTypes.push(heoType)
            }
            heoTypeObj.heoTypes = heoTypes;
          }
          heoTypeList.push(heoTypeObj)
        }
        n.setData({
          heoTypeList:heoTypeList
        })
      }
    })
    n.showLoading(!1);
  },
  initOwnerHeoTypes:function(theme){
    var queryHeoTypeParam = {
      stat:'N',
      openHuStat:'N'
    }
    n.showLoading(!0)
    app.req.postRequest(api.queryHeoTypeList, queryHeoTypeParam).then(function (res) {
      if(res.data.RESPCODE == "000" 
      && res.data.data 
      && res.data.data.length >0){
          var ownerHeoTypes = res.data.data;
          if(theme && theme != ''){
            for(var i in n.data.nOrGs){
              if(theme == n.data.nOrGs[i].needOrGive){
                n.setData({
                  nOrgIndex:i,
                  needOrGive:n.data.nOrGs[i].needOrGive
                })
                break;
              }
            }
            ownerHeoTypes.unshift({heoType:'',heoTypeDesc:'请选择'});
            var checkOther = false;
            for(var j in ownerHeoTypes){
              if(ownerHeoTypes[j].heoType == '99'){
                checkOther = true;
                break;
              }
            }
            if(!checkOther){
              ownerHeoTypes.push({heoType:'99',heoTypeDesc:'其他'});
            }
            if(theme != 'N' && theme != 'G'){
              for(var j in ownerHeoTypes){
                if(ownerHeoTypes[j].heoType == '99'){
                  n.setData({
                    heoTypeIndex:j,
                    heoType:'99',
                    heoTypeDisable:true
                  })
                  break;
                }
              }
            }else{
              n.setData({
                heoTypeDisable:false,
                heoTypeIndex:0,
                heoType:''
              })
            }
          }
          n.setData({
            ownerHeoTypes:ownerHeoTypes
          })
          if(res.data.inHeoBlack != 'Y'){
            n.setData({
              canRelease:true,
              showMineRelease:true
            })
          }else if(res.data.hasReleaseData == 'Y'){
            n.setData({
              showMineRelease:true
            })
          }
      }else if(res.data.RESPCODE == "000"  && res.data.hasReleaseData == 'Y'){
          n.setData({
            showMineRelease:true
          })
      }else{
        n.setData({
          showMineRelease:false
        })
      }
      n.showLoading(!1)
    })
  },
  releaseHeoInfo:function(){
    var data = {};
    data.heoTitle = n.data.heoTitle;
    data.heoDesc = n.data.heoDesc;
    data.imgCnt = n.data.imgCnt;
    data.heoType = n.data.heoType;
    data.houseIsPub = n.data.houseIsPub;
    data.needOrGive = n.data.needOrGive;
    n.showLoading(!0)
    app.req.postRequest(api.addHeoInfo, data).then(function (res) {
      console.log("addHeoInfo 返回",res)
      if(res.data.RESPCODE == "000"
      && res.data.heoSeqId && res.data.heoSeqId != ''){
        let custId = app.storage.getCustId();
        let heoDate = res.data.heoDate;
        let heoSeqId = res.data.heoSeqId;
        let stat = res.data.stat;
        let fileList = n.data.fileList;
        for(var i =0; i<fileList.length; i++){
          n.upload(fileList[i].url,api.uploadImages,
            {fileType:'LOG',busiDate:heoDate ,custId:custId, busiId :'02',busiSeqId:heoSeqId,imgId:i+1});
        }
        var prePage = util.getPrePage()
        prePage.setData({
          showHeoTypeClass:false,
          needRefresh:true
        })
        wx.showToast({
          title:stat && stat == 'N' ?'发布成功，即将跳转我的发布页面...' : '发布成功，请等待审核...',
          icon: 'none',
          duration: 3000,
          success:function(){
            setTimeout(function(){
              if(prePage.route == 'subpages/heo/heoinfo/heoinfo'){
                wx.redirectTo({
                  url: '/subpages/heo/mineRelease/mineRelease?type=release',
                })
              }else{
                wx.navigateBack({
                  delta: 1
                })
              }
            },3000)
          }
        })
      }else{
        wx.showToast({
          title: '发布失败，'+res.data && res.data.ERRDESC ? res.data.ERRDESC :'',
          icon:'none',
          duration:3000
        })
      }
      n.showLoading(!1)
    })
  },
  queryHeoInfos:function(){
    var heoType = n.data.heoType ? n.data.heoType : '';
    var needOrGive = n.data.neefOrGive ? n.data.neefOrGive : '';
    var queryHeoInfosParams = {
      heoType:heoType,
      stat:n.data.stat ? n.data.stat : '',
      needOrGive:needOrGive,
      isTop:n.data.isTop ? n.data.isTop : '',
      pageNum:n.data.pageNum,
      queryType:n.data.queryType,
      pageSize:n.data.pageSize
    }
    n.showLoading(!0)
    console.log(queryHeoInfosParams)
    app.req.postRequest(api.queryHeoInfos, queryHeoInfosParams).then(function (res) {
      console.log("queryHeoInfos返回",res)
      if(res.data.RESPCODE == '000'
        && res.data.data
        && res.data.data.length > 0){
          n.setData({
            heoInfos:n.data.heoInfos.length >0 && n.data.isLoadingMoreData ? n.data.heoInfos.concat(res.data.data) : res.data.data,
            hasMoreData:res.data.hasMoreData == 'Y' ? true : false,
            padding_bottom: n.data.iphoneX ? 34 : 0
          })
      }
      n.setData({
        isLoadingMoreData:!1,
        isRefreshing:!1,
        queryFinish:true
      })
      console.log(n.data)
      n.showLoading(!1)
    })
  },
  initIsTopHeoInfos:function(){
    var heoType = n.data.heoType;
    var needOrGive = n.data.neefOrGive;
    var that = this;
    var queryTopHeoInfosParams = {
      heoType:heoType,
      stat:'N',
      needOrGive:needOrGive,
      isTop:'Y'
    }
    console.log("queryIsTopHeoInfos请求参数",queryTopHeoInfosParams)
    n.showLoading(!0)
    app.req.postRequest(api.queryHeoInfos, queryTopHeoInfosParams).then(function (res) {
      console.log("queryIsTopHeoInfos返回",res)
      if(res.data.RESPCODE == '000'){
        if(res.data.data != null){
          n.setData({
            isTopHeoInfos:res.data.data,
            padding_bottom: n.data.iphoneX ? 34 : 0
          })
        }else{
          n.setData({
            isTopHeoInfos:new Array()
          })
        }
        that.queryHeoInfos()
      }else{
        wx.showToast({
          title: '查询邻里圈信息失败，请稍后重试。',
          icon:'none',
          duration:3000
        })
        n.showLoading(!1)
      }
    })
  },
  initHeoDtlInfos:function(heoDate,heoSeqId){
    var that = this,
    queryHeoDtlInfoParam = {
      heoDate:heoDate,
      heoSeqId:heoSeqId,
      queryType:n.data.queryType ? n.data.queryType:''
    }
    n.showLoading(!0)
    app.req.postRequest(api.queryHeoInfos, queryHeoDtlInfoParam).then(function (res) {
      console.log("queryHeoInfos返回",res)
      if(res.data.RESPCODE == '000'
       && null != res.data.data){
        var heoInfo = res.data.data[0];
        n.setData({
          heoInfo:heoInfo,
          heoDtlInfos:res.data.data[0].heoDtlDtos ? res.data.data[0].heoDtlDtos : new Array()
        })
        var query = wx.createSelectorQuery();
        query.select('#heoInfoItem').boundingClientRect(rect=>{
          let height = rect.height;
          n.setData({
            itemHeight : height
          })
        }).exec();
        if(n.data.huSeqId == heoInfo.usrSeqId){
          that.queryHeoPraiseList(heoDate, heoSeqId);
        }
        n.showLoading(!1)
      }else{
        wx.showToast({
          title: '获取邻里圈详情信息失败。',
          icon:'none',
          duration:3000,
          success:function(){
            setTimeout(function(){
              wx.navigateBack({
                delta: 0,
              })
            },3000)
          }
        })
      }
    })
  },
  saveHeoDtlInfo:function(){
    var that = this;
    var data = {},
    heoInfo = n.data.heoInfo;
    data.heoDate = heoInfo.heoDate
    data.heoSeqId = heoInfo.heoSeqId
    data.rlsSeqId = heoInfo.usrSeqId
    data.msgBody = n.data.inputMsg
    data.msgType = 'T'
    data.replySeqId = n.data.replySeqId
    app.req.postRequest(api.addHeoDtl, data).then(function (res) {
      if(res.data.RESPCODE == "000"){
        n.setData({
          inputMsg:'',
          showMsgInput:!1,
          focus:false
        })
        that.initHeoDtlInfos(data.heoDate,data.heoSeqId);
      }else{
        n.showLoading(!1)
        wx.showToast({
          title: '留言失败，请稍后重试',
          icon:'none',
          duration:3000
        })
      }
    })
  },
  updateHeoInfo:function(heoInfo){
    var that = this;
    app.req.postRequest(api.updHeoInfo, heoInfo).then(function (res) {
      console.log("updHeoInfo",res)
      if(res.data.RESPCODE != "000"){
        wx.showToast({
          title: '关闭帖子失败',
          icon:'none',
          duration:3000
        })
      }else{
        wx.showToast({
          title: '关闭帖子成功',
          icon:'none',
          duration:3000,
          success:function(){
            var heoInfo2 = n.data.heoInfo;
            if(!heoInfo2 || null == heoInfo2){
              var heoInfos = n.data.heoInfos
              if(heoInfos && heoInfos.length >0){
                for(var index in heoInfos){
                  if(heoInfos[index].heoDate == heoInfo.heoDate
                    && heoInfos[index].heoSeqId == heoInfo.heoSeqId){
                      heoInfos[index].stat = heoInfo.stat;
                      break;
                    }
                }
                n.setData({
                  heoInfos:heoInfos
                })
              }
            }else{
              heoInfo2.stat = heoInfo.stat
              n.setData({
                heoInfo:heoInfo2
              })
            }
          }
        })
      }
    })
  },
  updHeoDtlInfo:function(heoDtlInfo,refresh){
    var that = this;
    app.req.postRequest(api.updHeoDtlInfo, heoDtlInfo).then(function (res) {
      console.log("updHeoDtlInfo",res)
      if(res.data.RESPCODE == "000"){
        if(refresh){
          that.initHeoDtlInfos(heoDtlInfo.heoDate,heoDtlInfo.heoSeqId);
        }
      }
    })
  },
  queryHeoPraiseList:function(){
    var queryParams = {
      heoDate:n.data.heoDate,
      heoSeqId:n.data.heoSeqId,
      pageNum:n.data.pageNum,
      pageSize:n.data.pageSize
    }
    n.showLoading(!0)
    app.req.postRequest(api.queryHeoPraiseList, queryParams).then(function (res) {
      if(res.data && res.data.heoPraiseListDtos){
        n.setData({
          heoPraiseListDtos: n.data.heoPraiseListDtos.concat(res.data.heoPraiseListDtos),
          hasMoreData:res.data.totalNum > n.data.pageNum * n.data.pageSize ? true : false,
          totalNum:res.data.totalNum
        })
      }
      n.setData({
        isLoadingMoreData:false,
        isRefreshing:false,
        isHideLoadMore:true
      })
      n.showLoading(!1)
    })
  }
}

module.exports = {
  heoinfo: h
};