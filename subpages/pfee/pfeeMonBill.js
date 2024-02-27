// subpages/pfee/pfeeMonBill.js
import Toast from '../../miniprogram_npm/@vant/weapp/toast/toast';
const app = getApp();
const api = require('../../const/api');


Page({

  /**
   * 页面的初始数据
   */
  data: {
    minYear: "2010",
    maxYear: "2030",
    shortName:"",
    houseName:"",
    year: "",
    yearDesc: "",
    pfeeMonBillDtos: "",
    payCnt: 0,
    unPayCnt: 0
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
    this.initYear();
    this.queryYearPfeeBillMon();

  },

  initYear: function(){
    let date = new Date();
    let year=date.getFullYear(); 
    this.setData({
      year: year,
      yearDesc: year+"年",
    });
  },
  nextYear: function(){
    let year = this.data.year;
    let nextYear = year+1;
    this.setData({
      year: nextYear,
      yearDesc: nextYear+"年",
    });
    this.queryYearPfeeBillMon();
  },
  lastYear: function(){
    let year = this.data.year;
    let lastYear = year-1;
    this.setData({
      year: lastYear,
      yearDesc: lastYear+"年",
    });
    this.queryYearPfeeBillMon();
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

      let pfeePayCyc = value.data.pfeePayCyc;
      if(pfeePayCyc == 'Q'){//季度判断是否显示下一年
          let mon_ = lastestBillMon.substring(4,6);
          if(mon_/3 < 1 ){
            maxYear = parseInt(maxYear)-1;
          }
      }

      this.setData({
        minYear: minYear,
        maxYear: maxYear
      });
    });
  },

  queryYearPfeeBillMon: function(){
    let year = this.data.year;
    let startBillMon = year+"01";
    let endBillMon = year+"12";
    let condition = {startBillMon : startBillMon, endBillMon : endBillMon};
    this.showLoading(true);
    app.req.postRequest(api.queryPfeeMonBillNew, condition).then(value => {
      this.showLoading(false);
      if(value.data.respCode != '000'){
        Toast('['+value.data.respCode+']'+value.data.errDesc);
        return;
      }
      
      let pfeeMonBillDtos = value.data.pfeeMonBillDtos;
      if(pfeeMonBillDtos == null || pfeeMonBillDtos.length == 0){
        pfeeMonBillDtos = '';
      }
      let totalNum = value.data.totalBillMonCnt;
      let unPayCnt  = value.data.unPayBillMonCnt;
      let payCnt = pfeeMonBillDtos.length-unPayCnt;
      this.setData({
        pfeeMonBillDtos: pfeeMonBillDtos,
        unPayCnt: unPayCnt,
        payCnt: payCnt
      });
    });
  },

  toDtl: function(e){
    let billMon = e.currentTarget.dataset.billmon;
    wx.navigateTo({
      url: 'pfeeMonBillDtl?billMon='+billMon
    })
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