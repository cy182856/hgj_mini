// subpages/gonggao/web/ggDetail.js
const app = getApp();
const api = require("../../../const/api");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    webViewUrl:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.loading(),
    this.showLoading(!1)
    var wxOpenId = app.storage.getWxOpenId();
    let webViewUrlPram = options['webViewUrl'];
    let webViewUrl = webViewUrlPram + "?wx_open_id=" + wxOpenId
    console.log('webViewUrl============>',webViewUrl);   
    this.setData({
      webViewUrl:webViewUrl
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

  }
})