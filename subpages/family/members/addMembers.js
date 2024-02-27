// pages/family/members/addMembers.js
const api = require('../../../const/api'),
  app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    huRole: 'M',
    commanyShortName: "",
    areaName: '',
    custId: '',
    huSeqId: '',
    houseSeqId: '',
    propType:"R"
  },
  onChange(event) {
    // console.log("onChange",event)
    this.setData({
      huRole: event.detail,
    });
  },
  onTapCreateQRCode() {
    let that = this
    var data = {
      custId: that.data.custId,
      houseSeqId: that.data.houseSeqId,
      huRole: that.data.huRole
    }
    app.req.postRequest(api.getHouseUsrInfoQrcode, data).then(function (value) {
      console.log("getHouseUsrInfoQrcode S ", value);   
      let imgUrl = value.data.imgUrl
      let time =  value.data.qrcodeExpTime
      if(imgUrl){
        wx.navigateTo({
          url: './createQRCode',
          success: function(res) {       
            res.eventChannel.emit('QRIMGUrlEvent', { data: value.data })
          }
        })
      }else{
        wx.showToast({
          title: '生成二维码失败',
        })
      }
  
    
    }, function (value) {
      console.log("getHouseUsrInfoQrcode F ", value);
      wx.showToast({
        title: '生成二维码失败',
      })
    });
   
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    var loginInfo = app.storage.getLoginInfo()
    console.log("loginInfo  ", loginInfo);
    this.setData({
      commanyShortName: loginInfo.commanyShortName,
      propType:loginInfo.propType,
      areaName: loginInfo.completeAddr,
      custId: loginInfo.custId,
      huSeqId: loginInfo.huSeqId,
      houseSeqId: loginInfo.houseSeqId,

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