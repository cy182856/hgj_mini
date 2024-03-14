const app = getApp();
const api = require("../../../const/api");
//import Dialog from '../../../miniprogram_npm/@vant/weapp/dialog/dialog';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pageNum:1,
    pageSize:10,
    pages:10,
    totalNum:1,
    gonggaoTypes:[],
    loading: false,//是否正在加载
    more: false, //是否还有数据
    iphoneX:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.loading(),this.showLoading(!1)
    this.setData({
      pageNum:1,
      pageSize:5,
      gonggaoTypes:[],
      iphoneX:app.globalData.iphoneX
    })
    this.queryTypes()
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
      more:true,
      loading:false,
      isRefreshing:true,
      gonggaoTypes:new Array()
    })
    this.queryTypes()
    wx.stopPullDownRefresh({
      success: (res) => {},
    })
  },

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

  },
  queryTypes:function(type){
    var that = this;
    var queryParams = {
      cstCode:app.storage.getCstCode(),
      wxOpenId:app.storage.getWxOpenId(),
      proNum:app.storage.getProNum(),
      proName:app.storage.getProName(),
      pageNum:that.data.pageNum,
      pageSize:that.data.pageSize
    };
    that.showLoading(!0)
    app.req.postRequest(api.queryTypes, queryParams).then(function (value) {
      console.log("queryTypes 返回", value);
      if(value.data.respCode == "000"){
        var gonggaoTypeList = value.data.list;
        let totalNum = value.data.totalNum;
        var pages = parseInt(value.data.pages);
        that.data.gonggaoTypes.push.apply(that.data.gonggaoTypes,gonggaoTypeList);
       
        that.setData({
          pages:pages,
          gonggaoTypes:type == 'loadMore'?that.data.gonggaoTypes:gonggaoTypeList,
          totalNum:totalNum,
           isRefreshing:false
        })
      }
      that.showLoading(!1)
    }, function (value) {
      console.log("queryTypes F ", value);
      wx.showToast({
        icon:'none',
        title: '查询访客记录失败'
      })
      that.showLoading(!1)
    }); 
  },

  typeDetail(e) {
    var typeId = e.currentTarget.dataset.datavalue.id;
    var typeName = e.currentTarget.dataset.datavalue.name;
    //url = encodeURIComponent(url);
   // if (url != '' && url != undefined) {
      wx.navigateTo({
        url: '/subpages/gonggao/typeDetail/typeDetail?typeId='+typeId+"&typeName="+typeName
      })
   // } else {
      //this.onClickHide();
    //}
  },

  checkVisitLog:function(e){
    var visitLog = e.currentTarget.dataset.visitlog
    wx.navigateTo({
      url: '/subpages/visit/visitDetail/visitDetail?visitDate='.concat(visitLog.visitDate)
      .concat('&visitSeqId=').concat(visitLog.visitSeqId )
    })
  },

  loadMore(event){
    var pageNum = this.data.pageNum + 1;
    this.setData({
      pageNum:pageNum,
    });
    this.queryTypes('loadMore');
  },
})