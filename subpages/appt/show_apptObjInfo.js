// subpages/mine/appt/show_apptObjInfo.js
const apiUtil = require('../../const/api.js');
const dateUtil = require('../../utils/dateUtil.js');
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
     APPTOBJINFODTOS:[],
     'bgColor':'#F3F5F5',
     'isLoading':true,
     'show':false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.loading(), this.showLoading(!1);
    this.setData({
      windowHeight: (wx.getSystemInfoSync().windowWidth*(750/wx.getSystemInfoSync().windowWidth))+'rpx'
    })
    let iphone8 = app.globalData.iphone8;
    if (iphone8) {
      this.setData({
        btuBottom: '38rpx',
      })
    }else{
      this.setData({
        btuBottom: '10rpx',
      })
    }

    this.requestApptObjInfo();
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
  requestApptObjInfo:function(){
    var data = {
      'custId': app.storage.getLoginInfo().custId
      // 'custId': '3048000060'
    };
    this.showLoading(!0);
    var that=this;
    var res = app.req.postRequest(apiUtil.queryApptObjInfo,data).then(function(res){
       // console.log("返回结果:" + JSON.stringify(res.data));
        if(res.data.respCode=='000'){
          for(let i=0;i<res.data.apptObjInfoDtos.length;i++){
            res.data.apptObjInfoDtos[i].apptObjDesc1="每日开放:"+res.data.apptObjInfoDtos[i].openTimeDesc+"~"+res.data.apptObjInfoDtos[i].closeTimeDesc;

            let apptObjDesc2="可于今日";
            let advApptTime=res.data.apptObjInfoDtos[i].advApptTime;
            apptObjDesc2=apptObjDesc2+advApptTime.substring(0,2)+":"+advApptTime.substring(2,4); 
            let advDate=dateUtil.getDaysAgo(1-res.data.apptObjInfoDtos[i].advApptDay,"yyyy-MM-dd")
            apptObjDesc2=apptObjDesc2+"起预约"+advDate+"日标的";
            res.data.apptObjInfoDtos[i].apptObjDesc2=apptObjDesc2;
          }
          if(res.data.apptObjInfoDtos.length==0){
            that.setData({'bgColor':'#FFFFFF','APPTOBJINFODTOS':res.data.apptObjInfoDtos,'isLoading':false});
          }else{
            that.setData({'bgColor':'#F3F5F5','APPTOBJINFODTOS':res.data.apptObjInfoDtos,'isLoading':false});
          }
        }else{
          //接口返回错误
          wx.showToast({
            title: res.data.errDesc + '[' + res.data.respCode + ']',
            icon: 'none'
          })
          that.setData({'isLoading':false});
        }
        that.showLoading(!1);
      });
  },

  getApptDtl:function(data){
    wx.navigateTo({
      url: '/subpages/appt/show_apptTimeInfo?objId=' + data.currentTarget.dataset.objid
    })
  },
  goToMineAppt:function(){
    wx.navigateTo({
      url: '/subpages/appt/mine_appt'
    })
  },
  showApptObjDesc:function(data){
    let objId=data.currentTarget.dataset.objid;
    for(let i=0;i<this.data.APPTOBJINFODTOS.length;i++){
      if(objId==this.data.APPTOBJINFODTOS[i].objId){
         this.setData({'APPTOBJINFO':this.data.APPTOBJINFODTOS[i],'show':true});
         break;
      }
    }
  },
  closeInstru:function(){
    this.setData({'show':false});
  }

})