const app = getApp();
const api = require("../../../const/api");

// 假设你有一个倒计时的总时长，比如1小时（3600秒）
const totalSeconds = 30;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    carCode: '',
    readioChecked: false,
    readioValue:'',
    payment_button_disabled: false,
    carInfoVo: null,
    stopCouponVo: null,
    interval: 0,
    seconds: totalSeconds, // 初始倒计时秒数
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    var that = this;
    that.setData({
      carCode: options.carCode
    })
    // 调用接口查询车牌缴费信息
    that.queryCarPayInfo();
    // 开始倒计时
    that.countdown();
   
  },

  countdown: function() {
    var that = this;
    // 每秒钟更新倒计时 
    var interval = setInterval(() => {
      let seconds = that.data.seconds - 1;
      if (seconds < 0) {
        clearInterval(interval); // 倒计时结束，清除定时器
        seconds = 0; // 倒计时秒数重置
        // 可以添加结束后的处理逻辑，比如提示倒计时结束
        // 返回到车牌查询页
        wx.navigateBack({
          //url: '/subpages/carpay/carpay'
          delta: 1
        });

      }
      that.setData({ 
        seconds: seconds,
        interval: interval
       });
    }, 1000);
  },

  // 查询车辆缴费信息
  queryCarPayInfo(){
    var that = this;
    var data = {};
    data['cstCode'] = app.storage.getCstCode();
    data['proNum'] = app.storage.getProNum();   
    data['wxOpenId'] = app.storage.getWxOpenId();
    data['carCode'] = that.data.carCode;
    app.req.postRequest(api.queryCarPayInfo,data).then(res=>{
      if(res.data.respCode == '000'){               
        var carInfoVo = res.data.carInfoVo;
        var stopCouponVo = res.data.stopCouponVo;
        this.setData({
          carInfoVo: carInfoVo,
          stopCouponVo: stopCouponVo,
          readioValue: stopCouponVo.couponId
        });   
        
      }else{
        app.alert.alert(res.data.errDesc);
      }

    });  
  },

  // 单选框选中,取消事件
  radioChange(e){
    var that = this;
    // 单选框选中状态
    var readioChecked = that.data.readioChecked;
    // 获取单选框的值
    console.log(e.detail.value)
    if(readioChecked == false){
      that.setData({
        readioChecked : true
      })
    }
    if(readioChecked == true){
      that.setData({
        readioChecked :false
      })
    }
    console.log("--------------"+that.data.readioValue+"------------")
  },

  // 缴费
  carPayment(e){
    var that = this;
    var data = {};
    data['cstCode'] = app.storage.getCstCode();
    data['wxOpenId'] = app.storage.getWxOpenId();
    data['proNum'] = app.storage.getProNum();   
    if(!that.data.payment_button_disabled){
      that.setData({ payment_button_disabled: true });
      // 服务端获取支付参数
      app.req.postRequest(api.carPayment,data).then(res=>{
        console.log("下单返回",res);
        if(res.data.respCode == '000'){
          that.setData({ payment_button_disabled: false });
          var timeStamp = res.data.signInfoVo.timeStamp;
          var nonceStr = res.data.signInfoVo.nonceStr;
          var repayId = res.data.signInfoVo.repayId;
          var paySign = res.data.signInfoVo.paySign;
          wx.requestPayment({
            timeStamp: timeStamp,
            nonceStr: nonceStr,
            package: repayId,
            signType: 'RSA',
            paySign: paySign,
            success (res) {
                console.log("-------------成功---------------" + res);
                // 支付完成，修改支付状态为支付中
                app.req.postRequest(api.paymentCompleted,data).then(res=>{
                  console.log("支付完成返回",res);
                  if(res.data.respCode == '000'){
                    console.log("支付完成返回成功！")   
                  }
                });
               
            },
            fail (res) {
              console.log("-------------失败---------------" + res);
            }
          });
        }else{
          that.setData({ payment_button_disabled: false });
          var code = res.data.errCode;
          var desc = res.data.errDesc;
          app.alert.alert(code + ":" + desc);
        }
      }); 
    }
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
    var that = this;
    clearInterval(that.data.interval);
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {
    var that = this;
    clearInterval(that.data.interval);
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