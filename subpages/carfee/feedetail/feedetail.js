var that = null,
app = getApp();
const api = require('../../../const/api');
const util = require('../../../utils/util');
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.loading(), that = this, that.showLoading(!0);
    if(!options.ordDate 
      || !options.ordSeqId){
        wx.showToast({
          title: '查询车辆缴费详情信息关键信息缺失',
          icon:'none',
          duration:3000
        })
        setTimeout(function(){
          wx.navigateBack({
            delta:1
          });
        },3000)
        return false;
      }
    let queryParams = {
      ordDate:options.ordDate ,
      ordSeqId: options.ordSeqId
    }
    app.req.postRequest(api.queryCarFeeLogs, queryParams).then(function (res){
      if(res.data && res.data.respCode == '000'
      && res.data.data && res.data.data.length > 0){
        let carfeeLogDetail = res.data.data[0];
        carfeeLogDetail.carNumber = carfeeLogDetail.carNumber.substr(0,2) + "-***" 
        + carfeeLogDetail.carNumber.substr(carfeeLogDetail.carNumber.length - 2,2);
        that.setData({
          carfeeLogDetail: carfeeLogDetail,
          userInfo:app.storage.getLoginInfo()
        })
      }else{
        wx.showToast({
          title: '获取停车缴费记录详情失败',
          icon:'none',
          duration:2000
        })
        setTimeout(function(){
          wx.navigateBack({
            delta:1
          });
        })
      }
      that.showLoading(!1)
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
    var prePage = util.getPrePage();
    if(prePage.route == 'subpages/carfee/carfee'){
      prePage.queryCarInfos();
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