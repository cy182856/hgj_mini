const app = getApp();
const api = require("../../../const/api");
//import Dialog from '../../../miniprogram_npm/@vant/weapp/dialog/dialog';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pageNum:1,
    pageSize:10,
    pages:10,
    totalNum:1,
    visitLogs:[],
    loading: false,//是否正在加载
    more: false, //是否还有数据
    iphoneX:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.loading(),this.showLoading(!1)
    this.setData({
      pageNum:1,
      pageSize:10,
      visitLogs:[],
      iphoneX:app.globalData.iphoneX
    })
    this.queryVisitLogs()
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
      visitLogs:new Array()
    })
    this.queryVisitLogs()
    wx.stopPullDownRefresh({
      success: (res) => {},
    })
  },

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

  },
  queryVisitLogs:function(type){
    var that = this;
    var queryParams = {
      cstCode:app.storage.getCstCode(),
      wxOpenId:app.storage.getWxOpenId(),
      proNum:app.storage.getProNum(),
      proName:app.storage.getProName(),
      pageNum:that.data.pageNum,
      pageSize:that.data.pageSize
    };
    that.showLoading(!0)
    app.req.postRequest(api.queryOpenDoorQuickCodeLog, queryParams).then(function (value) {
      console.log("queryVisitLogs 返回", value);
      if(value.data.respCode == "000"){
        var visitLogList = value.data.quickCodeList;
        let totalNum = value.data.totalNum;
        var pages = parseInt(value.data.pages);
        that.data.visitLogs.push.apply(that.data.visitLogs,visitLogList);
   
        that.setData({
          pages:pages,
          visitLogs:type == 'loadMore'?that.data.visitLogs:visitLogList,
          totalNum:totalNum,
           isRefreshing:false
        })
      }
      that.showLoading(!1)
    }, function (value) {
      console.log("queryVisitLogs F ", value);
      wx.showToast({
        icon:'none',
        title: '查询当日记录失败'
      })
      that.showLoading(!1)
    }); 
  },
 
  loadMore(event){
    var pageNum = this.data.pageNum + 1;
    this.setData({
      pageNum:pageNum,
    });
    this.queryVisitLogs('loadMore');
  },
})