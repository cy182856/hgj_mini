const app = getApp();
const api = require("../../../const/api");

Page({
  data:{
    webViewUrl:'',
    pageNum:1,
    pageSize:10,
    pages:10,
    totalNum:1,
    qns:[],
    loading: false,//是否正在加载
    more: false //是否还有数据
	},
	
  //生命周期函数--监听页面加载
  onLoad: function (options) {
    //this.getQnGatewayUrl();   
    app.loading(),
    this.showLoading(!1)
    this.setData({
      pageNum:1,
      pageSize:10,
      qns:[]
    })
    this.queryQns()

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.setData({
      pageNum:1,
      more:true,
      loading:false,
      isRefreshing:true,
      qns:new Array()
    })
    this.queryQns()
    wx.stopPullDownRefresh({
      success: (res) => {},
    })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    let totalNum = this.data.totalNum;
    let pageNum = this.data.pageNum;
    let pageSize = this.data.pageSize;
    if(pageNum * pageSize < totalNum){
      this.loadMore();
    }else{
      wx.showToast({
        title: '已经到底了',
        icon:'none'
      })
    }
  },

  queryQns:function(type){
    var that = this;
    var queryParams = {
      proNum:app.storage.getProNum(),
      pageNum:that.data.pageNum,
      pageSize:that.data.pageSize
    };
    that.showLoading(!0)
    app.req.postRequest(api.queryQns, queryParams).then(function (value) {
      console.log("queryQns 返回", value);
      if(value.data.respCode == "000"){
        var qnList = value.data.list;
        let totalNum = value.data.totalNum;
        var pages = parseInt(value.data.pages);
        that.data.qns.push.apply(that.data.qns,qnList);
        that.setData({
          pages:pages,
          qns:type == 'loadMore'?that.data.qns:qnList,
          totalNum:totalNum,
          isRefreshing:false
        })
      }
      that.showLoading(!1)
    }, function (value) {
      console.log("queryQns F ", value);
      wx.showToast({
        icon:'none',
        title: '查询问卷失败'
      })
      that.showLoading(!1)
    }); 
  },

  loadMore(event){
    var pageNum = this.data.pageNum + 1;
    this.setData({
      pageNum:pageNum,
    });
    this.queryQns('loadMore');
  },

  fillInQn:function(e) { 
    this.showLoading(!1)
    var qn = e.currentTarget.dataset.qn
    wx.redirectTo({
      url: '/subpages/qn/qnWeb/qnWeb?webViewUrl=' + qn.url
    })
    
  },


  

  // getQnGatewayUrl(){
  //   var data = {};
  //   data['proNum'] = app.storage.getProNum();;
  //   app.req.postRequest(api.queryQnGatewayUrl, data).then(res => {
  //     if (res.data.respCode == '000') {
  //       let qnUrl = res.data.data.qnUrl;
  //       this.setData({
  //         webViewUrl: qnUrl
  //        })
  //     }
    
  // })
  // },


  // fillInQn:function(e) {
  //   var cstCode = app.storage.getCstCode();
  //   var url = 'pages/forms/publish?token=KXAYWl';
  //   var url = 'https://jinshuju.net/f/KXAYWl?field_45=18818286756';
  //    wx.navigateToMiniProgram({
  //      appId: 'wx34b0738d0eef5f78',
  //      path: url,     
  //      envVersion: 'release',
  //      success(res) {
  //        console.log("打开成功")
  //      }
  //    })
  //   var qn = e.currentTarget.dataset.qn
  //   let qnUrl = 'https://jinshuju.net/f/KXAYWl?wx_open_id=o_h_U5eS3F5zrpfP5vxA7e5L9wSw';
  //   wx.navigateTo({
  //     url: '/subpages/qn/qnWeb/qnWeb?webViewUrl=' + qn.url
  //   })
  //   this.setData({
  //     webViewUrl: webViewUrl
  //    })

  //  },

  //  toWebViewUrl() {
  //    this.setData({
  //     webViewUrl:'https://mp.weixin.qq.com/s?__biz=MzI0MTAzNTAwOQ==&mid=2247484106&idx=1&sn=01f31ce0cd058fca633a4a648a7d873a&chksm=e910f0a4de6779b2e5420c0fe3f9511924b0c210b8e25dbadf34d512e71852fe7ff17e3a36c6#rd'
  //    })
  //  },
 

})