// subpages/pfee/pfeeMonBillPay.js
import Toast from '../../miniprogram_npm/@vant/weapp/toast/toast';
import Dialog from '../../miniprogram_npm/@vant/weapp/dialog/dialog';
const app = getApp();
const api = require('../../const/api');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    hasAuth: false,
    shortName: '',
    houseName: '',
    currentDate: new Date().getTime(),
    show: false,
    num: 0,
    startBillMonDesc: "请选择",
    endBillMonDesc: "请选择",
    startBillMon: "",
    endBillMon: "",
    pfeeMonBillDtos: "",
    ordAmt: 0
  },

  showYearMon(e) {
    let num = e.currentTarget.dataset['index'];
    console.log(num);
    this.setData({ show: true, num: num });
  },

  hiddenYearMon() {
    this.setData({ show: false });
  },

  toLogs(){
    wx.navigateTo({
      url: 'pfeeOrdLogList'
    })
  },

  confirmYearMon(event) {
    let num = this.data.num;
    console.log(event.detail);
    let dateTmp = new Date(event.detail);
    console.log(dateTmp);
    let startBillMon = '';
    let endBillMon =  '';
    if(num == 0){
      endBillMon  = this.data.endBillMon;
      startBillMon = this.convert2YearMon(dateTmp);
      let startBillMonDesc = this.convert2YearMonDesc(dateTmp);
    
      if(endBillMon != '' && startBillMon > endBillMon){
        Toast('结束月份不得小于开始月份');
        return;
      }
      this.setData({
        startBillMon: startBillMon,
        startBillMonDesc: startBillMonDesc
      });
      
    }else{
      startBillMon  = this.data.startBillMon;
      endBillMon = this.convert2YearMon(dateTmp);
      let endBillMonDesc = this.convert2YearMonDesc(dateTmp);
      if(startBillMon != '' && startBillMon > endBillMon){
        Toast('开始月份不得大于结束月份');
        return;
      }
      this.setData({
        endBillMon: endBillMon,
        endBillMonDesc: endBillMonDesc
      });
    }
    if(startBillMon == '' || endBillMon == ''){
      this.setData({ show: false });
      return;
    }
    this.calcBillMon();
    this.setData({ show: false });
  },


  onInput(event) {
    console.log(event.detail);

    this.setData({
      currentDate: event.detail,
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.loading();
    this.hasAuth();

    let date = new Date();
    var loginInfo = app.storage.getLoginInfo();
    let shortName = loginInfo.commanyShortName;
    let houseName = loginInfo.areaName+' - '+loginInfo.buildingName+' - '+loginInfo.houseNo;
    this.setData({
      shortName: shortName,
      houseName: houseName
    });
    // this.calcBillMon();

  },

  hasAuth: function(){
    let hasAuth = false;
    this.showLoading(true);
    app.req.postRequest(api.huAuth).then(value => {
      this.showLoading(false);
      if(value.data.respCode != '000'){
        Toast('['+value.data.respCode+']'+value.data.errDesc);
        return;
      }
      let authBitmap = value.data.authBitmap;
      let pfeeBitMap = authBitmap.substring(1, 2);
      if(pfeeBitMap ==  '1'){
        hasAuth = true;
      }
      this.setData({
        hasAuth: hasAuth
      });
    });
  },

  calcBillMon: function(){
    let startBillMon  = this.data.startBillMon;
    let endBillMon = this.data.endBillMon;
    let condition = {startBillMon : startBillMon, endBillMon : endBillMon};
    this.showLoading(true);
    app.req.postRequest(api.queryPfeeMonBill, condition).then(value => {
      this.showLoading(false);
      console.log(value.data);
      if(value.data.respCode != '000'){
        console.log("查询物业缴费订单失败");
        Toast('['+value.data.respCode+']'+value.data.errDesc);
        return;
      }
      let pfeeMonBillDtos = value.data.pfeeMonBillDtos;
      let ordAmt = 0;
      if(value.data.ordAmt != null && value.data.ordAmt != ''){
        ordAmt = parseFloat(value.data.ordAmt)*100;
      }
      this.setData({
        pfeeMonBillDtos: pfeeMonBillDtos,
        ordAmt: ordAmt
      });

    });
  },

  submitPfee: function(){
    this.showLoading(true);
    let startBillMon  = this.data.startBillMon;
    let endBillMon = this.data.endBillMon;
    let condition = {startBillMon : startBillMon, endBillMon : endBillMon}; 
    app.req.postRequest(api.submitPfee, condition).then(value => {
      this.showLoading(false);
      console.log(value.data);
      if(value.data.respCode != '000' && value.data.respCode != '100'){
        console.log("提交物业缴费订单失败");
        Dialog.alert({
          message: '['+value.data.respCode+']'+value.data.errDesc
        })
        return;
      }
      if(value.data.respCode == '100'){
        Dialog.confirm({
          message: '存在已经下单的缴费订单,是否先关闭这些订单？',
          asyncClose: true
        }).then(() => {
          setTimeout(() => {
            Dialog.close();
          }, 1000);
          this.cancel(condition);
          this.submitPfee();
        }).catch(() => {
          Dialog.close();
          return;
        });
        return;
      }
      let ordDate = value.data.ordDate;
      let ordSeqId = value.data.ordSeqId;
      this.pay(ordDate, ordSeqId);
    });

  },

  //取消已经落单的订单
  cancel: function(condition){
    this.showLoading(true);
    app.req.postRequest(api.closeInitPayPfeeOrdLog, condition).then(value => {
      this.showLoading(false);
      if(value.data.respCode != '000' && value.data.respCode != '100'){
        console.log("提交物业缴费订单失败");
        Toast.fail('['+value.data.respCode+']'+value.data.errDesc);
        return;
      }
    });  
  },

  //支付
  pay: function(ordDate, ordSeqId){
    console.log("ordDate="+ordDate+", ordSeqId="+ordSeqId);
    let loginInfo = app.storage.getLoginInfo();
    let condition = {
      custId : loginInfo.custId,
      huSeqId : loginInfo.huSeqId,
      houseSeqId : loginInfo.houseSeqId,
      openid : loginInfo.hgjOpenId,
      busiId : '02',
      ordDate : ordDate,
      ordSeqId : ordSeqId
    };
    this.showLoading(true);
    app.req.postRequest(api.minProgramPayUrl, condition).then(value => {
      this.showLoading(false);
      console.log(value.data);
      if(value.data.RESPCODE != '000'){
        console.log("物业订单开始唤起失败");
        Toast('['+value.data.RESPCODE+']'+value.data.ERRDESC);
        return;
      }
      var payinfo = JSON.parse(value.data.PAYINFO);
      console.log(payinfo);
      console.log(payinfo.timeStamp);
      wx.requestPayment({
        'timeStamp': payinfo.timeStamp,
        'nonceStr': payinfo.nonceStr,
        'package': payinfo.package,
        'signType': payinfo.signType,
        'paySign': payinfo.paySign,
        'success':function(res){
          console.log("success");
          console.log(res);
          Toast('支付成功');
        },
        'fail':function(res){
          console.log("fail");
          Toast('支付失败,请稍后重试');
          wx.navigateTo({
            url: 'pfeeOrdLogList'
          })
        },
        'complete':function(res){
          console.log("complete");
          wx.navigateTo({
            url: 'pfeeOrdLogList'
          })
        }
      })
      Toast.clear();
    });
  },

  convert2YearMon: function(date){
    console.log("sssssssss"+dateFormat("YYYYmm", date));
    return dateFormat("YYYYmm", date);
  },
  convert2YearMonDesc: function(date){
    return date.getFullYear()+"年"+(date.getMonth()+1)+"月";
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

  }
})

function dateFormat(fmt, date) {
  let ret;
  const opt = {
      "Y+": date.getFullYear().toString(),        // 年
      "m+": (date.getMonth() + 1).toString(),     // 月
      "d+": date.getDate().toString(),            // 日
      "H+": date.getHours().toString(),           // 时
      "M+": date.getMinutes().toString(),         // 分
      "S+": date.getSeconds().toString()          // 秒
      // 有其他格式化字符需求可以继续添加，必须转化成字符串
  };
  for (let k in opt) {
      ret = new RegExp("(" + k + ")").exec(fmt);
      if (ret) {
          fmt = fmt.replace(ret[1], (ret[1].length == 1) ? (opt[k]) : (opt[k].padStart(ret[1].length, "0")))
      };
  };
  return fmt;
}