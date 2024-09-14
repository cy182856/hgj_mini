const api = require('../../../const/api'),
 app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    pageNum:1,
    pageSize:10,
    pages:10,
    totalNum:1,
    qns:[],
    loading: false,//是否正在加载
    more: false //是否还有数据
  },

  loadMore(event){
    var pageNum = this.data.pageNum + 1;
    this.setData({
      pageNum:pageNum,
    });
    this.queryQns('loadMore');
  },

  queryQns:function(type){
    var that = this;
    var queryParams = {
      proNum:app.storage.getProNum(),
      pageNum:that.data.pageNum,
      pageSize:that.data.pageSize
    };
    that.showLoading(!0)
    app.req.postRequest(api.couponQuery, queryParams).then(function (value) {
      console.log("queryQns 返回", value);
      if(value.data.respCode == "000"){
        var qnList = value.data.couponGrantList;
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

  costDetail: function (event) {
   
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
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
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})