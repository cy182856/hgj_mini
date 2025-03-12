const app = getApp();
const api = require("../../../const/api");

Page({

  /**
   * 页面的初始数据
   */
  data: {

    orderId: ''

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    var that = this;
    that.setData({
      orderId: options.orderId
    })
  },


  // 开票
  makeInvoice:function(e){
    var that = this;
    var data = {};
    data['orderId'] = that.data.orderId;
    data['cstCode'] = app.storage.getCstCode();
    data['wxOpenId'] = app.storage.getWxOpenId();
    data['proNum'] = app.storage.getProNum();
   
    app.req.postRequest(api.monCarInvoice,data).then(res=>{
      if(res.data.respCode == '000'){
           
      }else{
        wx.showToast({
          icon:'none',
          title: res.data.errDesc,
          duration:3000
        })
      }
    });   
  },
  

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})