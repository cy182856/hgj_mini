const apiUtil = require('../../const/api.js')
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
   'APPTORDLOGDTOS':[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.loading(), this.showLoading(!1);
     let ordDate=options.ordDate;
     let ordSeqId=options.ordSeqId;
     this.ordDate=ordDate;
     this.ordSeqId=ordSeqId;
     this.requestApptOrdInfo();
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

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  doReturn:function(){
    wx.redirectTo({
      url: '/subpages/appt/mine_appt'
    })
  },
  requestApptOrdInfo: function () {
    this.showLoading(!0);
    var app = getApp();
    var data = {
      'custId': app.storage.getLoginInfo().custId,
      'ordBeginDate': this.ordDate,
      'ordEndDate': this.ordDate,
      'ordSeqId': this.ordSeqId,
      'pageNum': 1,
      'pageSize': 10
    };
    var that = this;
    var res = app.req.postRequest(apiUtil.queryApptOrdLog,data).then(function (res) {
      console.log("返回结果:" + JSON.stringify(res.data));
      if (res.data.RESPCODE == '000') {
        that.setData({ 'APPTORDLOGDTOS': res.data.APPTORDLOGDTOS });
      } else {
        //接口返回错误
        wx.showToast({
          title: res.data.ERRDESC + '[' + res.data.RESPCODE + ']',
          icon: 'none'
        })
      }
      that.showLoading(!1);
    });
  },
})