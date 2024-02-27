// subpages/acct/myAcctInfo.js
const apiUtil = require('../../const/api.js');
const dateUtil = require('../../utils/dateUtil.js');
const acctInfo = require('./acctInfo');
const app = getApp();
import Dialog from '../../miniprogram_npm/@vant/weapp/dialog/dialog';
const payType='01';//支付类型  01-小程序支付
const busiId='11'; //业务类型 11-充电桩
Page({

  /**
   * 页面的初始数据
   */
  data: {
     'SAVE_AMT_NUM':[],
     'AGREE_INSTU':false,//协议默认没有选中
     'CHOOSED_SAVE_AMT':50,//选中的充值金额
     'AGREE_INSTU':false,
     'oweFeeAmt':0.00
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.loading(), this.showLoading(!1);
   
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
    this.requestMyActInfo();
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
  chooseSaveAmt:function(event){
    let saveAmt = event.currentTarget.dataset.saveamt;
    this.setData({'CHOOSED_SAVE_AMT':saveAmt});
  },
  choosedAgree:function(event){
     this.setData({'AGREE_INSTU':!this.data.AGREE_INSTU});
  },
  requestMyActInfo:function(){
    var data = {
      'custId': app.storage.getLoginInfo().custId,
      'houseSeqId': app.storage.getLoginInfo().houseSeqId,
      'huSeqId':app.storage.getLoginInfo().huSeqId
    };
    this.showLoading(!0);
    var that=this;
    var res = app.req.postRequest(apiUtil.queryAcctInfo,data).then(function(res){
       console.log("返回结果:" + JSON.stringify(res.data));
        if(res.data.respCode=='000'){
           let acctBal=res.data.data?res.data.data[0].acctBal:0.00;
           that.setData({'acctBal':acctBal.toFixed(2)});
           that.requestOweFee();
        }else{
          //接口返回错误
          wx.showToast({
            title: res.data.errDesc + '[' + res.data.respCode + ']',
            icon: 'none'
          })
          that.setData({'isLoading':false});
          that.showLoading(!1);
        }
      });
  },
  requestOweFee:function(){
    var data = {
      'custId': app.storage.getLoginInfo().custId,
      'huSeqId':app.storage.getLoginInfo().huSeqId
    };
    var that=this;
    var res = app.req.postRequest(apiUtil.queryUsrOweFee,data).then(function(res){
       console.log("返回结果:" + JSON.stringify(res.data));
        if(res.data.respCode=='000'){
           if(res.data.data){
             let data=res.data.data;
             let oweFeeAmt=(data.chargeTotalAmt-data.actualPayAmt).toFixed(2);
            that.setData({'oweFeeAmt':oweFeeAmt});
           }else{
            that.setData({'oweFeeAmt':'0.00'});
           }
        }else{
          //接口返回错误
          wx.showToast({
            title: res.data.errDesc + '[' + res.data.respCode + ']',
            icon: 'none'
          })
          that.setData({'isLoading':false});
        }
        that.showLoading(!1);
      });
  },
  closeInstru:function(){
    this.setData({'isShowDialog':false});
  },
  doQueryAcctLog:function(){
    wx.navigateTo({
      url: '/subpages/acct/acctRecord'
    })
  },
  toRefund:function(){
    if(this.data.acctBal<=0.00){
      this.setData({'isShowDialog':true,'showDialogDesc':'账户余额必须大于0.00才可退款'});
       return;
    }
    let data={
      'custId': app.storage.getLoginInfo().custId,
      'houseSeqId': app.storage.getLoginInfo().houseSeqId,
      'huSeqId':app.storage.getLoginInfo().huSeqId,
      'payBeginDate':dateUtil.getDaysAgo(165,2),
      'payEndDate':dateUtil.getDaysAgo(0,2),
      'transType':acctInfo.refundType,
      'payStat':acctInfo.processStat,
      'busiId':acctInfo.chargeBusiId
    }
    let that=this;
    var res = app.req.postRequest(apiUtil.orderQueryUrl,data).then(function(res){
      // console.log("返回结果:" + JSON.stringify(res.data));
       if(res.data.RESPCODE=='000'){
           //存在退款中的交易订单，不能退款
          that.setData({'isShowDialog':true,'showDialogDesc':'已存在退款中的订单,请稍后再退'});
       }else{
         //接口返回错误
         if(res.data.ERRDESC=='暂无支付订单记录'){//可退款
            wx.navigateTo({
              url: '/subpages/acct/acctRefund'
            })
         }else{
            wx.showToast({
              title: res.data.ERRDESC + '[' + res.data.RESPCODE + ']',
              icon: 'none'
            })
         }
      
         that.setData({'isLoading':false});
       }
       that.showLoading(!1);
     });

  },
  doSaveAmt:function(){
    var that=this;
    if(!that.data.AGREE_INSTU){
      that.setData({'isShowDialog':true,'showDialogDesc':'请先同意充值协议'});
    }else{
      Dialog.confirm({
        message: '确认充值?',
      }).then(() => {
        that.showLoading(!0);
        var data = {
          'custId': app.storage.getLoginInfo().custId,
          'houseSeqId': app.storage.getLoginInfo().houseSeqId,
          'huSeqId':app.storage.getLoginInfo().huSeqId,
          'ordAmt': parseFloat(that.data.CHOOSED_SAVE_AMT).toFixed(2),
          'payType': payType,
          'busiId': busiId,
          'appid': app.storage.getLoginInfo().appId,
          'openid': app.storage.getLoginInfo().hgjOpenId,
          'goodsDesc': '充电桩充值',
          'payDate': '',
          'paySeqId': ''
        };
        var res = app.req.postRequest(apiUtil.recharge, data).then(function (res) {
          console.log("返回结果:" + JSON.stringify(res.data));
          if (res.data.RESPCODE == '000') {
            //支付
            var payinfo = JSON.parse(res.data.PAYINFO);
            that.minProgramPay(payinfo);
          } else {
            //接口返回错误
            that.showLoading(!1);
            wx.showToast({
              title: res.data.ERRDESC + '[' + res.data.RESPCODE + ']',
              icon: 'none'
            })
          }
        });
      }).catch((err) => {
          console.log("取消充值")
          that.showLoading(!1);
      });
    }
   
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
        Dialog.alert({
          message: '充值处理中,请稍后查询结果',
        }).then(() => {
          wx.navigateTo({
            url: '/subpages/acct/acctRecord'
          })
        });
     
      },
      'fail': function (res) {
        console.log("fail");
        console.log(res);
      },
      'complete': function (res) {
        console.log("complete");
        console.log(res);
        that.showLoading(!1);
      }
    });
  },
  seeProtoco:function(){
    wx.navigateTo({
      url: '/subpages/acct/acctSaveProtocol',
    })
  }
})