const api = require('../../../const/api'),
 app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
      cstCode:'',
      proNum:'',
      proName:app.storage.getProName(),
      wxOpenId:'',
      priRevAmount:0,//应收金额
      jiantouShow:'up'

  },

  billDetail:function(e){ 
    wx.navigateTo ({
        url: '../bill/bill',
    })   
  },
   
  queryForPage(){ 
    this.showLoading(1)
    var data = {};
    data['cstCode'] = app.storage.getCstCode();
    data['wxOpenId'] = app.storage.getWxOpenId();
    data['proNum'] = app.storage.getProNum();   
    var that = this;
    app.req.postRequest(api.queryPriRev,data).then(res=>{
        console.log("回调用",res);
        if(res.data.respCode == '000'){
          that.showLoading(0)
          var proName = res.data.proName;
          var priRevAmount = res.data.priRevAmount;
          that.setData({
            proName:proName,
            priRevAmount:priRevAmount,
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
    this.queryForPage();

    // 设置标题
    var proNum = app.storage.getProNum();
    var newTitle = '';
    if(proNum == '10000'){
      newTitle = '费用查询'
    }
    if(proNum == '10001'){
      newTitle = '物业缴费'
    }
    wx.setNavigationBarTitle({
      title: newTitle
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

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.setData({
      loading:false,
      isRefreshing:true,
      priRevAmount:0
    })
    this.queryForPage()
    wx.stopPullDownRefresh({
    })
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