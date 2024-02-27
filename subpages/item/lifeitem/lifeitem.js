const app = getApp();
const apiUtil = require('../../../const/api.js');
import Toast from '../../../miniprogram_npm/@vant/weapp/toast/toast';
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
    app.loading();this.showLoading(1);
    var lifeDesc = options.lifedesc;
    wx.setNavigationBarTitle({
      title: lifeDesc
    })
    this.lifeItemShow(options.lifeid);
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
  lifeItemShow:function(lifeid) {
    let data = {
      lifeId:lifeid
    };
    var that = this;
    app.req.postRequest(
      apiUtil.lifeItemShowUrl,
      data
    ).then(function (res) {
      console.log(res);
      that.showLoading(0);
      if (res.data.RESPCODE == 'EEE') {
        that.setData({
          'msg':'网络异常，请稍后再试',
          'showErrMsg':true
        });
        return
      } else if (res.data.RESPCODE != '000') {
        that.setData({
          'msg':res.data.ERRDESC,
          'showErrMsg':true
        });
        return
      }
      var lifeItemsShowDtos = res.data.lifeData.lifeItemShowDtos;
      if (lifeItemsShowDtos == null || lifeItemsShowDtos.length == 0) {
        that.setData({
          'msg':'还没有商品数据哦',
          'showErrMsg':true
        });
      } else {
        that.setData({
          lifeItemShowDtos:lifeItemsShowDtos
        });
      }
    }).catch(error => {
      that.showLoading(0);
      that.setData({
        'msg':'网络异常，请稍后再试',
        'showErrMsg':true
      });
    });
  },
  itemshow:function(e) {
    var itemId = e.currentTarget.dataset.itemid;
    var itemName = e.currentTarget.dataset.itemname;
    var supSeqId =  e.currentTarget.dataset.supseqid;
    var shopId =  e.currentTarget.dataset.shopid;
    wx.navigateTo({
        url: '/subpages/item/itemInfoDetail?itemId=' + itemId + "&itemName=" + itemName + "&supSeqId=" + supSeqId + "&shopId=" + shopId,
    })
  }

})