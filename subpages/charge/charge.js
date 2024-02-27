// subpages/charge/charge.js
var that = null,
app = getApp();
const stringUtil = require('../../utils/stringUtil'),
dateUtil = require('../../utils/dateUtil'),
api = require('../../const/api');
import Dialog from '../../miniprogram_npm/@vant/weapp/dialog/dialog';
import util from '../../utils/util';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    map_popup_show:false, //地图弹窗是否显示
    sub_popup_show:false, //订阅弹窗是否显示
    rule_popup_show:false, //计费规则弹窗是否显示
    time_popup_show:false, //订阅时间弹窗是否显示
    sub_date_show:false, //
    showChargeAreaId: '',
    today: new Date().getDate(),
    maxSubDate: dateUtil.getDaysAgo(-7,"yyyy-MM-dd"),
    minSubTimeHour: "06",
    filter(type, options) {
      if (type === 'minute') {
        return options.filter((option) => option % 60 === 0);
      }

      return options;
    },
    padding_bottom:0,
    isFail:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.loading(),that = this,that.showLoading(!1);
    let userInfo = app.storage.getLoginInfo();
    that.setData({
      isIphoneX:app.globalData.iphoneX,
      userInfo:userInfo
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
    that.queryChargeList();
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
    //console.log("onUnload");
    let prePage = util.getPrePage();
    if(prePage.route == "subpages/charge/chargedetail/chargedetail"){
      prePage.setData({
        refresh:false
      })
    }
    wx.navigateBack({
      delta: 3,
    })
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
  onClickArea(event) {
    
    this.setData({
      showChargeAreaId: event.detail
    });
  },
  queryChargeList:function(){
    that.showLoading(!0);
    app.req.postRequest(api.queryChargeList, {}).then(function (res) {
      if(res.data && res.data.respCode == '000'){
        that.setData({
          chargeList:res.data.chargeAreaVos,
          chargeRule:res.data.chargeRuleVo,
          padding_bottom:that.data.isIphoneX ? '176' : '140',
          isFail:false
        })
        if(that.data.showChargeAreaId == ''){
          that.setData({
            showChargeAreaId:res.data.chargeAreaVos ? res.data.chargeAreaVos[0].chargeAreaId : ''
          })
        }
      }else{
        wx.showToast({
          title: '获取充电桩信息失败,请稍后重试',
          icon:'none',
          duration:2000,
          isFail:true
        })
      }
      that.showLoading(!1)
    })
  },

  chargeDetail:function(e){
    let chargeDev = e.currentTarget.dataset.item;
    wx.navigateTo({
      url: './chargedetail/chargedetail?coopId=' + chargeDev.coopId + "&deviceSn=" + chargeDev.deviceSn
    })
  },

  chargeLogList:function(e){
    wx.navigateTo({
      url: './chargelog/chargelog'
    })
  },
  chargeSubList:function(e){
    wx.navigateTo({
      url: './chargesublog/chargesublog'
    })
  },
  onShowMapPopup:function(e){
    let chargeArea = e.currentTarget.dataset.item;
    console.log(chargeArea);
    if(!chargeArea.areaLongitude 
      || !chargeArea.areaDimension 
      || !chargeArea.chargeAreaName){
			wx.showToast({
				title: '位置信息缺失',
				icon:'none',
				duration:3000
			})
			return false;
		}
		const INIT_MARKER = {
			callout: {
				content: chargeArea.chargeAreaName,
				padding: 10,
				borderRadius: 2,
				display: 'ALWAYS'
			},
			latitude: chargeArea.areaDimension,//纬度
			longitude: chargeArea.areaLongitude,//经度
			iconPath: './images/marker.png',
			width: '34px',
			height: '34px',
			rotate: 0,
			alpha: 1
		};
		that.setData({
      map_popup_show:true,
      scale:18,
			location: {
				latitude: chargeArea.areaDimension,
				longitude: chargeArea.areaLongitude
			},
			isShowScale: false,
			isShowCompass: false,
			isShowPosition: false,
			showActionSheet: false,
			markers: [{
				...INIT_MARKER
			}]
		})
		that.showLoading(!1)
  },
  onCloseMapPopup:function(e){
    that.setData({
      map_popup_show:false 
    })
  },
  onShowRulePopup:function(e){
    let chargeRule = e.currentTarget.dataset.item;
    console.log(chargeRule);
    if(!chargeRule){
      wx.showToast({
				title: '计费规则暂未配置，请联系物业',
				icon:'none',
				duration:3000
			})
			return false;
    }
    that.setData({
      rule_popup_show:true 
    })
  },
  onCloseRulePopup:function(e){
    that.setData({
      rule_popup_show:false 
    })
  },
  onShowSubPopup:function(e){
    that.showLoading(!0)
    let chargeAreaId = e.currentTarget.dataset.chargeareaid;
    let chargeAreaName = e.currentTarget.dataset.chargeareaname;
    let queryParams = {
      subDate: dateUtil.getCurrentDate("yyyyMMdd"),
      subType: 'A',
      subObjId: chargeAreaId
    };
    app.req.postRequest(api.queryChargeSubLog, queryParams).then(function (res){
      if(res.data && res.data.respCode == '000'){
        let areaSubLog = res.data.data;
        let popupChageArea ={
          chargeAreaId: chargeAreaId, 
          chargeAreaName: chargeAreaName,
          areaSubLog: areaSubLog
        };
        let subTimeHHmm = new Date().getHours()>22 ? '00:00' : (new Date().getHours()+1)+':00';
        that.setData({
          sub_popup_show: true ,
          newSubDate: '',
          newSubTime: '',
          popupChageArea: popupChageArea,
          sub_btn_disabled: areaSubLog.subStat =='N' ? true : false,
          subDate: areaSubLog.subDateDesc ? areaSubLog.subDateDesc : dateUtil.getCurrentDate("yyyy-MM-dd"),
          subStartTime: areaSubLog.subStartTimeDesc ? areaSubLog.subStartTimeDesc : subTimeHHmm,
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
      newSubDate: "0000-00-00",
      newSubTime: "24:00"
    })
  },
  onDisplaySubDate:function(){
    that.setData({
      sub_date_show: true ,
      newSubDate: that.data.subDate
    })
  },
  onCloseSubDate:function(){
    that.setData({
      sub_date_show:false ,
      newSubDate: "0000-00-00"
    })
  },
  onConfirmSubDate:function(event){
    let subDate = dateUtil.formatDate(event.detail,'yyyy-MM-dd');
    that.setData({
      sub_date_show:false,
      subDate: subDate,
      sub_btn_disabled: subDate != that.data.popupChageArea.areaSubLog.subDateDesc ? false : true
    })
  },
  onShowTimePopup:function(e){
    let subStartTime = e.currentTarget.dataset.item;
    that.setData({
      time_popup_show:true,
      newSubTime: subStartTime
    })
  },
  onCloseTimePopup:function(e){
    that.setData({
      time_popup_show:false,
      newSubTime: "24:00" 
    })
  },
  onConfirmSubTime(event) {
    let currentDate = dateUtil.getCurrentDate("yyyy-MM-dd");
    if(that.data.subDate == currentDate){
      let timeHHmm = new Date().getHours()+':00';
      if(event.detail <= timeHHmm){
        wx.showToast({
          title: '请选择大于 '+timeHHmm+' 的订阅时间！',
          icon:'none',
          duration:2000,
          isFail:false
        })
        return;
      }
    }
    that.setData({
      time_popup_show:false,
      subStartTime: event.detail
    });
    let oldSubDate = that.data.popupChageArea.areaSubLog.subDateDesc;
    let oldSubStartTime = that.data.popupChageArea.areaSubLog.subStartTimeDesc;
    if(that.data.subDate == oldSubDate){
      //订阅日期为当天(且当天已订阅)时：订阅按钮禁用状态受开始时间影响
      that.setData({
        sub_btn_disabled: event.detail != oldSubStartTime ? false : true
      });
    }
  },
  onCancelSubTime() {
    that.setData({
      time_popup_show:false ,
      newSubTime: "24:00"
    });
  },
  doChargeAreaSub:function(e){
    that.showLoading(!0);
    let chargeAreaId = e.currentTarget.dataset.chargeareaid;
    let chargeAreaName = e.currentTarget.dataset.chargeareaname;
    let subStartTime = that.data.subStartTime;
    subStartTime = subStartTime.substr(0, subStartTime.indexOf(':'));
    if (subStartTime.length == 1) subStartTime = '0'+subStartTime;
    let subParams = {
      subType: 'A',
      subDate: dateUtil.convertLongDateToShort(that.data.subDate),
      subObjId: chargeAreaId,
      subObjName: chargeAreaName,
      subStartTime: subStartTime
    }
    that.noticeCharge(subParams);
    that.showLoading(!1);
  },
  chargeDevSub:function(e){
    that.showLoading(!0);
    let chargeSubDev = e.currentTarget.dataset.item;
    let subParams = {
      subType: 'S',
      subObjId: chargeSubDev.deviceId,
      subObjName: chargeSubDev.deviceName
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
})