const app = getApp();
const api = require("../../../const/api");

// 假设你有一个倒计时的总时长，比如1小时（3600秒）
const totalSeconds = 7200;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    carCode: '',
    radioChecked: false,
    radioValue: '',
    payment_button_disabled: false,
    carInfoVo: null,
    interval: 0,
    seconds: totalSeconds, // 初始倒计时秒数
    orderId: '',
    isCard: false,
    cardCstBatchId: '',
    expNum: '',
    hourNumArray: [],
    hourNumValue: 1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    var that = this;
    that.setData({
      carCode: options.carCode
    })
    // 查询停车卡剩余时长及批次
    that.queryCardExpNum();
    // 调用接口查询车牌缴费信息
    //that.queryCarPayInfo();
    // 开始倒计时
    //that.countdown();
  },

  queryCardExpNum() {
    var that = this;
    var data = {};
    data['cstCode'] = app.storage.getCstCode();
    data['proNum'] = app.storage.getProNum();
    data['wxOpenId'] = app.storage.getWxOpenId();
    app.req.postRequest(api.queryCardExpNum, data).then(res => {
      if (res.data.respCode == '000') {
        var isCard = res.data.isCard;
        var cardCstBatchId = res.data.cardCstBatchId;
        var expNum = res.data.expNum;
        if (isCard == true && expNum > 0) {
          that.setData({
            radioChecked: true,
            radioValue: cardCstBatchId
          })
        } else {
          that.setData({
            radioChecked: false
          })
        }
        that.setData({
          isCard: isCard,
          cardCstBatchId: cardCstBatchId,
          expNum: expNum,
          isRefreshing: false
        })
        // 查询选择停车卡时长数组
        that.queryHourNum();
        // 调用接口查询车牌缴费信息
        that.queryCarPayInfo();
      } else {
        app.alert.alert(res.data.errDesc);
      }
    });
  },

  queryHourNum() {
    var that = this;
    var data = {};
    data['cstCode'] = app.storage.getCstCode();
    data['proNum'] = app.storage.getProNum();
    data['wxOpenId'] = app.storage.getWxOpenId();
    data['carCode'] = that.data.carCode;
    app.req.postRequest(api.queryHourNum, data).then(res => {
      if (res.data.respCode == '000') {
        var hourNumArray = res.data.hourNumArray;      
        that.setData({
          hourNumArray: hourNumArray
        })
      } else {
        app.alert.alert(res.data.errDesc);
      }
    });
  },

  countdown: function () {
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
  queryCarPayInfo() {
    var that = this;
    var radioChecked = that.data.radioChecked;
    var data = {};
    data['cstCode'] = app.storage.getCstCode();
    data['proNum'] = app.storage.getProNum();
    data['wxOpenId'] = app.storage.getWxOpenId();
    data['carCode'] = that.data.carCode;
    data['radioChecked'] = radioChecked;
    data['hourNumValue'] = that.data.hourNumValue;
    app.req.postRequest(api.queryCarNum, data).then(res => {
      if (res.data.respCode == '000') {
        var carInfoVo = res.data.carInfoVo;
        that.setData({
          carInfoVo: carInfoVo
        });
      } else {
        app.alert.alert(res.data.errDesc);
      }

    });
  },

  // 单选框选中,取消事件
  radioChange(e) {
    var that = this;
    // 单选框选中状态
    var radioChecked = that.data.radioChecked;
    // 获取单选框的值
    console.log(e.detail.value)
    if (radioChecked == false) {
      that.setData({
        radioChecked: true,
        hourNumValue:1
      })
    }
    if (radioChecked == true) {
      that.setData({
        radioChecked: false,
        hourNumValue:1
      })
    }
    console.log("--------------" + that.data.radioValue + "------------")
    that.queryCarPayInfo();
  },

  // 缴费
  carPayment(e) {
    var that = this;
    var hourNumValue = that.data.hourNumValue;
    var radioChecked = that.data.radioChecked;
    if(radioChecked == true &&  (hourNumValue == null || hourNumValue == '')){
      app.alert.alert('请选择抵扣时长！');
      return;
    }
    // 是否选择了停车卡
    var radioChecked = that.data.radioChecked;
    var data = {};
    data['cstCode'] = app.storage.getCstCode();
    data['wxOpenId'] = app.storage.getWxOpenId();
    data['proNum'] = app.storage.getProNum();
    data['carCode'] = that.data.carCode;
    data['cardCstBatchId'] = that.data.cardCstBatchId;
    data['radioChecked'] = radioChecked;
    data['hourNumValue'] = that.data.hourNumValue;
    if (!that.data.payment_button_disabled) {
      that.setData({ payment_button_disabled: true });
      // 服务端获取支付参数
      app.req.postRequest(api.carPayment, data).then(res => {
        console.log("下单返回", res);
        if (res.data.respCode == '000') {
          var orderId = res.data.orderId;
          that.setData({
            payment_button_disabled: false,
            orderId: orderId
          });
          var totalAmount = that.data.carInfoVo.totalAmount;
          if (totalAmount > 0) {
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
                app.req.postRequest(api.parkPayOrderStatusUpdate, data).then(res => {
                  console.log("支付完成返回", res);
                  if (res.data.respCode == '000') {
                    console.log("支付完成返回成功！")
                  }
                });
                // 跳转到支付成功页
                wx.redirectTo({
                  url: '/subpages/carpay/carPaySuccess/carPaySuccess'
                })
              },
              fail(res) {
                console.log("-------------失败---------------" + res);
              }
            });
          } else {
            // 跳转到支付成功页
            wx.redirectTo({
              url: '/subpages/carpay/carPaySuccess/carPaySuccess'
            })
          }

        } else {
          that.setData({ payment_button_disabled: false });
          var code = res.data.errCode;
          var desc = res.data.errDesc;
          app.alert.alert(desc);
        }
      });
    }
  },

  // 选择抵扣小时,选择器选择的 
  bindPickerChange(e) {
    console.log(e)
    this.setData({
      index: e.detail.value,
      hourNumValue: this.data.hourNumArray[e.detail.value]
    })
    this.queryCarPayInfo();
    console.log('选中的数据:' + this.data.hourNumValue)
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
    var that = this;
    // 查询停车卡剩余时长及批次
    that.queryCardExpNum();
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {
    // var that = this;
    // clearInterval(that.data.interval);
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {
    // var that = this;
    // clearInterval(that.data.interval);
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {
    var that = this;
    that.setData({
      isRefreshing: true,
      hourNumValue:1
    })
    that.queryCardExpNum();
    wx.stopPullDownRefresh({
    })
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