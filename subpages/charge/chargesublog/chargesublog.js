var that = null,
app = getApp();
const api = require('../../../const/api');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    padding_bottom:0,
    chargeOrdLogs:new Array()
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.loading(),that = this, that.showLoading(!1);
    that.queryChargeSubLogs();
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
 
  queryChargeSubLogs:function(){
    that.showLoading(!0)
    let queryParams = {
      subStat: 'N'
    }
    app.req.postRequest(api.queryChargeSubLog, queryParams).then(function (res){
      if(res.data && res.data.respCode == '000'){
        that.setData({
          padding_bottom:app.globalData.iphoneX ?  '36' : '0',
          chargeSubLogs : res.data.data,
          loading : false
        })
      }else{
        wx.showToast({
          title: '获取订阅记录失败',
          icon:'none',
          duration:2000
        })
      }
      that.showLoading(!1)
    })
  },
  doCancelChargeSub:function(e){
    that.showLoading(!0)
    let chargeOrdLog = e.currentTarget.dataset.item;
    that.cancelChargeSubLog(chargeOrdLog);
    that.showLoading(!1);
  },
 
  cancelChargeSubLog:function(chargeOrdLog){
    that.showLoading(!0)
    let updateParams = {
      subDate: chargeOrdLog.subDate,
      subObjId: chargeOrdLog.subObjId,
      subType: chargeOrdLog.subType,
      subStat: 'C',
    }
    app.req.postRequest(api.updateChargeSubLog, updateParams).then(function (res){
      if(res.data && res.data.respCode == '000'){
        that.queryChargeSubLogs();
        wx.showToast({
          title: '取消订阅成功',
          icon:'none',
          duration:2000
        })
      }else{
        wx.showToast({
          title: '取消订阅失败',
          icon:'none',
          duration:2000
        })
      }
      that.showLoading(!1)
    })
  }
})