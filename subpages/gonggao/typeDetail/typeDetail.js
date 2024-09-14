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
    typeId:'',
    typeName:'',
    typeGonggaos:[],
    loading: false,//是否正在加载
    more: false, //是否还有数据
    iphoneX:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.loading(),this.showLoading(!1)
    let typeId = options['typeId'];
    let typeName = options['typeName'];
    this.setData({
      pageNum:1,
      pageSize:5,
      typeId:typeId,
      typeName:typeName,
      typeGonggaos:[],
      iphoneX:app.globalData.iphoneX
    })
    this.queryTypeGonggaos()
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
    this.queryTypeGonggaos();
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
      typeGonggaos:new Array()
    })
    this.queryTypeGonggaos()
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
  queryTypeGonggaos:function(type){
    var that = this;
    var queryParams = {
      cstCode:app.storage.getCstCode(),
      wxOpenId:app.storage.getWxOpenId(),
      proNum:app.storage.getProNum(),
      proName:app.storage.getProName(),
      pageNum:that.data.pageNum,
      pageSize:that.data.pageSize,
      typeId:that.data.typeId
    };
    that.showLoading(!0)
    app.req.postRequest(api.queryTypeGonggaos, queryParams).then(function (value) {
      console.log("queryTypeGonggaos 返回", value);
      if(value.data.respCode == "000"){
        var typeGonggaoList = value.data.list;
        let totalNum = value.data.totalNum;
        var pages = parseInt(value.data.pages);
        that.data.typeGonggaos.push.apply(that.data.typeGonggaos,typeGonggaoList);
       
        that.setData({
          pages:pages,
          typeGonggaos:type == 'loadMore'?that.data.typeGonggaos:typeGonggaoList,
          totalNum:totalNum,
          isRefreshing:false
        })
      }
      that.showLoading(!1)
    }, function (value) {
      console.log("queryTypeGonggaos F ", value);
      wx.showToast({
        icon:'none',
        title: '查询访客记录失败'
      })
      that.showLoading(!1)
    }); 
  },

  gonggaoDetail(e) {
    var url = e.currentTarget.dataset.datavalue.url;
    var gongGaoId = e.currentTarget.dataset.datavalue.id;
    //url = 'https://zhgj.xhguanjia.cn/home.html';
    var title = e.currentTarget.dataset.datavalue.title;
    url = encodeURIComponent(url);
    if (url != '' && url != undefined) {
      wx.navigateTo({
        url: '/subpages/gonggao/web/ggDetail?url=' + url + '&titleName=' + title+ '&gongGaoId=' + gongGaoId
      })
    } else {
      this.onClickHide();
    }
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
    this.queryTypeGonggaos('loadMore');
  },
})