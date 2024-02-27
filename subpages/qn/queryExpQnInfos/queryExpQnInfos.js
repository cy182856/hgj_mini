//subpages/qn/queryExpQnInfos/queryExpQnInfos.js
var app = getApp();
const apiConstant = require('../../../const/api.js');

Page({
  data:{
		custId:"",
    huSeqId:"",
    
		pageNum:1,
    pageSize:8,
    loading: false,//是否正在加载
    more: false, //是否还有数据
    expQnInfoDtos:[],
    // count:'',
	},
	
  //生命周期函数--监听页面加载
  onLoad: function (options) {
	  app.loading();
    this.showLoading(true);
    var loginInfo = app.storage.getLoginInfo();
    this.custId = loginInfo.custId;
    this.huSeqId = loginInfo.huSeqId;
    console.log('loginInfo.custId='+this.custId+'，loginInfo.huSeqId='+this.huSeqId);
    
    this.setData({
      custId:this.custId,
      huSeqId:this.huSeqId,
		});
		
		this.queryExpQnInfos();
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
    let filterCondition = {'custId':this.data.custId, 'huSeqId':this.data.huSeqId, 
                            'pageNum':this.data.pageNum, 'pageSize':this.data.pageSize};
    console.log(filterCondition);
    let that = this;
    app.req.postRequest(apiConstant.queryExpQnInfos,filterCondition).then(resp=>{
      console.log(resp);
      this.showLoading(0);
      let resp_data = resp.data;
      if(resp_data.respCode != "000"){
        wx.showToast({
          icon:'none',
          title: resp_data.errDesc
        });
      } else {
        that.setData({
          expQnInfoDtos: that.data.expQnInfoDtos.concat(resp_data.expQnInfoDtos),
          // count: resp_data.count,
          more: (that.data.expQnInfoDtos.length + resp_data.expQnInfoDtos.length  < resp_data.count) ? true :false,
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
    //         more: (that.data.expQnInfoDtos.length + resp_data.expQnInfoDtos.length  < resp_data.count) ? true :false,
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

  onTapQueryExpQnInfo:function(e){
	  console.log(e);
    var qnDate = e.currentTarget.dataset.qndate;
    var qnSeqId = e.currentTarget.dataset.qnseqid;
    console.log("onTapQueryExpQnInfo-qnDate:" + qnDate + "，qnSeqId=" + qnSeqId+ "，isQueryAns=Y")
    wx.navigateTo({
      url: '/subpages/qn/queryQnQueAns/queryQnQueAns?isQueryAns=Y&qnDate='+qnDate+'&qnSeqId='+qnSeqId,
    })
  },

  onLoadMore:function(){
    this.data.pageNum = this.data.pageNum +1;
    this.data.loading = true;
    this.queryExpQnInfos()
  },
  
})