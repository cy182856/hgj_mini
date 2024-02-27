// pages/wuyeInfo/wuyeInfo.js
const api = require('../../const/api'),
app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    custId: "",
    infoList:"",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var loginInfo =  app.storage.getLoginInfo()
    this.data.custId = loginInfo.custId
    this.onRequestInfo()
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

  onRequestInfo() {
    var that = this
    var data ={custId: this.data.custId}
    app.req.postRequest(api.getConvenientInfo,data).then(function(value) {
      console.log("queryInfo ",value);      
      let tempList = value.data.propPubResInfo
      if (tempList == null || tempList == undefined) {
        tempList = []
      }
      console.log(tempList)
      that.setData({
        infoList: tempList,
      })
      
     },function(value) {
      console.log("queryInfo F ",value);
     });
  },
  onTapCall(e){
    let phoneNum =  e.currentTarget.dataset.item;
    var strs = new Array(); //定义一数组
    strs = phoneNum.split("-"); 
    console.log("onTapCall  ",strs);
    if(strs.length>1){
      if(strs[0].length<5){
        phoneNum=strs[0]+strs[1]
      }else{
        phoneNum=strs[0]
      }
    }
    wx.makePhoneCall({
      phoneNumber:phoneNum 
    })
  },
  onTapLocation(e){
    let addr =  e.currentTarget.dataset.item.item3Desc;
    let name = e.currentTarget.dataset.item.resName
    let url =  "https://apis.map.qq.com/ws/geocoder/v1/"
     let data={
       "address":addr,
       "key":"OB4BZ-D4W3U-B7VVO-4PJWW-6TKDJ-WPB77"
     }
     wx.navigateTo({
       url: 'mapPage?name='+name+'&addr='+addr,
     })
  // ?address=北京市海淀区彩和坊路海淀西大街74号&key=OB4BZ-D4W3U-B7VVO-4PJWW-6TKDJ-WPB77
  // app.req.getRequest(url,data).then(function(value) {
  //   console.log("onTapLocation ",value);      
   
    
  //  },function(value) {
  //   console.log("onTapLocation F ",value);
  //  });
  // "lng": 121.472412,
  //           "lat": 31.230053
   
  }
})