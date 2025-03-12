const api = require('../../const/api'),
app = getApp();
Page({
  data: {
    carCode: ''
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
      // 调用接口根据车牌号查询月租车信息
      var data = {};
      data['cstCode'] = app.storage.getCstCode();
      data['proNum'] = app.storage.getProNum();   
      data['wxOpenId'] = app.storage.getWxOpenId();
      data['carCode'] = carCode;
      app.req.postRequest(api.queryMonCarInfoByCarNum,data).then(res=>{
        if(res.data.respCode == '000'){
          var monCarRenInfoVo = res.data.monCarRenInfoVo;
          var carCode = monCarRenInfoVo.carCode;
          var beginTime = monCarRenInfoVo.beginTime;
          var endTime = monCarRenInfoVo.endTime;
          var userName = monCarRenInfoVo.userName;
          var userTel = monCarRenInfoVo.userTel;
          var userAddress = monCarRenInfoVo.userAddress;
          var ruleID = monCarRenInfoVo.ruleID;
          var ruleName = monCarRenInfoVo.ruleName;
          var ruleType = monCarRenInfoVo.ruleType;
          var ruleCount = monCarRenInfoVo.ruleCount;
          var monthAmount = monCarRenInfoVo.monthAmount;
          // 如果车辆类型符合要求，跳转到车辆缴费页面
          wx.navigateTo({
            url: '/subpages/moncarren/monCarRenDetail/monCarRenDetail?carCode=' + carCode + '&beginTime=' + beginTime +'&endTime=' + endTime +'&userName=' + userName + '&userTel=' + userTel + '&userAddress=' + userAddress + '&ruleID=' + ruleID + '&ruleName=' + ruleName + '&ruleType=' + ruleType + '&ruleCount=' + ruleCount + '&monthAmount=' + monthAmount
          })              
        }else{
          wx.showToast({
            icon:'none',
            title: res.data.errDesc,
            duration:3000
          })
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

  monCarRenLog:function(){
    wx.navigateTo({
      url: '/subpages/moncarren/monCarRenLog/monCarRenLog',
    })
  }

})