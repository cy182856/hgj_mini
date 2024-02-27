// pages/noauth/noauth.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    errDesc:'请联系相关物业管理人员开通后再登录小程序！',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    try {
      var desc = options['errDesc'];
      if( desc && desc != '' && desc != undefined){
        this.setData({
          errDesc:desc,
        })
      }
    } catch (error) {
      
    }
    //当进入无权限页面的时候，清空之前所有的本地缓存
    app.storage.clearAll();
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