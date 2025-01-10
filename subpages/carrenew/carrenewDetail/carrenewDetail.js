const app = getApp();
const api = require("../../../const/api");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    carCode: '',
    carTypeNo: '',
    beginTime: '',
    endTime: '',
    userName: '',
    phone: '',
    homeAddress: '',
    monthAmount: '',
    monthNum: '',
    payment_button_disabled: false,
    payAmount: '0',
    orderId: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    var that = this;
    that.setData({
      carCode: options.carCode,
      carTypeNo: options.carTypeNo,
      beginTime: options.beginTime,
      endTime: options.endTime,
      userName: options.userName,
      phone: options.phone,
      homeAddress: options.homeAddress,
      monthAmount: options.monthAmount
    })
  },

  inputChangeMonth(event) {
    var monthNum = event.detail.value;
    if(/^[1-9]\d*$/.test(monthNum) == false && monthNum != '' && monthNum != null){
      app.alert.alert('续费月数请填写数字！');
      return;
    }
    console.log(monthNum);
    this.setData({
      monthNum: monthNum,
      payAmount: monthNum * this.data.monthAmount
    })
  },

  // 缴费
  carRenew(e) {
    var that = this;
    var monthNum = that.data.monthNum;
    if(monthNum == '' || monthNum == null){
      app.alert.alert('请填写续费月数！');
      return;
    }
    if(/^[1-9]\d*$/.test(monthNum) == false){
      app.alert.alert('续费月数填写错误！');
      return;
    }
    var data = {};
    data['cstCode'] = app.storage.getCstCode();
    data['wxOpenId'] = app.storage.getWxOpenId();
    data['proNum'] = app.storage.getProNum();
    data['carCode'] = that.data.carCode;
    data['payAmount'] = that.data.payAmount;
    data['monthNum'] = monthNum;
    if (!that.data.payment_button_disabled) {
      that.setData({ payment_button_disabled: true });
      // 服务端获取支付参数
      app.req.postRequest(api.carRenew, data).then(res => {
        console.log("下单返回", res);
        if (res.data.respCode == '000') {
          var orderId = res.data.orderId;
          that.setData({
            payment_button_disabled: false,
            orderId: orderId
          });

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
            success(res) {
              console.log("-------------成功---------------" + res);
              // 支付完成，修改支付状态为支付中
              data['id'] = orderId;
              app.req.postRequest(api.carRenewOrderStatusUpdate, data).then(res => {
                console.log("支付完成返回", res);
                if (res.data.respCode == '000') {
                  console.log("支付完成返回成功！")
                }
              });
              // 跳转到支付成功页
              wx.navigateTo({
                url: '/subpages/carrenew/carrenewSuccess/carrenewSuccess'
              })
            },
            fail(res) {
              console.log("-------------失败---------------" + res);
            }
          });

        }else {
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