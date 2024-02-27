// pages/family/members/createQRCode.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl:'',
    commanyShortName: "",
    areaName: '',
    qrExpTime:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    var loginInfo = app.storage.getLoginInfo()
    console.log("loginInfo  ", loginInfo);
    that.setData({
      commanyShortName: loginInfo.commanyShortName,
      areaName: loginInfo.completeAddr,
     
    })

    const eventChannel = that.getOpenerEventChannel()
    eventChannel.on('QRIMGUrlEvent', function (data) {
      console.log(data.data)
      that.setData({
       
        imgUrl: data.data.imgUrl,
        qrExpTime:that.getExpTime(data.data.qrcodeExpTime)
      })
    })

  },
   getExpTime(time) {
    var times = (new Date()).getTime()+time*1000
    var expDate = new Date(times)
    return expDate.getFullYear()+"年"+this.formatStr((expDate.getMonth()+1))+"月"+this.formatStr(expDate.getDate())+"日 "+this.formatStr(expDate.getHours())+":"+this.formatStr(expDate.getMinutes()) 
  },

  formatStr(str1){
    if(str1<10){
      return '0'+str1
    }
    return str1
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