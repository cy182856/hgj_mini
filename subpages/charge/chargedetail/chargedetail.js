// subpages/charge/chargedetail/chargedetail.js
import Dialog from '../../../miniprogram_npm/@vant/weapp/dialog/dialog';
var that = null,
app = getApp();
const api = require('../../../const/api');
const util = require('../../../utils/util'),
dateUtil = require('../../../utils/dateUtil');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    sub_popup_show:false, //订阅弹窗是否显示
    today: new Date().getDate(),
    padding_bottom:0,
    isFail:true,
    refresh:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.loading(), that = this, that.showLoading(!1);
    if(!options.coopId || !options.deviceSn){
        wx.showToast({
          title: '查询充电桩详情关键信息缺失',
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
      isIphoneX:app.globalData.iphoneX,
      coopId:options.coopId ,
      deviceSn: options.deviceSn
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
    if(that.data.refresh){
      let queryParams = {
        custId:app.storage.getLoginInfo().custId,
        coopId:that.data.coopId ,
        deviceSn: that.data.deviceSn
      };
      that.queryChargeDatail(queryParams);
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
  copyDeviceSn: function (e) {
    let deviceSn = e.currentTarget.dataset.item;
    wx.setClipboardData({
      data: deviceSn,
      success: function (res) {
        wx.getClipboardData({
          // 这个api是把拿到的数据放到电脑系统中的
          success: function(res) {
            console.log(res.data) // data
          }
        })
      }
    })
  },
  queryChargeDatail:function(queryParams){
    that.showLoading(!0)
    app.req.postRequest(api.queryChargeDatail, queryParams).then(function (res){
      that.showLoading(!1)
      if(res.data && res.data.respCode == '000'
      && res.data.chargeDevInfoVo){
        if(res.data.chargeDevInfoVo.stat=='C'){//页面跳转进来状态是关闭
          Dialog.alert({
            message: '当前充电桩不可用,请换个充电桩重试',
          }).then(() => {
            // wx.navigateBack({
            //   delta: 0,
            // })
            wx.navigateTo({
              url: '/subpages/charge/charge'
            })
          });
        }else{
          that.setData({
            padding_bottom:that.data.isIphoneX ? '176' : '140',
            chargeDetail: res.data.chargeDevInfoVo,
            chargeRule:res.data.chargeRuleVo,
            userInfo:app.storage.getLoginInfo()
          })
        }
      }else{
        wx.showToast({
          title: '获取充电桩详情失败',
          icon:'none',
          duration:2000
        })
      }
    })
  },
  startCharge:function(e){
    let chargeDetail = e.currentTarget.dataset.item;
    let acctBal = that.data.chargeRule.acctBal;
    if(acctBal == '' || acctBal < 5){
      wx.showToast({
        title: '账户余额低于5元不可充电，请您先充值！',
        icon:'none',
        duration:2000
      })
      return false;
    }
    let queryParams = {
      coopId: chargeDetail.coopId,
      deviceId: chargeDetail.deviceId
    }
    Dialog.confirm({
      message: '确认发起充电?',
    }).then(() => {
      that.showLoading(!0);
      app.req.postRequest(api.startCharge, queryParams).then(function (res) {
        if(res.data){
          if(res.data.respCode == '000'){
            wx.showToast({
              title: '发起充电成功',
              icon:'none',
              duration:2000,
              isFail:false
            })
            wx.navigateTo({
              url: '../chargelogdtl/chargelogdtl?ordDate=' + res.data.data.ordDate + "&ordSeqId=" + res.data.data.ordSeqId
            })
          }else{
            wx.showToast({
              title: res.data.errDesc,
              icon:'none',
              duration:2000,
              isFail:false
            })
          }
          that.showLoading(!1);
        }else{
          wx.showToast({
            title: '发起充电失败,请稍后重试',
            icon:'none',
            duration:2000,
            isFail:true
          })
          that.showLoading(!1);
        }
      })
    }).catch((err) => {
      console.log("取消发起充电")
      that.showLoading(!1);
  	});
  },
  chargeAcct:function(e){
    wx.navigateTo({
      url: '/subpages/acct/myAcctInfo'
    })
  },

  doChargeDevSub:function(e){
    that.showLoading(!0);
    let deviceId = e.currentTarget.dataset.deviceid;
    let deviceName = e.currentTarget.dataset.devicename;
    let subStartTime = that.data.subStartTime;
    subStartTime = subStartTime.substr(0, subStartTime.indexOf(':'));
    if (subStartTime.length == 1) subStartTime = '0'+subStartTime;
    let subParams = {
      subType: 'S',
      subDate: dateUtil.convertLongDateToShort(that.data.subDate),
      subObjId: deviceId,
      subObjName: deviceName,
      subStartTime: subStartTime
    }
    that.noticeCharge(subParams);
    that.showLoading(!1);
  },
  noticeCharge:function(subParams){
    app.req.postRequest(api.addChargeSubLog, subParams).then(function (res) {
      if(res.data && res.data.respCode == '000'){
        wx.showToast({
          title: '订阅成功',
          icon:'none',
          duration:2000,
          isFail:false
        })
        that.setData({
          sub_popup_show:false //订阅弹窗不显示
        })
      }else if(res.data && res.data.errDesc != ''){
        wx.showToast({
          title: res.data.errDesc,
          icon:'none',
          duration:2000,
          isFail:true
        })
      }else{
        wx.showToast({
          title: '订阅失败,请稍后重试',
          icon:'none',
          duration:2000,
          isFail:true
        })
      }
    })
  },

  onShowSubPopup:function(e){
    that.showLoading(!0)
    let deviceId = e.currentTarget.dataset.deviceid;
    let deviceName = e.currentTarget.dataset.devicename;
    let queryParams = {
      subDate: dateUtil.getCurrentDate("yyyyMMdd"),
      subType: 'S',
      subObjId: deviceId
    };
    app.req.postRequest(api.queryChargeSubLog, queryParams).then(function (res){
      if(res.data && res.data.respCode == '000'){
        let areaSubLog = res.data.data;
        let popupSub ={
          deviceId: deviceId, 
          deviceName: deviceName,
          areaSubLog: areaSubLog
        };
        let subTimeHHmm = new Date().getHours()>22 ? '00:00' : (new Date().getHours()+1)+':00';
        that.setData({
          sub_popup_show: true ,
          popupSub: popupSub,
          sub_btn_disabled: areaSubLog.subStat =='N' ? true : false,
          subDate: areaSubLog.subDateDesc ? areaSubLog.subDateDesc : dateUtil.getCurrentDate("yyyy-MM-dd"),
          subStartTime: areaSubLog.subStartTimeDesc ? areaSubLog.subStartTimeDesc : subTimeHHmm
        })
      }else{
        wx.showToast({
          title: '获取订阅信息失败',
          icon:'none',
          duration:2000
        })
      }
      that.showLoading(!1)
    })
  },
  onCloseSubPopup:function(e){
    that.setData({
      sub_popup_show: false, //订阅弹窗不显示 
    })
  },
  
  getOperTips:function(){
    that.setData({
      showDesc:true
    })
  },

  closeOperTips:function(){
    that.setData({
      showDesc:false
    })
  },
})