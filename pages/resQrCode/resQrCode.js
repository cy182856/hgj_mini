const app = getApp();
const api = require('../../const/api');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    resQrCode:'',
    createTime:'',
    endTime:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

     this.createResQrCode();
  },

  /**
   * 生成住户码
   */
  createResQrCode:function(){ 
    var that = this;
    var cstCode = app.storage.getCstCode();
    var wxOpenId = app.storage.getWxOpenId();
    var proNum = app.storage.getProNum();
    var data = {
      cstCode: cstCode,
      wxOpenId: wxOpenId,
      proNum:proNum,
    }
    app.req.postRequest(api.addResQrCode, data).then(function (value) {
      console.log("addResQrCode 返回", value);
      if(value.data.RESPCODE == "000" && value.data.resQrCode != null){
        that.setData({
          resQrCode:value.data.resQrCode,
          createTime:value.data.createTime,
          endTime:value.data.endTime 
        })    
      }else{
        wx.showToast({
          icon: 'none',
          title: '生成访客通行证失败',
          duration: 3000
        })
      }
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

  onChangeRadio:function(e){
  
  },
  onChangeExpCnt:function(e){
   
  },
  
})