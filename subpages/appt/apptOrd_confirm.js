const apiUtil = require('../../const/api.js');
const apptInfo=require('./apptInfo.js');
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    'APPTORDLOGDTOS':[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.loading(), this.showLoading(!1);
    let ordDate=options.ordDate;
    let ordSeqId=options.ordSeqId;
    this.ordDate=ordDate;
    this.ordSeqId=ordSeqId;
    this.requestApptOrdInfo();
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

  },
  requestApptOrdInfo:function(){
    this.showLoading(!0);
    this.payinfo = '';
    var data = {
      'custId': app.storage.getLoginInfo().custId,
      'ordBeginDate': this.ordDate,
      'ordEndDate': this.ordDate,
      'ordSeqId': this.ordSeqId,
      'pageNum': 1,
      'pageSize': 10
    };
    var that = this;
    var res = app.req.postRequest(apiUtil.queryApptOrdLog,data).then(function (res) {
      console.log("返回结果:" + JSON.stringify(res.data));
      if (res.data.RESPCODE == '000') {
        that.setData({'APPTORDLOGDTOS': res.data.APPTORDLOGDTOS});
      } else {
        //接口返回错误
        wx.showToast({
          title: res.data.ERRDESC + '[' + res.data.RESPCODE + ']',
          icon: 'none'
        })
        // wx.navigateTo({
        //   url: '/subpages/appt/common_fail?msg=' + res.data.ERRDESC
        // })
      }
      that.showLoading(!1);
    });
  },
  doOrdPay: function (event) {
    this.showLoading(!0);
    let ordAmt = event.currentTarget.dataset.ordamt;
    var data = {
      'custId': app.storage.getLoginInfo().custId,
      'ordDate': this.ordDate,
      'ordSeqId': this.ordSeqId,
      'processStat': apptInfo.paySuccessStat,
    };
    var that = this;
    var res = app.req.postRequest(apiUtil.preApptOrdProcess, data).then(function (res) {
      console.log("返回结果:" + JSON.stringify(res.data));
      if (res.data.RESPCODE == '000') {
        if(parseFloat(ordAmt).toFixed(2)==parseFloat('0.00').toFixed(2)){
          that.showLoading(!1);
          wx.navigateTo({
            url: '/subpages/appt/apptOrd_success?ordDate=' + that.ordDate + '&ordSeqId=' + that.ordSeqId
          })
        }else{
          //支付
          that.doMinprogramPay(ordAmt);
        }
      } else {
        //接口返回错误
        that.showLoading(!1);
        wx.showToast({
          title: res.data.ERRDESC + '[' + res.data.RESPCODE + ']',
          icon: 'none'
        })
      }
    });
  },
  doMinprogramPay: function (ordAmt) {
    if (this.payinfo&&this.payinfo!=''){
       this.showLoading(!1);
       this.minProgramPay(this.payinfo);
       return;
    }
    var data = {
      'custId': app.storage.getLoginInfo().custId,
      'ordAmt': ordAmt,
      'huSeqId': app.storage.getLoginInfo().huSeqId,
      'houseSeqId': app.storage.getLoginInfo().houseSeqId,
      'payType': apptInfo.payType,
      'busiId': apptInfo.busiId,
      'ordDate': this.ordDate,
      'ordSeqId': this.ordSeqId,
      'appid': app.storage.getLoginInfo().appId,
      'openid': app.storage.getLoginInfo().hgjOpenId,
      'goodsDesc': this.data.APPTORDLOGDTOS[0].OBJNAME,
      'payDate': this.data.APPTORDLOGDTOS[0].PAYDATE ? this.data.APPTORDLOGDTOS[0].PAYDATE : '',
      'paySeqId': this.data.APPTORDLOGDTOS[0].PAYSEQID ? this.data.APPTORDLOGDTOS[0].PAYSEQID : ''
    };
    var that = this;
    var res = app.req.postRequest(apiUtil.minProgramPayUrl,data).then(function (res) {
      that.showLoading(!1);
      if (res.data.RESPCODE == '000'){
        var payinfo = JSON.parse(res.data.PAYINFO);
        that.minProgramPay(payinfo);
        that.payinfo=payinfo;
        // console.log("返回结果:" + JSON.stringify(res.data));
       }else{
        //接口返回错误
        wx.showToast({
          title: res.data.ERRDESC + '[' + res.data.RESPCODE + ']',
          icon: 'none'
        })
       }
      
    });
  },
  minProgramPay:function(payinfo){
    let that =this;
    wx.requestPayment({
      'timeStamp': payinfo.timeStamp,
      'nonceStr': payinfo.nonceStr,
      'package': payinfo.package,
      'signType': payinfo.signType,
      'paySign': payinfo.paySign,
      'success': function (res) {
        console.log("success");
        wx.navigateTo({
          url: '/subpages/appt/apptOrd_success?ordDate=' + that.ordDate + '&ordSeqId=' + that.ordSeqId
        })
      },
      'fail': function (res) {
        console.log("fail");
        console.log(res);
      },
      'complete': function (res) {
        console.log("complete");
        console.log(res);
      }
    });
  }
})