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
    carPayLogs:[],
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
      carPayLogs:[],
      iphoneX:app.globalData.iphoneX
    })
    this.queryCarPayLogs()
  },

  // 开票验证
  makeInvoiceCheck:function(e){
    var that = this;
    var orderId = e.currentTarget.dataset.datavalue.id;
    var data = {};
    data['orderId'] = orderId;
    data['cstCode'] = app.storage.getCstCode();
    data['wxOpenId'] = app.storage.getWxOpenId();
    data['proNum'] = app.storage.getProNum();
    // 后端接口验证 开票条件：1、缴费成功  2、N月以内
    app.req.postRequest(api.parkPayInvoiceCheck,data).then(res=>{
      if(res.data.respCode == '000'){
          wx.navigateTo({
            url: '/subpages/carpay/carPayInvoice/carPayInvoice?orderId=' + orderId,
          })       
      }else{
        wx.showToast({
          icon:'none',
          title: res.data.errDesc,
          duration:3000
        })
      }
    });   
  },

  // 已开票，查看发票
  viewInvoice:function(e){
    var orderId = e.currentTarget.dataset.datavalue.id;
    wx.navigateTo({
      url: '/subpages/carpay/viewInvoice/viewInvoice?orderId=' + orderId,
    })   
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
      carPayLogs:new Array()
    })
    this.queryCarPayLogs()
    wx.stopPullDownRefresh({
      success: (res) => {},
    })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  // onReachBottom: function () {
  //   if (this.data.isRefreshing || this.data.loading || !this.data.more) {
  //     return;
  //   }
  //   this.onLoadMore()
  // },
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
  queryCarPayLogs:function(type){
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
    app.req.postRequest(api.queryCarPayLog, queryParams).then(function (value) {
      console.log("queryCarPayLogs 返回", value);
      if(value.data.respCode == "000"){
        var carPayList = value.data.list;
        let totalNum = value.data.totalNum;
        var pages = parseInt(value.data.pages);
        that.data.carPayLogs.push.apply(that.data.carPayLogs,carPayList);
   
        that.setData({
          pages:pages,
          carPayLogs:type == 'loadMore'?that.data.carPayLogs:carPayList,
          totalNum:totalNum,
           isRefreshing:false
        })
      }
      that.showLoading(!1)
    }, function (value) {
      console.log("queryCarPayLogs F ", value);
      wx.showToast({
        icon:'none',
        title: '查询历史记录失败'
      })
      that.showLoading(!1)
    }); 
  },
 
  loadMore(event){
    var pageNum = this.data.pageNum + 1;
    this.setData({
      pageNum:pageNum,
    });
    this.queryCarPayLogs('loadMore');
  },
})