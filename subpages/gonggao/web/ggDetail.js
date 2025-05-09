// subpages/gonggao/web/ggDetail.js
const app = getApp();
const api = require("../../../const/api");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id:'',
    url:'',
    gongGaoId:'',
    content:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.loading(),this.showLoading(!1)
    let id = options['gongGaoId'];
    let url = options['url'];
    let titleName = options['titleName'];
    console.log('url============>',url,titleName);
    url = decodeURIComponent(url)
    // console.log('url============>',url);
    this.setData({url:url});
    wx.setNavigationBarTitle({
      title:titleName
    })
    this.setData({
      id:id
    })
    // 编辑器获取公告内容
    //this.queryGongGaoContent(id)
    // 金数据获取公告内容
    this.queryGongGaoUrl(id)
  },

  queryGongGaoUrl:function(id){
    var that = this;
    var queryParams = {   
      id:id,
      wxOpenId:app.storage.getWxOpenId(),
      proNum:app.storage.getProNum()
    };
    that.showLoading(!0)
    app.req.postRequest(api.queryGonggaoUrl, queryParams).then(function (value) {
      console.log("queryGonggaoUrl 返回", value);
      if(value.data.respCode == "000"){
        var gonggao = value.data.gonggao;
        let content = gonggao.url;     
        that.setData({
          content:content,
          isRefreshing:false
        })
      }
      that.showLoading(!1)
    }, function (value) {
      console.log("queryGonggaoUrl: ", value);
      wx.showToast({
        icon:'none',
        title: '查询失败'
      })
      that.showLoading(!1)
    }); 
  },

  queryGongGaoContent:function(id){
    var that = this;
    var queryParams = {   
      id:id,
      wxOpenId:app.storage.getWxOpenId(),
      proNum:app.storage.getProNum()
    };
    that.showLoading(!0)
    app.req.postRequest(api.queryGonggaoContent, queryParams).then(function (value) {
      console.log("queryGonggaoContent 返回", value);
      if(value.data.respCode == "000"){
        var gonggao = value.data.gonggao;
        let content = gonggao.content;     
        that.setData({
          content:content,
          isRefreshing:false
        })
      }
      that.showLoading(!1)
    }, function (value) {
      console.log("queryGonggaoContent: ", value);
      wx.showToast({
        icon:'none',
        title: '查询失败'
      })
      that.showLoading(!1)
    }); 
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
      isRefreshing:true
    })
    this.queryGongGaoContent(this.data.id);
    wx.stopPullDownRefresh({
      success: (res) => {},
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