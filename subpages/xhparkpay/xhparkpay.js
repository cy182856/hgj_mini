const api = require('../../const/api'),
app = getApp();
Page({
  data: {
    carCode: '',
    expNum: '',
    serch_button_disabled: false
  },
  onLoad: function (e) {
    this.queryCardExpNum();
  },

   /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.queryCardExpNum();
  },
  
  keyboardStatusHandler: function () { //当点击输入框时，查询窗口关闭
    let that = this;
    that.closekeyboard();
  },
  closekeyboard: function () {
    let that = this;
    var kbd = that.selectComponent('#simpleKeyboard');
    if (kbd.data.isShow) {
      that.setData({
        isshowquery: false,
      });
    }
  },
 
  // 查询按钮，车牌号查询车辆计费信息
  bt_query: function () {
    var that = this;
    var kbd = that.selectComponent('#simpleKeyboard');
    var carCode = kbd.getLpn();
    console.log("-------------------" + carCode + "--------------------")
    that.closekeyboard();
    if (carCode.length == 7 || carCode.length == 8) {
      // 调用接口查询车牌号信息
      var data = {};
      data['cstCode'] = app.storage.getCstCode();
      data['proNum'] = app.storage.getProNum();   
      data['wxOpenId'] = app.storage.getWxOpenId();
      data['carCode'] = carCode;
      if (!that.data.serch_button_disabled) {
        that.setData({ serch_button_disabled: true });
        app.req.postRequest(api.xhQueryCarNum,data).then(res=>{
          if(res.data.respCode == '000'){                              
            var payFeeStatus = res.data.payFeeStatus;
            if(payFeeStatus == true){
              // 如果有欠费信息，跳转到车辆缴费页面
              wx.navigateTo({
                url: '/subpages/xhparkpay/xhParkPayDetail/xhParkPayDetail?carCode=' + carCode
              })   
              that.setData({ serch_button_disabled: false });   
            }else{
              // 无欠费信息，提示车辆可以直接离场
              that.setData({ serch_button_disabled: false }); 
              wx.showToast({
                icon:'none',
                title: '该车牌目前无需付费，可直接出场',
                duration:3000
              })
            }              
          }else{
            that.setData({ serch_button_disabled: false });
            wx.showToast({
              icon:'none',
              title: res.data.errDesc,
              duration:3000
            })
          }
        });  
      }
    } else {
        wx.showToast({
          icon:'none',
          //title: value.data.ERRDESC?value.data.ERRDESC:'请输入正确的车牌号',
          title: '请输入正确的车牌号',
          duration:1000
        })
    }
  },

  carPayLog:function(){
    wx.navigateTo({
      url: '/subpages/xhparkpay/xhParkPayLog/xhParkPayLog',
    })
  },

  queryCardExpNum() {
    var that = this;
    var data = {};
    data['cstCode'] = app.storage.getCstCode();
    data['proNum'] = app.storage.getProNum();
    data['wxOpenId'] = app.storage.getWxOpenId();
    app.req.postRequest(api.xhQueryCardExpNum, data).then(res => {
      if (res.data.respCode == '000') {      
          that.setData({
            expNum: res.data.expNum
          })              
      } else {
        app.alert.alert(res.data.errDesc);
      }
    });
  },

})