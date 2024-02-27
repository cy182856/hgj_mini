// subpages/pfee/pfeeOrdDtlList.js
import Toast from '../../miniprogram_npm/@vant/weapp/toast/toast';
const app = getApp();
const api = require('../../const/api');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    payFlag: 'N',
    options: '',
    shortName: "",
    houseName: "",
    pfeeOrdLog: "",
    activeNames: ['1'],
    args: {
      fee: 1,             // 支付金额，单位为分
      paymentArgs: 'A', // 将传递到功能页函数的自定义参数
      currencyType: 'USD' // 货币符号，页面显示货币简写 US$ 
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.loading();
    let loginInfo = app.storage.getLoginInfo();
    let shortName = loginInfo.commanyShortName;
    let houseName = loginInfo.completeAddr;
    this.setData({
      shortName: shortName,
      houseName: houseName,
      options : options
    });


    let ordDate = options.ordDate;
    let ordSeqId = options.ordSeqId;
    if(ordDate == null || ordSeqId == null){
      console.log("参数缺失");
      Toast('参数缺失');
      return;
    }
    console.log(ordDate);
    let condition = {ordDate : ordDate, ordSeqId : ordSeqId};
    this.showLoading(true);
    app.req.postRequest(api.queryPfeeOrdDtl, condition).then(value => {
      this.showLoading(false);
      console.log(value.data);
      if(value.data.respCode != '000'){
        console.log("查询物业缴费订单明细失败");
        Toast('['+value.data.respCode+']'+value.data.respDesc);
        return;
      }
      let pfeeOrdLog = value.data;
      if(pfeeOrdLog == null){
        return;
      }
      this.setData({
        pfeeOrdLog: pfeeOrdLog
      });
    });
  },

  //支付
  pay: function(ele){
    this.showLoading(true);
    let ordDate = ele.currentTarget.dataset.orddate;
    let ordSeqId = ele.currentTarget.dataset.ordseqid;
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
      this.setData({
        payFlag : 'Y'
      });
      let that = this;
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
        },
        'complete':function(res){
          console.log("complete");
          let options = that.data.options
          that.onLoad(options);
        }
      })
      Toast.clear();
    });
  },

  onChange(event) {
    this.setData({
      activeNames: event.detail,
    });
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
    let payFlag = this.data.payFlag;
    if(payFlag != 'N'){
      let pages = getCurrentPages();
      let prevPage = pages[pages.length - 2];
      prevPage.setData({
        payFlag: payFlag
      })
    }
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