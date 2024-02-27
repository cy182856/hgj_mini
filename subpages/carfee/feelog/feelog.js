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
    carFeeLogs:new Array()
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.loading(),that = this, that.showLoading(!1);
    that.queryCarFeeLogs();
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
  onLoadMore:function(){
    that.setData({
      pageNum:that.data.pageNum + 1,
      loading : !0
    })
    that.queryCarFeeLogs();
  },
  queryCarFeeLogs:function(){
    that.showLoading(!0)
    let queryParams = {
      stat : 'S',
      pageNum:that.data.pageNum ,
      pageSize:that.data.pageSize
    }
    app.req.postRequest(api.queryCarFeeLogs, queryParams).then(function (res){
      if(res.data && res.data.respCode == '000'){
        var more = true,
        carFeeLogs = res.data.data,
        finalCarFeeLogs = that.data.carFeeLogs;
        if(!res.data.totalRecord
          || res.data.totalRecord <= that.data.pageSize * that.data.pageNum){
            more = false
          }
        if(carFeeLogs && carFeeLogs.length >0){
          for(var i in carFeeLogs){
            carFeeLogs[i].orderDateDesc = carFeeLogs[i].ordDateDesc + "  " + carFeeLogs[i].payTimeDesc
            carFeeLogs[i].carNumber = carFeeLogs[i].carNumber.substr(0,2) + "-***" 
              + carFeeLogs[i].carNumber.substr(carFeeLogs[i].carNumber.length - 2,2)
          }
          finalCarFeeLogs = finalCarFeeLogs.concat(carFeeLogs)
        }
        that.setData({
          padding_bottom:app.globalData.iphoneX ?  '36' : '0',
          carFeeLogs : finalCarFeeLogs,
          loading : false,
          more:more
        })
      }else{
        wx.showToast({
          title: '获取停车缴费记录失败',
          icon:'none',
          duration:2000
        })
      }
      that.showLoading(!1)
    })
  },
  checkDetail:function(e){
    let carFeeLog = e.currentTarget.dataset.item;
    wx.navigateTo({
      url: '../feedetail/feedetail?ordDate=' + carFeeLog.ordDate + "&ordSeqId=" + carFeeLog.ordSeqId
    })
  }
})