const api = require('../../../const/api'),
 app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
      billList:[],
      pageNum:1,
      pageSize:5,
      pages:10,
      totalNum:1,
      obj:null,
      cstCode:'',
      proNum:'',
      wxOpenId:'',
      nav_type: 0,
      payment_button_disabled:false,
      repYears:'',
      ipItemName:'',
      month:'',
      yearMonth:'',
      billMonthAmountTotal:'',
      billMonthAmountPaidIn:''
  },

  loadMore(event){
    var pageNum = this.data.pageNum + 1;
    this.setData({
      pageNum:pageNum,
    });
    this.queryForPage('loadMore');
  },

  queryForPage(type){
    var datas = this.data;
    var pageNum = datas.pageNum;
    var pageSize = datas.pageSize;
    var data = {};
    data['pageNum'] = pageNum;
    data['pageSize'] = pageSize;
    data['cstCode'] = app.storage.getCstCode();
    data['wxOpenId'] = app.storage.getWxOpenId();
    data['proNum'] = app.storage.getProNum(); 
    data['repYears'] = this.data.repYears;  
    data['ipItemName'] = this.data.ipItemName;
    var that = this;
    app.req.postRequest(api.queryBillMonthDetail,data).then(res=>{
        console.log("回调用",res);
        if(res.data.respCode == '000'){
          var billList = res.data.billList;
          var month = res.data.month;
          var yearMonth =  res.data.yearMonth;
          var billMonthAmountTotal = res.data.billMonthAmountTotal;
          var billMonthAmountPaidIn = res.data.billMonthAmountPaidIn;
          let totalNum = res.data.totalNum;
          var pages = parseInt(res.data.pages);
          that.data.billList.push.apply(that.data.billList,billList);
          that.setData({
            pages:pages,
            billList:type == 'loadMore'?that.data.billList:billList,
            totalNum:totalNum,
            month:month,
            yearMonth:yearMonth,
            billMonthAmountTotal:billMonthAmountTotal,
            billMonthAmountPaidIn:billMonthAmountPaidIn
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
    let repYears = options['repYears'];
    let ipItemName = options['ipItemName'];
    this.setData({
      repYears: repYears,
      ipItemName: ipItemName
    })
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
      this.setData({
        checkedAll: ""
      })
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