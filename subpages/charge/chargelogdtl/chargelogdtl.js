var that = null,
app = getApp();
const api = require('../../../const/api');
const util = require('../../../utils/util');
import Dialog from '../../../miniprogram_npm/@vant/weapp/dialog/dialog';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isRefleshOrd: false,
    canClick: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.loading(), that = this, that.showLoading(!0);
    if(!options.ordDate || !options.ordSeqId){
      wx.showToast({
        title: '查询充电记录详情信息关键信息缺失',
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
    that.setData({
      ordDate:options.ordDate ,
      ordSeqId: options.ordSeqId
    });
    let params = {
      ordDate:options.ordDate ,
      ordSeqId: options.ordSeqId
    };
    that.queryChargeOrdDtl(params);
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
    if(that.data.chargeOrdLogDtl && (that.data.chargeOrdLogDtl.ordStat == 'P' 
    || that.data.chargeOrdLogDtl.ordStat == 'I')){
      that.setData({
        isRefleshOrd: true,
        canClick: true
      });
      let params = {
        ordDate:that.data.ordDate ,
        ordSeqId: that.data.ordSeqId
      };
      that.queryChargeOrdDtl(params);
    }
    wx.stopPullDownRefresh();
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
  queryChargeOrdDtl:function (params) {

    app.req.postRequest(api.queryChargeOrdDtl, params).then(function (res){
      if(res.data && res.data.respCode == '000' && res.data.data){
        that.setData({
          chargeOrdLogDtl:res.data.data
        })
        if(that.data.isRefleshOrd){
          // 返回上一页刷新
          const pages = getCurrentPages();
          const prevPage = pages[pages.length - 2];
          prevPage.setData({
            chargeOrdLogDtl: res.data.data
          });
        }
      }else{
        wx.showToast({
          title: '获取充电记录详情失败',
          icon:'none',
          duration:2000
        })
        
      }
    })
    that.showLoading(!1)
  },

  endCharge: function (e) {
    let chargeDetail = e.currentTarget.dataset.item;
    let params = {
      ordDate: chargeDetail.ordDate,
      ordSeqId: chargeDetail.ordSeqId
    }
    Dialog.confirm({
      message: '确认结束充电?',
    }).then(() => {
      that.showLoading(!0);
      app.req.postRequest(api.endCharge, params).then(function (res) {
        if(res.data){
          if(res.data.respCode == '000'){
            wx.showToast({
              title: '结束充电成功',
              icon:'none',
              duration:2000,
              isFail:false
            })
            that.setData({
              isRefleshOrd: true,
              canClick: false
            });
            that.queryChargeOrdDtl(params);
          }else{
            wx.showToast({
              title: res.data.errDesc,
              icon:'none',
              duration:2000,
              isFail:false
            })
          }
        }else{
          wx.showToast({
            title: '结束充电失败,请稍后重试',
            icon:'none',
            duration:2000,
            isFail:true
          })
        }
      })
      that.showLoading(!1);
    }).catch((err) => {
      console.log("取消结束充电")
      that.showLoading(!1);
    });
  },
})