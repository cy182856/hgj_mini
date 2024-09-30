const app = getApp();
const api = require("../../../const/api");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    codeStr: '',
    refreash:false,
    showCode:'none',
    couponQrCode:'',
    expDate:'',
    couponId:'',
    status:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var windowW = app.globalData.windowW;
    this.setData({
      windowW:windowW,
      couponId:options.couponId,
      status:options.status
    })

    this.createPassCode();
  },

  createPassCode:function(){
    var that = this;
    var cstCode = app.storage.getCstCode();
    var wxOpenId = app.storage.getWxOpenId();
    var proNum = app.storage.getProNum();
    var proName = app.storage.getProName();
    var visitInfo = {
      cstCode: cstCode,
      wxOpenId: wxOpenId,
      proNum:proNum,
      proName: proName,
      couponId: that.data.couponId,
      status: that.data.status
    }
    app.req.postRequest(api.addCouponQrCode, visitInfo).then(function (value) {
      console.log("addVisitLog 返回", value);
      if(value.data.RESPCODE == "000" && value.data.couponQrCode != null){
        var couponQrCode = value.data.couponQrCode;
        var expDate = value.data.expDate;
        that.setData({
          couponQrCode:couponQrCode,
          expDate:expDate
        })
      }else{
        wx.showToast({
          icon:'none',
          title: value.data.ERRDESC?value.data.ERRDESC:'生成二维码失败',
          duration:3000
        })
      }
    }, function (value) {
      console.log("addVisitLog F ", value);
      wx.showToast({
        icon:'none',
        title: '生成二维码失败',
        duration:3000
      })
    }); 
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
    let pages = getCurrentPages(); 
    let prePage = pages[pages.length - 2]; 
    if(this.data.refreash){
        prePage.onLoad();
    }
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
  
})