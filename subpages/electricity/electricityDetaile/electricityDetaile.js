const app = getApp();
const api = require("../../../const/api");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    pageNum:1,
    pageSize:10,
    pages:10,
    totalNum:1,
    electricitys:[],
    loading: false,//是否正在加载
    more: false, //是否还有数据
    iphoneX:false,
    startDate: '',
    endDate: '',
    roomId:''
  },

  onStartDateChange: function(e) {
    this.setData({
      startDate: e.detail.value
    });
  },
  onEndDateChange: function(e) {
    this.setData({
      endDate: e.detail.value
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.loading(),this.showLoading(!1)
    this.setData({
      pageNum:1,
      pageSize:10,
      electricitys:[],
      iphoneX:app.globalData.iphoneX,
      roomId: options.roomId,
      startDate: options.startDate,
      endDate: options.endDate
    })
    this.queryElectricity()
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
      electricitys:new Array()
    })
    this.queryElectricity()
    wx.stopPullDownRefresh({
      success: (res) => {},
    })
  },

  onReachBottom: function () {
    // let totalNum = this.data.totalNum;
    // let pageNum = this.data.pageNum;
    // let pageSize = this.data.pageSize;
    // if(pageNum * pageSize < totalNum){
    //   this.loadMore();
    // }else{
    //   wx.showToast({
    //     title: '已经到底了',
    //     icon:'none'
    //   })
    // }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  queryElectricity:function(type){
    var that = this;
    var queryParams = {
      cstCode:app.storage.getCstCode(),
      wxOpenId:app.storage.getWxOpenId(),
      proNum:app.storage.getProNum(),
      proName:app.storage.getProName(),
      pageNum:that.data.pageNum,
      pageSize:that.data.pageSize,
      roomId:that.data.roomId,
      startDate:that.data.startDate,
      endDate:that.data.endDate
    };
    that.showLoading(1)
    app.req.postRequest(api.queryElectricityDetail, queryParams).then(function (value) {
      console.log("queryElectricity 返回", value);
      if(value.data.respCode == "000"){
        var electricityList = value.data.list;
        let totalNum = value.data.totalNum;
        var pages = parseInt(value.data.pages);
        that.data.electricitys.push.apply(that.data.electricitys,electricityList);
        that.setData({
          pages:pages,
          electricitys:type == 'loadMore'?that.data.electricitys:electricityList,
          totalNum:totalNum,
          isRefreshing:false
        })
        that.showLoading(0)
      }
    }, function (value) {
      console.log("queryElectricity F ", value);
      wx.showToast({
        icon:'none',
        title: '查询失败'
      })
      that.showLoading(0)
    }); 
  },
 
  loadMore(event){
    // var pageNum = this.data.pageNum + 1;
    // this.setData({
    //   pageNum:pageNum,
    // });
    // this.queryElectricity('loadMore');
  },
})