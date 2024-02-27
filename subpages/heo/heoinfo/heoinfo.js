// pages/help/help.js
var app = getApp(),
api = require('../../../const/api'),     
heo = require('../../../model/heoinfo'),
that = null;
Page({

  /**
   * 页面的初始数据
   */
  data: {
      needOrgives:[[{
        id:'0',
        type:'',
        select:true,
        flex:'left',
        name:'全部'
      },{
        id:'1',
        type:'N',
        flex:'right',
        name:'求助'
      }],[{
        id:'2',
        type:'G',
        flex:'left',
        name:'帮助'
      },{
        id:'3',
        type:'S',
        flex:'right',
        name:'分享'
      }],[{
        id:'4',
        type:'P',
        flex:'left',
        name:'表扬'
      },{
        id:'5',
        type:'E',
        flex:'right',
        name:'曝光'
      }]],
      ownerHeoThemes:[{theme:'S',themeDesc:'分享'},
        {theme:'P',themeDesc:'表扬'},
        {theme:'E',themeDesc:'曝光'},
        {theme:'N',themeDesc:'求助'},
        {theme:'G',themeDesc:'帮助'}],
      checkAll:!0,
      showHeoTypeClass:!1,
      iphoneX:app.globalData.iphoneX,
      isRefreshing:!1,
      hasMoreData:!1,
      isLoadingMoreData:!1,
      clickClose:true,
      checkImageUrl:api.checkImageUrl,
      ownerHeoTypes:[],
      heoTypeDesc:'全部',
      heoType:'',
      nOrGIndex:0,
      heoInfos:[],
      isTopHeoInfos:[],
      pageNum:1,
      pageSize:5,
      showMineRelease:false,
      canRelease:false,
      stat:'N',
      isTop:'N',
      x:'660rpx',
      y:'780rpx',
      queryFinish:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.loading(),heo.heoinfo.init(), this.showLoading(!0), that = this;
    let loginData = app.storage.getLoginInfo();
    this.setData({
      huStat:loginData && loginData.huStat ? loginData.huStat : '',
      huSeqId : loginData && loginData.huSeqId ? loginData.huSeqId : '',
      loginErrDesc : loginData && loginData.loginErrDesc ? loginData.loginErrDesc : ''
    })
    heo.heoinfo.initHeoTypeList();
    heo.heoinfo.initOwnerHeoTypes();
    heo.heoinfo.initIsTopHeoInfos();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    heo.heoinfo.init();
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.setData({
      isRefreshing:true,
      pageNum:1,
      isLoadingMoreData: false,
      hasMoreData:true,
      queryFinish:false
    })
    heo.heoinfo.initIsTopHeoInfos();
    wx.stopPullDownRefresh();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (this.data.isRefreshing || this.data.isLoadingMoreData || !this.data.hasMoreData) {
      return;
    }
    this.setData({
      isLoadingMoreData: true
      ,pageNum:this.data.pageNum +1
    })
    heo.heoinfo.queryHeoInfos()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  release:function(e){
    if(!this.data.canRelease){
      wx.showToast({
        title: '您暂无发帖权限',
        icon:'none',
        duration:3000
      })
      return false;
    }

    if(!this.data.huStat || this.data.huStat != 'N'){
      wx.showToast({
        title: this.data.loginErrDesc ? this.data.loginErrDesc : '您当前房屋还未绑定，暂时不能发贴。',
        icon:'none',
        duration:3000
      })
      return false;
    }
    this.setData({
      showHeoTypeClass:!this.data.showHeoTypeClass
    })
  },
  bindChangeTab:function(e){
    heo.heoinfo.refreshHeoInfo(e.detail.index);
  },
  closeCheckHeoType:function(){
    this.setData({
      showHeoTypeClass:!1
    })
  },
  previewImage: function(e){
    wx.previewImage({
        current: e.currentTarget.dataset.id,
        urls:e.currentTarget.dataset.item
    })
  },
  chekHeoInfoDetail:function(e){
    console.log(e.currentTarget.dataset.item)
    var heoInfo = e.currentTarget.dataset.item;
    wx.navigateTo({
      url: '/subpages/heo/heodetail/heodetail?heoDate=' + heoInfo.heoDate + "&heoSeqId=" + heoInfo.heoSeqId
    })
  },
  moveEnd:function(e){
    var xNumLeft = 20 / 750 * app.globalData.windowW;
  	var xNumRight = 660 / 750 * app.globalData.windowW;
  	var x = e.changedTouches[0].pageX;
    var average = 375 / 750 * app.globalData.windowW;
  	var yNum = e.changedTouches[0].clientY - 25;
  	if (x < average) {
  		this.setData({
  			x: xNumLeft,
			  y: yNum < 55 ? 55 : yNum
  		})
  	} else {
  		this.setData({
  			x: xNumRight,
		  	y: yNum < 55 ? 55 : yNum
  		})
    }
  },
  onHeoTypeChange:function(e){
    console.log(e.currentTarget.dataset.item.heoType)
    var heoTypeList = this.data.heoTypeList;
    var heoTypeDesc = this.data.heoTypeDesc;
    var heoType = this.data.heoType;
    if(e.currentTarget.dataset.item.disabled){
      return false;
    }
    for(var index in heoTypeList){
      for(var i in heoTypeList[index].heoTypes){
        if(heoTypeList[index].heoTypes[i].heoType == e.currentTarget.dataset.item.heoType){
          heoTypeList[index].heoTypes[i].select = true
          heoTypeDesc = heoTypeList[index].heoTypes[i].heoTypeDesc
          heoType = heoTypeList[index].heoTypes[i].heoType
        }else{
          heoTypeList[index].heoTypes[i].select = false
        }
      }
    }
    this.selectComponent('#heoType').toggle();
    this.setData({
      heoType:heoType,
      heoTypeDesc:heoTypeDesc,
      heoTypeList:heoTypeList,
      heoType:e.currentTarget.dataset.item.heoType,
      heoInfos:new Array(),
      pageNum:1,
      queryFinish:false
    })
    heo.heoinfo.initIsTopHeoInfos();
  },
  onNeedOrGiveChange:function(e){
    var needOrgives = this.data.needOrgives;
    for(var index in needOrgives){
      for(var j in needOrgives[index]){
        if(needOrgives[index][j].type == e.currentTarget.dataset.item.type){
          needOrgives[index][j].select = true
        }else{
          needOrgives[index][j].select = false
        }
      }
    }
    this.selectComponent('#needOrgive').toggle();
    this.setData({
      needOrgives:needOrgives,
      neefOrGive:e.currentTarget.dataset.item.type,
      heoInfos:new Array(),
      pageNum:1,
      queryFinish:false
    })
    if(e.currentTarget.dataset.item.type == 'S' 
    || e.currentTarget.dataset.item.type == 'P'
    || e.currentTarget.dataset.item.type == 'E'){
      var heoTypeList = that.data.heoTypeList;
      for(var i in heoTypeList){
        for(var j in heoTypeList[i].heoTypes){
          console.log(heoTypeList[i].heoTypes[j])
          if(heoTypeList[i].heoTypes[j].heoType != '99'){
            heoTypeList[i].heoTypes[j].disabled = !0;
            heoTypeList[i].heoTypes[j].select = !1;
          }else{
            heoTypeList[i].heoTypes[j].disabled = !1;
            heoTypeList[i].heoTypes[j].select = !0;
          }
        }
      }
      that.setData({
        heoType:'99',
        heoTypeDesc:'其他',
        heoTypeList:heoTypeList
      })
    }else{
      var heoTypeList = that.data.heoTypeList;
      for(var i in heoTypeList){
        for(var j in heoTypeList[i].heoTypes){
          console.log(heoTypeList[i].heoTypes[j])
          heoTypeList[i].heoTypes[j].disabled = !1;
          if(heoTypeList[i].heoTypes[j].heoType == ''){
            heoTypeList[i].heoTypes[j].select = !0;
          }else{
            heoTypeList[i].heoTypes[j].select = !1;
          }
        }
      }
      that.setData({
        heoType:'',
        heoTypeDesc:'全部',
        heoTypeList:heoTypeList
      })
    }
    heo.heoinfo.initIsTopHeoInfos();
  },
  onDropMenuOpenGoN:function(){
    this.setData({
      checkNoG:true,
      checkAll:false
    })
  },
  onSelectAllChange:function(){
    this.setData({
      checkAll:true
    })
  },
  navigateToMineRelease:function(e){
    wx.navigateTo({
      url: '/subpages/heo/mineRelease/mineRelease?type=' + e.currentTarget.dataset.type
    })
  },
  onLoadMore:function(){
    this.setData({
      isLoadingMoreData:!0,
      pageNum:this.data.pageNum + 1
    })
    heo.heoinfo.queryHeoInfos()
  },
  refreshHeoInfos:function(heoInfo){
    var heoInfos = this.data.heoInfos;
    for(var index in heoInfos){
      if(heoInfo.heoDate == heoInfos[index].heoDate
        && heoInfo.heoSeqId == heoInfos[index].heoSeqId){
          heoInfos[index].stat = heoInfo.stat
          heoInfos[index].notReadMsgCount = 0
          heoInfos[index].takePartInPraise = heoInfo.takePartInPraise,
          heoInfos[index].praiseCnt = heoInfo.praiseCnt
        }
    }
    this.setData({
      heoInfos:heoInfos
    })
  },
  praiseHeo:function(e){
    let heoInfo = e.currentTarget.dataset.item;
    let heoInfos = that.data.heoInfos;
    that.showLoading(!0)
    app.req.postRequest(api.doHeoPraise, {heoDate:heoInfo.heoDate,heoSeqId:heoInfo.heoSeqId,houseSeqId:heoInfo.houseSeqId}).then(function (res) {
      if(res.data && res.data.RESPCODE == '000'){
        for(var index in heoInfos){
          if(heoInfos[index].heoDate == heoInfo.heoDate &&
            heoInfos[index].heoSeqId == heoInfo.heoSeqId){
              heoInfos[index].takePartInPraise = heoInfos[index].takePartInPraise == 'Y' ? 'N' : 'Y';
              heoInfos[index].praiseCnt = heoInfos[index].takePartInPraise == 'Y' ? parseInt(heoInfos[index].praiseCnt) + 1 : parseInt(heoInfos[index].praiseCnt) - 1 
              break;
            }
        }
        that.setData({
          heoInfos:heoInfos
        })
      }else{
        wx.showToast({
          title: '网络异常，请稍后重试',
          icon:'none',
          duration:3000
        })
      }
      that.showLoading(!1)
    })
  }
})