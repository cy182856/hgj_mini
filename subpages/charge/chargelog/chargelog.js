var that = null,
app = getApp();
const api = require('../../../const/api');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pageNum:1,
    pageSize:5,
    more:true,
    padding_bottom:0,
    chargeOrdLogDtl: '',
    chargeOrdLogs:new Array()
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.loading(),that = this, that.showLoading(!1);
    that.queryChargeOrdLogs();
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
    let chargeOrdLogArry = that.data.chargeOrdLogs;
    let chargeOrdLogDtl = that.data.chargeOrdLogDtl;
    if(chargeOrdLogDtl != '' && chargeOrdLogArry && chargeOrdLogArry.length >0){
      for(var i in chargeOrdLogArry){
        if(chargeOrdLogArry[i].ordDate==chargeOrdLogDtl.ordDate 
          && chargeOrdLogArry[i].ordSeqId==chargeOrdLogDtl.ordSeqId){
            chargeOrdLogArry[i] = chargeOrdLogDtl;
            that.setData({
              chargeOrdLogs: chargeOrdLogArry
            });
          }
      }
    }
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
  onLoadMore:function(){
    that.setData({
      pageNum:that.data.pageNum + 1,
      loading : !0
    })
    that.queryChargeOrdLogs();
  },
  queryChargeOrdLogs:function(){
    that.showLoading(!0)
    let queryParams = {
      pageNum:that.data.pageNum ,
      pageSize:that.data.pageSize
    }
    app.req.postRequest(api.queryChargeOrdLogs, queryParams).then(function (res){
      if(res.data && res.data.respCode == '000'){
        var more = true,
        chargeOrdLogs = res.data.data,
        finalchargeOrdLogs = that.data.chargeOrdLogs;
        if(!res.data.totalRecord
          || res.data.totalRecord <= that.data.pageSize * that.data.pageNum){
            more = false
          }
        if(chargeOrdLogs && chargeOrdLogs.length >0){
          for(var i in chargeOrdLogs){
            chargeOrdLogs[i].orderDateDesc = chargeOrdLogs[i].ordDateDesc + "  " + chargeOrdLogs[i].payTimeDesc
          }
          finalchargeOrdLogs = finalchargeOrdLogs.concat(chargeOrdLogs)
        }
        that.setData({
          padding_bottom:app.globalData.iphoneX ?  '36' : '0',
          chargeOrdLogs : finalchargeOrdLogs,
          loading : false,
          more:more
        })
      }else{
        wx.showToast({
          title: '获取充电记录失败',
          icon:'none',
          duration:2000
        })
      }
      that.showLoading(!1)
    })
  },
  checkDetail:function(e){
    let chargeOrdLog = e.currentTarget.dataset.item;
    wx.navigateTo({
      url: '../chargelogdtl/chargelogdtl?ordDate=' + chargeOrdLog.ordDate + "&ordSeqId=" + chargeOrdLog.ordSeqId
    })
  }
})