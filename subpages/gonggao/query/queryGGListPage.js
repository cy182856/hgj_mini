import Toast from '../../../miniprogram_npm/@vant/weapp/dialog/dialog';
const api = require('../../../const/api'),
      app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    glist:null //公告列表
    ,pageNo:1 //公告当前页
    ,pageSize:10 //公告默认一页最多展示的数据量
    ,totalNum:1 //总数据
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.loading(),this.showLoading(0);
    //初始化公告
    this.initData();

  },

  //初始化公告页
  initData(){
    let loginInfo = app.storage.getLoginInfo();
    if(loginInfo && loginInfo.commanyShortName){
      wx.setNavigationBarTitle({
        title: loginInfo.commanyShortName
      })
    }

    this.gonggao();
  },

  // 公告
  gonggao(){
    var that = this;
    let d = {};
    d['pageNo'] = this.data.pageNo;
    d['pageSize'] = this.data.pageSize;
    let gglist = this.data.glist;
    this.showLoading(1);
    app.req.postRequest(api.queryCurrNoticeNew,d).then(res=>{
      console.log('公告查询结果',res);
      this.showLoading(0);
      var data = res.data;
      if(data.respCode == '000'){
        if(data.usrNoticeLogDtos != null){
          let glist = data.usrNoticeLogDtos;
          if(gglist == null){
            gglist = glist;
          }else{
            gglist.push.apply(gglist,glist);
          }
          //20220107 修复2次编码
          let currNum = (that.data.pageNo-1) * that.data.pageSize
          for (let i = currNum; i < gglist.length; i++) {
            var ele = gglist[i];
            //console.log('原始的url',ele.noticeUrl);
            let url = encodeURIComponent(ele.noticeUrl);
            //console.log('加密后',url);
            ele.noticeUrl = url;
          }
          that.setData({
            glist:gglist,
            totalNum:data.totalNum
          })
          let pageNo = that.data.pageNo;
          let totalNum = that.data.totalNum;
          let pageSize = that.data.pageSize;
          let loadMore = pageNo * pageSize < totalNum;
          that.setData({loadMore:loadMore})
        }
      }
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
    // console.log('下啦了。。。。');
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    // console.log('上拉了')
    this.loadMore();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  loadMore() {
    let pageNo = this.data.pageNo;
    let totalNum = this.data.totalNum;
    let pageSize = this.data.pageSize;
    let loadMore = this.data.loadMore;
    //this.setData({loadMore:loadMore})
    if(loadMore){
      this.setData({
        pageNo:(pageNo+1),
      })
      this.gonggao();
    }else{
      wx.showToast({
        title: '已经到底了',
        icon:'none'
      })
    }
  }



})