const apiUtil = require('../../const/api.js');
const dateUtil = require('../../utils/dateUtil.js');
const acctInfo = require('./acctInfo.js');
import Dialog from '../../miniprogram_npm/@vant/weapp/dialog/dialog';
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    'isShowDialog':false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.loading(), this.showLoading(!1);
    this.requestRefundInfo();
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
  requestRefundInfo:function(){
    var data = {
      'custId': app.storage.getLoginInfo().custId,
      'houseSeqId': app.storage.getLoginInfo().houseSeqId,
      'huSeqId':app.storage.getLoginInfo().huSeqId
    };
    this.showLoading(!0);
    var that=this;
    var res = app.req.postRequest(apiUtil.queryRefundDivAmt,data).then(function(res){
       console.log("返回结果:" + JSON.stringify(res.data));
        if(res.data.respCode=='000'){
           let acctBal=res.data.acctBal;
           that.refundOnlineAmt=res.data.refundOnlineAmt;
           that.setData({'acctBal':parseFloat(acctBal).toFixed(2),'refundOnlineAmt':parseFloat(res.data.refundOnlineAmt).toFixed(2),'refundOfflineAmt':parseFloat(res.data.refundOfflineAmt).toFixed(2)});
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
  doRefund:function(){
    var data = {
       'refAmt':this.refundOnlineAmt,
       'busiId':acctInfo.chargeBusiId
    };

    var that=this;
    Dialog.confirm({
      message: '确认退款?',
    }).then(() => {
      that.showLoading(!0);
      var res = app.req.postRequest(apiUtil.refund,data).then(function(res){
         console.log("返回结果:" + JSON.stringify(res.data));
          if(res.data.respCode=='000'){
            that.setData({'isShowDialog':true,'showDialogDesc':'退款成功'});
          }else{
            //接口返回错误
            if(res.data.errCode=='01013722'){
              that.setData({'isShowDialog':true,'showDialogDesc':'账户退款时存在正在充电的订单，不能退款'});
              that.setData({'isLoading':false});
            }else{
              that.setData({'isShowDialog':true,'showDialogDesc':'退款处理中,请稍后查看结果'});
              that.setData({'isLoading':false});
            }
          
          }
          that.showLoading(!1);
        });
    }).catch((err) => {
      console.log("取消退款")
      that.showLoading(!1);
  });
 
  },
  closeInstru:function(){
    this.setData({'isShowDialog':false});
    wx.navigateBack({
      delta: 1
    });
  },
})