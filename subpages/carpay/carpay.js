const api = require('../../const/api'),
app = getApp();
Page({
  data: {
    carCode: '',
  },
  onLoad: function (e) {
     
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
 
  // 查询按钮
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
      app.req.postRequest(api.queryCarNum,data).then(res=>{
        if(res.data.respCode == '000'){                   
          var payFeeStatus = res.data.payFeeStatus;
          if(payFeeStatus == true){
            // 如果有欠费信息，跳转到车辆缴费页面
            wx.navigateTo({
              url: '/subpages/carpay/carPayDetail/carPayDetail?carCode=' + carCode
            })
          }else{
            // 无欠费信息，提示车辆可以直接离场
            wx.showToast({
              icon:'none',
              title: '该车牌目前无需付费，可直接出场',
              duration:3000
            })
          }              
        }else{
          app.alert.alert(res.data.errDesc);
        }
      });  
    } else {
        wx.showToast({
          icon:'none',
          //title: value.data.ERRDESC?value.data.ERRDESC:'请输入正确的车牌号',
          title: '请输入正确的车牌号',
          duration:1000
        })
    }
  },

})