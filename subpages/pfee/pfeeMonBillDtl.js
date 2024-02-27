// subpages/pfee/pfeeMonBillDtl.js
import Toast from '../../miniprogram_npm/@vant/weapp/toast/toast';
const app = getApp();
const api = require('../../const/api');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    shortName: "",
    houseName: "",
    pfeeMonBillDto: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.loading();
    //初始化数据
    this.queryBasePfeeInfo();
    let loginInfo = app.storage.getLoginInfo();
    let shortName = loginInfo.commanyShortName;
    let houseName = loginInfo.completeAddr;
    this.setData({
      shortName: shortName,
      houseName: houseName
    });

    let billMon = options.billMon;
    this.queryPfeeBillMon(billMon);
  },

  queryBasePfeeInfo: function(){
    this.showLoading(true);
    app.req.postRequest(api.queryPfeeInfo).then(value => {
      this.showLoading(false);
      if(value.data.respCode != '000'){
        Toast('['+value.data.respCode+']'+value.data.errDesc);
        return;
      }
      let earliestBillMon = value.data.earliestBillMon;
      let lastestBillMon = value.data.lastestBillMon;
      let minYear = earliestBillMon.substring(0, 4);
      let maxYear = lastestBillMon.substring(0, 4);
      this.setData({
        minYear: minYear,
        maxYear: maxYear
      });
    });
  },

  queryPfeeBillMon: function(billMon){
    let condition = {startBillMon : billMon, endBillMon : billMon};
    this.showLoading(true);
    app.req.postRequest(api.queryPfeeMonBillNew, condition).then(value => {
      this.showLoading(false);
      if(value.data.respCode != '000'){
        Toast('['+value.data.respCode+']'+value.data.errDesc);
        return;
      }
      let pfeeMonBillDtos = value.data.pfeeMonBillDtos;
      let pfeeMonBillDto = pfeeMonBillDtos[0];
      this.setData({
        pfeeMonBillDto: pfeeMonBillDto
      });
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