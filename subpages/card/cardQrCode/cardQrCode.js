const app = getApp();
const api = require("../../../const/api");
// 假设你有一个倒计时的总时长，比如1小时（3600秒）
const totalSeconds = 3;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cardNo:'',
    visitQrCode:'', 
    startExpDate:'',
    endExpDate:'',
    openDoorTotalNum:'',
    openDoorApplyNum:'',
    interval: 0,
    seconds: totalSeconds // 初始倒计时秒数
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      cardQrCode: options.cardQrCode,
      startExpDate: options.startExpDate,
      endExpDate: options.endExpDate,
      openDoorTotalNum: options.openDoorTotalNum,
      openDoorApplyNum : options.openDoorApplyNum,
      cardNo:options.cardNo
    })
    // 开始倒计时
    this.countdown();
  },

  countdown: function() {
    var that = this;
    // 每秒钟更新倒计时 
    var interval = setInterval(() => {
      let seconds = that.data.seconds - 1;
      if (seconds < 0) {
        clearInterval(interval); // 倒计时结束，清除定时器
        seconds = 0; // 倒计时秒数重置
        // 倒计时结束，查询有没有开门记录，如果有就返回上一页
        var data = {cardNo:that.data.cardNo }
        app.req.postRequest(api.queryOpenDoorLogByCardNo,data).then(res=>{
          if(res.data.respCode == '000'){
            var openDoorLogSize = res.data.openDoorLogSize;
            if(openDoorLogSize > 0){
              wx.navigateBack({
                delta: 1
              });
            } else{
              that.setData({
                seconds: totalSeconds
              })
              that.countdown();
            }   
          }  
        })            
      }
      that.setData({ 
        seconds: seconds,
        interval: interval
       });
    }, 1000);
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
    var that = this;
    clearInterval(that.data.interval);
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    var that = this;
    clearInterval(that.data.interval);
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