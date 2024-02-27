// subpages/gonggao/detail/gongDetail.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    title:'',
    date:'',
    msg:'',
    signName:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let title = options['title'];
    let date = options['date'];
    let msg = options['msg'];
    let url = options['url'];
    console.log('url====>',url);
    let signName = options['signName']
    let loginInfo = app.storage.getLoginInfo();
    if(loginInfo && loginInfo.commanyShortName){
      wx.setNavigationBarTitle({
        title: loginInfo.commanyShortName
      })
    }
    this.setData({
      title:title,
      date:date,
      msg:msg,
      signName:signName,
      url:url
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

  },

  toOrgPage(e) {
    console.log('e===>', e);
    let url = e.currentTarget.dataset.url;
    console.log('url==>11111', url);
    wx.redirectTo({
      url: '../web/ggDetail?url=' + url+'&titleName='+this.data.title
    })
}
})