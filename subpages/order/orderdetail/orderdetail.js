const app = getApp();
const apiUtil = require('../../../const/api.js');
import Toast from '../../../miniprogram_npm/@vant/weapp/toast/toast';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    payDate:'',
    paySeqId:'',
    payStat:'',
    orderDetail:'',
    showErrMsg:false,
    showPaycontainer:false,
    showMainDot:true,
    msg:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    app.loading();this.showLoading(1);
    let payDate = options.payDate;
    let paySeqId = options.paySeqId;
    let payStat = options.payStat;
    this.setData({
      payDate:payDate,
      paySeqId:paySeqId,
      payStat:payStat,
    });
    this.orderQueryDetail();
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

  orderQueryDetail:function() {
    let payDate = this.data.payDate;
    let paySeqId = this.data.paySeqId;
    let data = {
      payDate:payDate,
      paySeqId:paySeqId,
    };
    var that = this;
    app.req.postRequest(
      apiUtil.orderQueryDetailUrl,
      data
    ).then(function (res) {
      console.log(res.data.orderDetail);
      that.showLoading(0);
      if (res.data.RESPCODE != '000') {
        that.setData({
          showErrMsg:true,
          msg:res.data.ERRDESC,
        });
        return;
      } 
      let showMainDot = true;
      if ((res.data.orderDetail.apptOrdDtlDtos != null && res.data.orderDetail.apptOrdDtlDtos.length != 0)
        || (res.data.orderDetail.refundTransLogDtos != null && res.data.orderDetail.refundTransLogDtos.length != 0)) {
          showMainDot = false;
      }
      that.setData({
        showPaycontainer:true,
        showMainDot:showMainDot,
        orderDetail:res.data.orderDetail
      });
    }).catch(error => {
      that.showLoading(0);
      // 网络异常，请稍后再试
      that.setData({
        showErrMsg:true,
        msg:'网络异常，请稍后再试',
      });
    });
  }
})