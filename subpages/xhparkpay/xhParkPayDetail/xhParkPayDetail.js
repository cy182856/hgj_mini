const app = getApp();
const api = require("../../../const/api");
import Toast from '../../../miniprogram_npm/@vant/weapp/dialog/dialog';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    carCode: '',
    payment_button_disabled: false,
    carInfoVo: null,
    interval: 0,
    orderId: '',
    isCard: false,
    cardCstBatchId: '',
    expNum: '',
    hourNumArray: [],
    hourNumValue: 1,
    xhParkCouponDesc: ''
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
   
  },

  queryCardExpNum() {
    var that = this;
    var data = {};
    data['cstCode'] = app.storage.getCstCode();
    data['proNum'] = app.storage.getProNum();
    data['wxOpenId'] = app.storage.getWxOpenId();
    app.req.postRequest(api.xhQueryCardExpNum, data).then(res => {
      if (res.data.respCode == '000') {
        var isCard = res.data.isCard;
        var cardCstBatchId = res.data.cardCstBatchId;
        var expNum = res.data.expNum;
        var xhParkCouponDesc = res.data.xhParkCouponDesc;
        that.setData({
          isCard: isCard,
          cardCstBatchId: cardCstBatchId,
          expNum: expNum,
          isRefreshing: false,
          xhParkCouponDesc: xhParkCouponDesc
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
    app.req.postRequest(api.xhQueryHourNum, data).then(res => {
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

  // 查询车辆缴费信息
  queryCarPayInfo() {
    var that = this;
    var data = {};
    data['cstCode'] = app.storage.getCstCode();
    data['proNum'] = app.storage.getProNum();
    data['wxOpenId'] = app.storage.getWxOpenId();
    data['carCode'] = that.data.carCode;
    data['hourNumValue'] = that.data.hourNumValue;
    app.req.postRequest(api.xhQueryCarNum, data).then(res => {
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

  // 停车抵扣抵扣
  carNoCoupon(e){
    var that = this;
    var hourNumValue = that.data.hourNumValue;
    if(hourNumValue == null || hourNumValue == '' || hourNumValue == '0'){
      app.alert.alert('请选择抵扣时长！');
      return;
    }
    var data = {};
    data['cstCode'] = app.storage.getCstCode();
    data['wxOpenId'] = app.storage.getWxOpenId();
    data['proNum'] = app.storage.getProNum();
    data['carCode'] = that.data.carCode;
    data['cardCstBatchId'] = that.data.cardCstBatchId;
    data['hourNumValue'] = that.data.hourNumValue;
    wx.showModal({
      title: '提示',
      content: '确定发券吗?',
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定');
          if (!that.data.payment_button_disabled) {
            that.setData({ payment_button_disabled: true });
            // 车牌优惠
            app.req.postRequest(api.carNoCoupon, data).then(res => {
              console.log("车牌优惠返回", res);
              if (res.data.respCode == '000') {
                that.setData({
                  payment_button_disabled: false
                });
                Toast.alert({
                  message:'发券成功'
                }).then(()=>{             
                // 跳转到抵扣记录页
                  wx.redirectTo({
                    url: '/subpages/xhparkpay/xhParkPayLog/xhParkPayLog'
                  })
                })             
              } else {
                that.setData({ payment_button_disabled: false });
                var desc = res.data.errDesc;
                app.alert.alert(desc);
              }
            });
          }     
        } else if (res.cancel) {
          console.log('用户点击取消');
        }
      }
    });  
  },

  // 选择抵扣小时,选择器选择的 
  bindPickerChange(e) {
    console.log(e)
    this.setData({
      index: e.detail.value,
      hourNumValue: this.data.hourNumArray[e.detail.value]
    })
    //this.queryCarPayInfo();
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