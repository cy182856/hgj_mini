//queryQnQueAns.js
var app = getApp();
//const network = require("../../../utils/network.js");
const apiConstant = require('../../../const/api.js');
const strUtil = require('../../../utils/stringUtil.js');

Page({
  data:{
		qnDate:"",
    qnSeqId:"",
    isQueryAns:"",
    custId:"",
    huSeqId:"",
		qnQueListDtoList:[],
		optIdArray: [
      {id: '01', desc: 'A'},
      {id: '02', desc: 'B'},
      {id: '03', desc: 'C'},
      {id: '04', desc: 'D'},
      {id: '05', desc: 'E'},
      {id: '06', desc: 'F'},
      {id: '07', desc: 'G'},
      {id: '08', desc: 'H'},
      {id: '09', desc: 'I'},
      {id: '10', desc: 'J'},
    ],
    disabled:true,
    submitRespCode:'',
    qnName:'',
    qnDesc:'',
    qnRemark: '',
    autosize:{maxHeight: 49, minHeight: 49},
    houseName: '',
    signImgUrl:'',
	},
	
  //生命周期函数--监听页面加载
  onLoad: function (options) {
	  app.loading();
	  this.showLoading(true);
    this.qnDate = options.qnDate;
    this.qnSeqId = options.qnSeqId;
    this.isQueryAns = options.isQueryAns;
    var loginInfo = app.storage.getLoginInfo();
    this.custId = loginInfo.custId;
    this.huSeqId = options.huSeqId;
    console.log('options.huSeqId = '+this.huSeqId);
    if (typeof this.huSeqId == undefined || this.huSeqId == null || this.huSeqId == '') {
      this.huSeqId = loginInfo.huSeqId;
      console.log('options中未传huSeqId，则取loginInfo.huSeqId = '+this.huSeqId);
    }
    console.log('options.qnDate='+options.qnDate+'，options.qnSeqId='+options.qnSeqId+'，options.isQueryAns='+options.isQueryAns
                +'，loginInfo.custId='+this.custId+'，huSeqId（options的或loginInfo的）='+this.huSeqId);

    let houseName = loginInfo.completeAddr;
    this.setData({
      qnDate:this.qnDate,
      qnSeqId:this.qnSeqId,
      isQueryAns:this.isQueryAns,
      custId:this.custId,
      huSeqId:this.huSeqId,
      houseName: houseName,
		});
		
		this.queryQnQueList();
  },
	
	queryQnQueList:function(e){
    console.log('开始查询问卷问题及答案列表，URL='+apiConstant.QueryQnQueList);
    let qnDate_temp = this.data.qnDate;
    let qnSeqId_temp = this.data.qnSeqId;
    let isQueryAns_temp = this.data.isQueryAns;
    let custId_temp = this.data.custId;
    let huSeqId_temp = this.data.huSeqId;
    if (qnDate_temp == "" || qnSeqId_temp == "" || isQueryAns_temp == ""
          || custId_temp == "" || huSeqId_temp == "") {
        wx.showToast({
          title: "网络异常，获取关键信息失败",
          icon: "none"
        });
        return;
		}
    let filterCondition = {'qnDate':qnDate_temp, 'qnSeqId':qnSeqId_temp, 'isQueryAns':isQueryAns_temp, 
                            'custId':custId_temp, 'huSeqId':huSeqId_temp};
    console.log(filterCondition);
    let that = this;
    app.req.postRequest(apiConstant.QueryQnQueList,filterCondition).then(resp=>{
      console.log(resp);
      this.showLoading(0);
      let resp_data = resp.data;
      if(resp_data.respCode != "000"){
        console.log(resp_data.respCode);
        that.setData({
          qnQueListDtoList: []
        });
        //throw resp_data.errDesc;
      } else {
        console.log(resp_data.qnQueListDtoList);
        that.setData({
          qnQueListDtoList: resp_data.qnQueListDtoList,
          submitRespCode: resp_data.submitRespCode,
          qnName: resp_data.qnName,
          qnDesc: resp_data.qnDesc,
          qnRemark: resp_data.qnRemark,
          signImgUrl: resp_data.signImgUrl,
          submitDateDesc: resp_data.submitDateDesc,
        });
        let submitHuSeqId = resp_data.submitHuSeqId;
        let qnUniqueType = resp_data.qnUniqueType;
        console.log('submitHuSeqId = ' + submitHuSeqId+'，qnUniqueType = ' + qnUniqueType+'，that.data.huSeqId = '+huSeqId_temp)
        if (submitHuSeqId != null && submitHuSeqId != huSeqId_temp && qnUniqueType != null && qnUniqueType == 'H') {
          // that.setData({
          //   disabled:true
          // });
          wx.showModal({
            content: '该问卷一个住房中只能一人提交，点击确定查看已提交人的问卷答题详情？',
            showCancel: true,
            cancelText: '返回',
            success: function (res) {
              if (res.confirm) {
                console.log('用户点击确定')
                that.redirectToQueryQnQueAns(qnDate_temp, qnSeqId_temp, submitHuSeqId);
                return false;
              } else if (res.cancel) {
                console.log('用户点击取消')
                wx.navigateBack({
                  url: '/subpages/qn/queryQnInfo/queryQnInfo'
                })
                return false;
              }
            }
          });
        }
      }
    });
    // wx.request({
    //   url : apiConstant.QueryQnQueList,
    //   data : filterCondition,
    //   method : "POST",
    //   // header : {'content-type' : 'application/x-www-form-urlencoded'},
    //   header : {'content-type' : 'application/json'},
    //   dataType : "json",
    //   success : function(resp){
    //     let resp_data = resp.data;
    //     console.log(resp);
    //     console.log(resp_data);
    //     if(resp_data.respCode != "000"){
    //     	console.log(resp_data.respCode);
    //       that.setData({
    //         qnQueListDtoList: []
    //       });
    //       //throw resp_data.errDesc;
    //     } else {
    //     	console.log(resp_data.qnQueListDtoList);
    //       that.setData({
    //         qnQueListDtoList: resp_data.qnQueListDtoList,
    //         submitRespCode: resp_data.submitRespCode,
    //         qnName: resp_data.qnName,
    //         qnDesc: resp_data.qnDesc,
    //         qnRemark: resp_data.qnRemark,
    //         signImgUrl: resp_data.signImgUrl,
    //         submitDateDesc: resp_data.submitDateDesc,
    //       });
    //       let submitHuSeqId = resp_data.submitHuSeqId;
    //       let qnUniqueType = resp_data.qnUniqueType;
    //       console.log('submitHuSeqId = ' + submitHuSeqId+'，qnUniqueType = ' + qnUniqueType+'，that.data.huSeqId = '+huSeqId_temp)
    //       if (submitHuSeqId != null && submitHuSeqId != huSeqId_temp && qnUniqueType != null && qnUniqueType == 'H') {
    //         // that.setData({
    //         //   disabled:true
    //         // });
    //         wx.showModal({
    //           content: '该问卷一个住房中只能一人提交，点击确定查看已提交人的问卷答题详情？',
    //           showCancel: true,
    //           cancelText: '返回',
    //           success: function (res) {
    //             if (res.confirm) {
    //               console.log('用户点击确定')
    //               that.redirectToQueryQnQueAns(qnDate_temp, qnSeqId_temp, submitHuSeqId);
    //               return false;
    //             } else if (res.cancel) {
    //               console.log('用户点击取消')
    //               wx.navigateBack({
    //                 url: '/subpages/qn/queryQnInfo/queryQnInfo'
    //               })
    //               return false;
    //             }
    //           }
    //         });
    //       }
    //     }
    //   },
    //   fail:function(resp){
    //     console.log(resp);
    //     var cur_title;
    //     if (resp.errMsg != null || resp.errMsg != "") {
    //     	cur_title = resp.errMsg;
    //     } else {
    //       cur_title = resp.data.errDesc;
    //     }
    //     //错误提示信息
    //     wx.showToast({
    //       title: cur_title,
    //       icon: "none"
    //     })
    //   },
    //   complete:function(){
		//     that.showLoading(false);
    //   }
      
    // });
	},
  
  redirectToQueryQnQueAns:function(qnDate, qnSeqId, huSeqId){
    console.log("onTapWatchDetail2-qnDate:" + qnDate + "，qnSeqId=" + qnSeqId + "，isQueryAns=Y" + "，huSeqId=" + huSeqId);
    wx.redirectTo({
      url: '/subpages/qn/queryQnQueAns/queryQnQueAns?isQueryAns=Y&qnDate='+qnDate+'&qnSeqId='+qnSeqId+'&huSeqId='+huSeqId,
    });
  },

});
