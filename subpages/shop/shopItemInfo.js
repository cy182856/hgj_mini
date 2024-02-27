const apiUtil = require('../../const/api.js');
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    'SHOPDESC':'',//店铺描述
    'ISFULLDISC':'',//是否参加满减活动
    'FULLPURAMT':'',//满多少金额
    'DISCOFFAMT':'',//折扣多少金额
    'SHOPNAME':'',//店铺名称
    'LIEKITEMNAME':'',//模糊查询商品名称
    'ITEMINFODTOS':[], //店铺下的商品信息
    'TOTALRECORD':0,
    'CURRENTRECORD':0,

    'isLoading':true,
    'time':new Date().getTime(),
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.loading(), this.showLoading(!0);
    let supSeqId=options.supSeqId;
    let shopId=options.shopId;
    let shopName=options.shopName;
    wx.setNavigationBarTitle({
      title: shopName
    })
    this.supSeqId=supSeqId;
    this.shopId=shopId;
    // this.supSeqId='301000000328';
    // this.shopId='00001';
    this.pageNum=1;
    this.pageSize=5;
    this.currentRecord=0;

    this.likeItemName='';

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
    this.requestShopItemInfoRequest();
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
    this.queryMore();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  requestShopItemInfoRequest:function(){
    var data = {
      'supSeqId': this.supSeqId,
      'shopId': this.shopId,
      'likeItemName': this.likeItemName,
      'pageNum': this.pageNum,
      'pageSize': this.pageSize
    };
    var that = this;
    var res = app.req.postRequest(apiUtil.queryShopItemInfo,data).then(function (res) {
      console.log("返回结果:" + JSON.stringify(res.data));
      if (res.data.RESPCODE == '000') {
        let itemInfoDtos=that.pageNum==1?res.data.ITEMINFODTOS:(that.data.ITEMINFODTOS.concat(res.data.ITEMINFODTOS));
        that.setData({'SHOPDESC':res.data.SHOPDESC,'SHOPIMGURLS':res.data.SHOPIMGURLS,'ISFULLDISC':res.data.ISFULLDISC,'FULLPURAMT':res.data.FULLPURAMT,'DISCOFFAMT':res.data.DISCOFFAMT,'ITEMINFODTOS':itemInfoDtos,'TOTALRECORD':res.data.TOTALRECORD,'CURRENTRECORD':itemInfoDtos.length});
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
  onChange:function(event){
     this.likeItemName=event.detail;
     this.pageNum=1;
     this.requestShopItemInfoRequest();
  },
  queryMore:function(){
    if(this.data.CURRENTRECORD==this.data.TOTALRECORD){
      return;
    }else{
      this.pageNum = parseInt(this.pageNum) + 1;
      this.setData({ 'isLoading': true });
      this.showLoading(!0);
      this.requestShopItemInfoRequest();
    }
  },
  itemInfoDetail:function(event){
    let supSeqId = event.currentTarget.dataset.supseqid;
    let shopId= event.currentTarget.dataset.shopid;
    let itemId=event.currentTarget.dataset.itemid;
    wx.navigateTo({
      url: '/subpages/item/itemInfoDetail?supSeqId='+supSeqId+'&shopId='+shopId+'&itemId='+itemId,
    })
  }
})