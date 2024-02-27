const apiUtil = require('../../const/api.js');
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    'ISFULLDISC':'',//是否参加满减活动
    'FULLPURAMT':'',//满多少金额
    'DISCOFFAMT':'',//折扣多少金额

    'indicatorDots': true,
    'vertical': false,
    'autoplay': true,
    'interval': 5000,
    'duration': 500,
    'time':new Date().getTime(),
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.loading(), this.showLoading(!0);
      let supSeqId=options.supSeqId;
      let itemId=options.itemId;
      let shopId=options.shopId;

      console.log("supSeqId=="+supSeqId+",itemId="+itemId+",shopId="+shopId)

      this.supSeqId=supSeqId;
      this.shopId=shopId;
      this.itemId=itemId;

      // this.supSeqId='301000000328';
      // this.shopId='00001';
      // this.itemId='000001';

      this.pageNum=1;
      this.pageSize=1;
      wx.setNavigationBarTitle({
        title: '商品详情'
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
      this.itemInfoDetailRequest();
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
  itemInfoDetailRequest:function(){
    var data = {
      'supSeqId': this.supSeqId,
      'shopId': this.shopId,
      'itemId': this.itemId,
      'pageNum': this.pageNum,
      'pageSize': this.pageSize
    };
    var that = this;
    var res = app.req.postRequest(apiUtil.queryShopItemInfo,data).then(function (res) {
      console.log("返回结果:" + JSON.stringify(res.data));
      if (res.data.RESPCODE == '000') {
          let itemInfo='';
          if(res.data.ITEMINFODTOS[0].TOSHOPITEMINFODTO){
            itemInfo=res.data.ITEMINFODTOS[0].TOSHOPITEMINFODTO;
          }else if(res.data.ITEMINFODTOS[0].GRPITEMINFODTO){
            itemInfo=res.data.ITEMINFODTOS[0].GRPITEMINFODTO;
          }else if(res.data.ITEMINFODTOS[0].ADITEMINFODTO){
            itemInfo=res.data.ITEMINFODTOS[0].ADITEMINFODTO;
          }
          that.setData({'ITEMINFODTO':res.data.ITEMINFODTOS[0],'SHOPNAME':res.data.SHOPNAME,'ISFULLDISC':res.data.ISFULLDISC,'FULLPURAMT':res.data.FULLPURAMT,'DISCOFFAMT':res.data.DISCOFFAMT,'ITEMINFO':itemInfo,'WORKTIME':res.data.workTime,'WORKTIMEDESC':res.data.WORKTIMEDESC,'WKTIMETEL':res.data.WKTIMETEL,'URGENTTEL':res.data.URGENTTEL});
        //点击访问成功，进行广告类商品点击数量的更新
        if(res.data.ITEMINFODTOS[0].ADITEMINFODTO){
          that.addReadCntRequest();
        }
      } else {
        //接口返回错误
        wx.showToast({
          title: res.data.ERRDESC + '[' + res.data.RESPCODE + ']',
          icon: 'none'
        })
      }
      that.setData({'isLoading':false});
      that.showLoading(!1);
    });
  },
  addReadCntRequest:function(){
    var data = {
      'supSeqId': this.supSeqId,
      'itemId': this.itemId,
      'isRead': 'Y'
    };
    var that = this;
    var res = app.req.postRequest(apiUtil.updItemInfo,data).then(function (res) {
      console.log("返回结果:" + JSON.stringify(res.data));
      if (res.data.RESPCODE == '000') {
          
      } else {
        
      }
    });
  }
})