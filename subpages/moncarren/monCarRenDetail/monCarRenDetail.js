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
    userTel: '',
    userAddress: '',
    ruleID: '',
    ruleName: '',
    ruleType: '',
    ruleCount: '',
    monthNum: '',
    monthAmount: '',
    payment_button_disabled: false,
    payAmount: '0',
    orderId: '',
    index: 0,
    array:[],
    renewBeginTime: '',
    renewEndTime: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    var that = this;
    that.setData({
      carCode: options.carCode,
      beginTime: options.beginTime,
      endTime: options.endTime,
      userName: options.userName,
      userTel: options.userTel,
      userAddress: options.userAddress,
      ruleID: options.ruleID,
      ruleName: options.ruleName,
      ruleType: options.ruleType,
      ruleCount: options.ruleCount,
      monthAmount: options.monthAmount
      //payAmount: that.data.monthNum * options.monthAmount
    })
    // 下拉框续费月数数组
    that.renewMonthArray();
    
  },

  // 根据选择月份回显开始日期、结束日期
  queryMonCarRenDate(carCode, monthNum, endTime) {
    var that = this;
    var data = {};
    data['carCode'] = carCode;
    data['monthNum'] = monthNum;
    data['endTime'] = endTime;
    app.req.postRequest(api.queryMonCarRenDate,data).then(res=>{
      if(res.data.respCode == '000'){
          var renewBeginTime = res.data.renewBeginTime;
          var renewEndTime = res.data.renewEndTime;
          that.setData({ 
            renewBeginTime: renewBeginTime,
            renewEndTime: renewEndTime
          })           
      }
    });    
  },

  // 下拉框续费月数数组
  renewMonthArray(){
    var that = this;
    var data = {};
    data['cstCode'] = app.storage.getCstCode();
    data['wxOpenId'] = app.storage.getWxOpenId();
    data['proNum'] = app.storage.getProNum();
    app.req.postRequest(api.queryRenewMonthArray,data).then(res=>{
      if(res.data.respCode == '000'){
          var renewMonthArray = res.data.renewMonthArray;
          that.setData({ 
            array: renewMonthArray,
            monthNum: renewMonthArray[0],
            payAmount: renewMonthArray[0] * that.data.monthAmount
          })    
           // 根据选择月份回显开始日期、结束日期
          that.queryMonCarRenDate(that.data.carCode,renewMonthArray[0],that.data.endTime);       
      }
    });   
  },

  bindPickerChange:function(e){ 
    var that = this;
    var index = e.detail.value;
    var monthNum = that.data.array[index];
    that.setData({  
        index: index,
        monthNum: monthNum,
        payAmount: monthNum * that.data.monthAmount
    })
    // 根据选择月份回显开始日期、结束日期
    that.queryMonCarRenDate(that.data.carCode, monthNum, that.data.endTime);
  }, 

  // inputChangeMonth(event) {
  //   var monthNum = event.detail.value;
  //   if(/^[1-9]\d*$/.test(monthNum) == false && monthNum != '' && monthNum != null){
  //     app.alert.alert('续费月数请填写正确的数字！');
  //     return;
  //   }
  //   console.log(monthNum);
  //   this.setData({
  //     monthNum: monthNum,
  //     //payAmount: monthNum * this.data.ruleAmount/100
  //     payAmount: monthNum * 0.01
  //   })
  // },

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
      app.req.postRequest(api.monCarRen, data).then(res => {
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
              app.req.postRequest(api.monCarRenOrderStatusUpdate, data).then(res => {
                console.log("支付完成返回", res);
                if (res.data.respCode == '000') {
                  console.log("支付完成返回成功！")
                }
              });
              // 跳转到缴费记录页面
              wx.redirectTo({
                url: '/subpages/moncarren/monCarRenLog/monCarRenLog'
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