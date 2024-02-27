const app = getApp();
const api = require("../../../const/api");
import { toBarcode, toQrcode } from '../../../utils/codeUtil';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    codeStr: '',
    refreash:false,
    showCode:'none',
    visitQrCode:'',
    houseName:'',
    visitName:'',
    carNum:'',
    expNum:'',
    expDate:'',
    effectuateDate:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // if(!options.visitDate
    //   || !options.visitSeqId){
    //     wx.showToast({
    //       icon: "none",
    //       title: "参数获取失败，请刷新重试。",
    //       duration: 3000
    //     }),setTimeout(function() {
    //       wx.navigateBack({})
    //     },2000);
    //     return;
    //   }
    var logInfo = app.storage.getLoginInfo(),that = this;
    var windowW = app.globalData.windowW;
    that.setData({
      windowW:windowW,
      logInfo:logInfo,
      visitDate:options.visitDate,
      visitSeqId:options.visitSeqId,
      visitQrCode:options.visitQrCode,
      houseName:options.houseName,
      visitName:options.visitName,
      carNum:options.carNum,
      expNum:options.expNum,
      expDate:options.expDate,
      effectuateDate:options.effectuateDate
    })
    //that.createCode()
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
    let pages = getCurrentPages(); 
    let prePage = pages[pages.length - 2]; 
    if(this.data.refreash){
        prePage.onLoad();
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

  },
  refreshVisitCode:function(){
    var that = this;
    var logInfo = that.data.logInfo,
    visitDate = that.data.visitDate,
    visitSeqId = that.data.visitSeqId;
    var updCodeParams = {
      custId:logInfo.custId,
      visitDate:visitDate,
      visitSeqId:visitSeqId
    };
    app.req.postRequest(api.updateVisitLog, updCodeParams).then(function (value) {
      console.log("updateVisitLog 返回", value);
      that.createCode()
    }, function (value) {
      console.log("updateVisitLog F ", value);
      wx.showToast({
        icon:'none',
        title: '刷新通行码失败'
      })
    }); 
    this.setData({
      refreash:true
    })
  },
  createCode:function(){
    var that = this;
    var logInfo = that.data.logInfo,
    windowW = that.data.windowW,
    visitDate = that.data.visitDate,
    visitSeqId = that.data.visitSeqId;
    var queryParams = {
      custId:logInfo.custId,
      visitDate:visitDate,
      visitSeqId:visitSeqId
    };
    var houseInfo = logInfo.completeAddr
    app.req.postRequest(api.checkVisitLogDetail, queryParams).then(function (value) {
      console.log("checkVisitLogDetail 返回", value);
      var visitLogInfo = value.data.visitLogInfo;
      toBarcode('barcode', visitLogInfo.barCode , 600, 100);
      toQrcode('qrcode', visitLogInfo.qrCodeParams, 400, 400);
      // const codeStr = visitLogInfo.barCode.slice(0, 4).concat('****').concat(visitLogInfo.barCode.slice(8));
      const codeStr = visitLogInfo.barCode;
      var barCodeStrs = new Array();
      for(var i = 0;i < codeStr.length; i++){
        barCodeStrs.push(codeStr.substr(i,1))
      }
      if(null != visitLogInfo){
          if(visitLogInfo.avlCnt >= 0){
            visitLogInfo.perCent = visitLogInfo.expCnt - visitLogInfo.avlCnt + '/' + visitLogInfo.avlCnt
          }else if(visitLogInfo.avlCnt == -2){
            visitLogInfo.perCent = visitLogInfo.expCnt - 0 + '/' + 0
          }
      }
      that.setData({
          code:visitLogInfo.barCode,
          codeStr:codeStr,
          visitLogInfo:visitLogInfo,
          houseInfo:houseInfo,
          barCodeStrs:barCodeStrs,
          showCode:'block'
      })
    }, function (value) {
      console.log("checkVisitLogDetail F ", value);
      wx.showToast({
        icon:'none',
        title: '获取通行证信息失败',
      })
    }); 
  }
})