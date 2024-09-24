const api = require('../../../const/api'),
 app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
      couponList:[],
      pageNum:1,
      pageSize:10,
      pages:10,
      totalNum:1,
      obj:null,
      cstCode:'',
      proNum:'',
      wxOpenId:'',
      navList: ['全部', '可用', '已用', '未用'],
      nav_type: 1
  },

  changeType: function (e) {
    let {
      index
    } = e.currentTarget.dataset;
    if (this.data.nav_type=== index || index === undefined) {
      return false;
    } else {
      this.setData({
        nav_type: index
      })
    }
    this.setData({
      pageNum:1,
    });
    this.queryForPage();
  },

  loadMore(event){
    var pageNum = this.data.pageNum + 1;
    this.setData({
      pageNum:pageNum,
    });
    this.queryForPage('loadMore');
  },


  queryForPage(type){
    this.showLoading(1);
    var datas = this.data;
    var pageNum = datas.pageNum;
    var pageSize = datas.pageSize;
    var couponType = datas.nav_type;
    var data = {};
    data['pageNum'] = pageNum;
    data['pageSize'] = pageSize;
    data['cstCode'] = app.storage.getCstCode();
    data['wxOpenId'] = app.storage.getWxOpenId();
    data['proNum'] = app.storage.getProNum();   
    data['couponType'] = couponType;
    var that = this;
    app.req.postRequest(api.couponQuery,data).then(res=>{
        console.log("回调用",res);
        this.showLoading(0);
        if(res.data.respCode == '000'){
          var couponList = res.data.couponGrantList;
          let totalNum = res.data.totalNum;
          var pages = parseInt(res.data.pages);
          that.data.couponList.push.apply(that.data.couponList,couponList);
          that.setData({
            pages:pages,
            couponList:type == 'loadMore'?that.data.couponList:couponList,
            totalNum:totalNum,
            isRefreshing:false
          });
        }else{
          var desc = res.data.errDesc;
          if(!desc){
            desc = '网络异常，请稍后再试';
          }
          app.alert.alert(desc);
        }
    });
  },

  costDetail: function (event) {
   
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.loading(),this.showLoading(0);
    this.setData({obj:app.storage.getLoginInfo()})
    this.queryForPage();
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
    this.setData({
      pageNum:1,
      loading:false,
      isRefreshing:true,
      couponList:new Array()
    })
    this.queryForPage()
    wx.stopPullDownRefresh({
    })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    let totalNum = this.data.totalNum;
    let pageNum = this.data.pageNum;
    let pageSize = this.data.pageSize;
    if(pageNum * pageSize < totalNum){
      this.loadMore();
    }else{
      wx.showToast({
        title: '已经到底了',
        icon:'none'
      })
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})