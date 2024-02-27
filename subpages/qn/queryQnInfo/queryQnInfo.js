//queryQnInfo.js
var app = getApp();
const apiConstant = require('../../../const/api.js');

Page({
  data:{
		custId:"",
		huSeqId:"",
		ongoingQnInfoDtos:[],
		submittedQnInfoDtos:[],
		pageNum:1,
    pageSize:5,
    loading: false,//是否正在加载
    more: false, //是否还有数据
    houseSeqId:"",

    going: true,
    submitted: false,
    ended: false,

    pageNumEnded:1,
    pageSizeEnded:8,
    moreEnded: false, //是否还有数据
    expQnInfoDtos:[],
    submitted:'',
	},
	
  //生命周期函数--监听页面加载
  onLoad: function (options) {
	  app.loading();
    this.showLoading(true);
    var loginInfo = app.storage.getLoginInfo();
    this.custId = loginInfo.custId;
    this.huSeqId = loginInfo.huSeqId;
    this.houseSeqId = loginInfo.houseSeqId;
    console.log('loginInfo.custId='+this.custId+'，loginInfo.huSeqId='+this.huSeqId+'，loginInfo.houseSeqId='+this.houseSeqId);
    
    let submitted = false;
    let going = true;
    if(options !== undefined && options.submitted !== undefined && options.submitted == 'Y'){
      submitted = true;
      going = false;
    }
    this.setData({
      custId:this.custId,
      huSeqId:this.huSeqId,
      ongoingQnInfoDtos:[],
		  submittedQnInfoDtos:[],
      pageNum:1,
      houseSeqId:this.houseSeqId,
      submitted: submitted,
      going: going,
		});
		
    this.queryQnInfos();
    this.queryExpQnInfos();
  },
	
	queryQnInfos:function(e){
    console.log('开始查询我的问卷记录，URL='+apiConstant.QueryQnInfos);
    if (this.data.custId == "" || this.data.huSeqId == "") {
        wx.showToast({
          title: "网络异常，获取关键信息失败",
          icon: "none"
        })
        return;
		}
    let filterCondition = { 'custId':this.data.custId,'huSeqId':this.data.huSeqId, 
                            'pageNum':this.data.pageNum, 'pageSize':this.data.pageSize};
    console.log(filterCondition);
    let that = this;
    app.req.postRequest(apiConstant.QueryQnInfos,filterCondition).then(resp=>{
      console.log('res========>',resp);
      this.showLoading(0);
      let resp_data = resp.data;
      if(resp_data.respCode != "000"){
        // that.setData({
        //   ongoingQnInfoDtos: [],
        //   submittedQnInfoDtos: []
        // });
        wx.showToast({
          icon:'none',
          title: resp_data.errDesc
        });
      } else {
        that.setData({
          ongoingQnInfoDtos: resp_data.ongoingQnInfoDtos,
          submittedQnInfoDtos: that.data.submittedQnInfoDtos.concat(resp_data.submittedQnInfoDtos),
          // count: resp_data.count,
          more: (that.data.submittedQnInfoDtos.length + resp_data.submittedQnInfoDtos.length  < resp_data.count) ? true :false,
          loading:false,
        });
      }
    });
    // wx.request({
    //   url : apiConstant.QueryQnInfos,
    //   data : filterCondition,
    //   method : "POST",
    //   // header : {'content-type' : 'application/x-www-form-urlencoded'},
    //   header : {'content-type' : 'application/json'},
    //   dataType : "json",
    //   success : function(resp){
    //     console.log(resp);
    //     let resp_data = resp.data;
    //     if(resp_data.respCode != "000"){
    //       // that.setData({
    //     	//   ongoingQnInfoDtos: [],
    //     	//   submittedQnInfoDtos: []
    //       // });
    //       wx.showToast({
    //         icon:'none',
    //         title: resp_data.errDesc
    //       });
    //     } else {
    //       that.setData({
    //     	  ongoingQnInfoDtos: resp_data.ongoingQnInfoDtos,
    //         submittedQnInfoDtos: that.data.submittedQnInfoDtos.concat(resp_data.submittedQnInfoDtos),
    //         // count: resp_data.count,
    //         more: (that.data.submittedQnInfoDtos.length + resp_data.submittedQnInfoDtos.length  < resp_data.count) ? true :false,
    //         loading:false,
    //       });
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
  
  onTapWatchDetail:function(e){
	  console.log(e);
    var qnDate = e.currentTarget.dataset.qndate;
    var qnSeqId = e.currentTarget.dataset.qnseqid;
    console.log("onTapWatchDetail-qnDate:" + qnDate + "，qnSeqId=" + qnSeqId);
    // this.queryQnHouseSubmits(qnDate, qnSeqId);
    wx.navigateTo({
      url: '/subpages/qn/queryQnQueList/queryQnQueList?qnDate='+qnDate+'&qnSeqId='+qnSeqId,
    });
  },
/**  //暂不用该方法，所以注释掉。
  queryQnHouseSubmits:function(qnDate, qnSeqId){
    console.log('开始查询是否有其他人已提交问卷（问卷唯一类型为按房唯一时，若已有人提交，则不可进入问卷答题页面），URL='
                  +apiConstant.queryQnHouseSubmits);
    if (this.data.custId == "" || this.data.houseSeqId == "") {
        wx.showToast({
          title: "网络异常，获取关键信息失败",
          icon: "none"
        });
        return false;
		}
    let filterCondition = {'custId':this.data.custId, 'houseSeqId':this.data.houseSeqId, 
                            'qnBeginDate':qnDate, 'qnEndDate':qnDate, 'qnSeqId':qnSeqId, 'pageNum':'1', 'pageSize':'10'};
    console.log(filterCondition);
    let that = this;
    wx.request({
      url : apiConstant.queryQnHouseSubmits,
      data : filterCondition,
      method : "POST",
      // header : {'content-type' : 'application/x-www-form-urlencoded'},
      header : {'content-type' : 'application/json'},
      dataType : "json",
      success : function(resp){
        console.log(resp);
        let resp_data = resp.data;
        if(resp_data.respCode != "000"){
          wx.showToast({
            icon:'none',
            title: resp_data.errDesc
          });
          return false;
        } else {
          // 如果有人已提交，弹出是否查看详情提示信息。
          if (resp_data.totalRecord != 0) {
            wx.showModal({
              content: '该问卷一个住房中只能一人提交，点击确认查看已提交人的问卷答题详情？',
              showCancel: true,
              success: function (res) {
                if (res.confirm) {
                  console.log('用户点击确定')
                  let huSeqId_submitted = resp_data.qnHouseSubmitDtos[0].huSeqId;
                  // console.log('huSeqId_submitted = ' + huSeqId_submitted)
                  that.navigateToQueryQnQueAns(qnDate, qnSeqId, huSeqId_submitted);
                  return false;
                } else if (res.cancel) {
                  console.log('用户点击取消')
                  return false;
                }
              }
            });
          } else {
            wx.navigateTo({
              url: '/subpages/qn/queryQnQueList/queryQnQueList?qnDate='+qnDate+'&qnSeqId='+qnSeqId,
            })
            return true;
          }
        }
      },
      fail:function(resp){
        console.log(resp);
        var cur_title;
        if (resp.errMsg != null || resp.errMsg != "") {
        	cur_title = resp.errMsg;
        } else {
          cur_title = resp.data.errDesc;
        }
        //错误提示信息
        wx.showToast({
          title: cur_title,
          icon: "none"
        });
        return false;
      },
      complete:function(){
		    
      }
    });
  },
  
  navigateToQueryQnQueAns:function(qnDate, qnSeqId, huSeqId){
    console.log("onTapWatchDetail2-qnDate:" + qnDate + "，qnSeqId=" + qnSeqId + "，isQueryAns=Y" + "，huSeqId=" + huSeqId);
    wx.navigateTo({
      url: '/subpages/qn/queryQnQueAns/queryQnQueAns?isQueryAns=Y&qnDate='+qnDate+'&qnSeqId='+qnSeqId+'&huSeqId='+huSeqId,
    });
  },
*/
  onTapWatchDetail2:function(e){
	  console.log(e);
    var qnDate = e.currentTarget.dataset.qndate;
    var qnSeqId = e.currentTarget.dataset.qnseqid;
    console.log("onTapWatchDetail2-qnDate:" + qnDate + "，qnSeqId=" + qnSeqId+ "，isQueryAns=Y")
    wx.navigateTo({
      url: '/subpages/qn/queryQnQueAns/queryQnQueAns?isQueryAns=Y&qnDate='+qnDate+'&qnSeqId='+qnSeqId,
    })
  },
  
  onTapGotoExpQnInfos:function(e){
    // console.log(e);
    var navi_url = "/subpages/qn/queryExpQnInfos/queryExpQnInfos";
    console.log("onTapGotoExpQnInfos - url：" + navi_url);
    wx.navigateTo({
      url: navi_url,
    })
  },

  onLoadMore:function(){
    this.data.pageNum = this.data.pageNum +1;
    this.data.loading = true;
    this.queryQnInfos()
  },

  onNavigateToOngoingListPage:function(e){
    // console.log(e);
    var navi_url = "/subpages/qn/queryOngoingQnInfos/queryOngoingQnInfos";
    console.log("onNavigateToOngoingListPage - url：" + navi_url);
    wx.navigateTo({
      url: navi_url,
    })
  },


  queryExpQnInfos:function(e){
    console.log('开始查询已结束问卷记录，URL='+apiConstant.queryExpQnInfos);
    if (this.data.custId == "" || this.data.huSeqId == "") {
        wx.showToast({
          title: "网络异常，获取关键信息失败",
          icon: "none"
        })
        return;
		}
    let filterCondition = {'custId':this.data.custId,'huSeqId':this.data.huSeqId, 
                            'pageNum':this.data.pageNumEnded, 'pageSize':this.data.pageSizeEnded};
    console.log(filterCondition);
    let that = this;
    app.req.postRequest(apiConstant.queryExpQnInfos,filterCondition).then(res=>{
      console.log("res======>",res);
      let resp_data = res.data;
      if(resp_data.respCode != "000"){
        wx.showToast({
          icon:'none',
          title: resp_data.errDesc
        });
      } else {
        that.setData({
          expQnInfoDtos: that.data.expQnInfoDtos.concat(resp_data.expQnInfoDtos),
          // count: resp_data.count,
          moreEnded: (that.data.expQnInfoDtos.length + resp_data.expQnInfoDtos.length  < resp_data.count) ? true :false,
          loading:false,
        });
      }
    });
    // wx.request({
    //   url : apiConstant.queryExpQnInfos,
    //   data : filterCondition,
    //   method : "POST",
    //   // header : {'content-type' : 'application/x-www-form-urlencoded'},
    //   header : {'content-type' : 'application/json'},
    //   dataType : "json",
    //   success : function(resp){
    //     console.log(resp);
    //     let resp_data = resp.data;
    //     if(resp_data.respCode != "000"){
    //       wx.showToast({
    //         icon:'none',
    //         title: resp_data.errDesc
    //       });
    //     } else {
    //       that.setData({
    //     	  expQnInfoDtos: that.data.expQnInfoDtos.concat(resp_data.expQnInfoDtos),
    //         // count: resp_data.count,
    //         moreEnded: (that.data.expQnInfoDtos.length + resp_data.expQnInfoDtos.length  < resp_data.count) ? true :false,
    //         loading:false,
    //       });
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
  onLoadMoreExpQnInfos:function(){
    this.data.pageNumEnded = this.data.pageNumEnded +1;
    this.data.loading = true;
    this.queryExpQnInfos()
  },

  choseTab: function(e){
    let tab = e.currentTarget.dataset.tab;
    let going = false, submitted = false, ended = false;
    if(tab == 'going') going = true;
    if(tab == 'submitted') submitted = true;
    if(tab == 'ended') ended = true;
    this.setData({
      going: going,
      submitted: submitted,
      ended: ended
    });

  }

})