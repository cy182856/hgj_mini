var app = getApp(),
api = require('../../../const/api'),
u = require('../../../utils/util'),
heo = require('../../../model/heoinfo');
import Dialog from '../../../miniprogram_npm/@vant/weapp/dialog/dialog';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    type:'',
    queryType:'',
    isRefreshing:!1,
    hasMoreData:!1,
    isLoadingMoreData:!1,
    pageNum:1,
    pageSize:5,
    heoInfos:[],
    isTopHeoInfos:[],
    showStat:true,
    iphoneX:app.globalData.iphoneX,
    showHeoTypeClass:false,
    canRelease:false,
    emptyMsg:'',
    showClose:true,
    x:'650rpx',
    y:'780rpx',
    queryFinish:false,
    ownerHeoThemes:[{theme:'S',themeDesc:'分享'},
        {theme:'P',themeDesc:'表扬'},
        {theme:'E',themeDesc:'曝光'},
        {theme:'N',themeDesc:'求助'},
        {theme:'G',themeDesc:'帮助'}],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.loading(),heo.heoinfo.init(), this.showLoading(!0);
    let loginData = app.storage.getLoginInfo();
    this.setData({
      heoInfos:new Array(),
      pageNum:1,
      type:options.type,
      windowH : app.globalData.windowH - 50,
      queryFinish:false,
      huStat:loginData && loginData.huStat ? loginData.huStat : '',
      huSeqId : loginData && loginData.huSeqId ? loginData.huSeqId : '',
      loginErrDesc : loginData && loginData.loginErrDesc ? loginData.loginErrDesc : ''
    })
    if(options.type == 'release'){
      this.setData({
        queryType:'R',
        active: "0",
        emptyMsg:'您还没有发布任何信息'
      })
      heo.heoinfo.queryHeoInfos();
      heo.heoinfo.initOwnerHeoTypes();
    }else if(options.type == "partic"){
      wx.setNavigationBarTitle({
        title: '我的参与',
        heoInfos:new Array()
      })
      this.setData({
        queryType:'P',
        emptyMsg:'您还没有参与任何信息'
      })
      heo.heoinfo.queryHeoInfos();
    }
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
    heo.heoinfo.init()
    console.log('oShow')
    if(this.data.needRefresh){
      if(this.data.active =="0"){
        this.setData({
          queryType:'R',
          heoInfos:new Array(),
          pageNum:1,
          active: "0",
          emptyMsg:'您还没有发布任何信息'
        })
        heo.heoinfo.queryHeoInfos();
      }else{
        this.setData({
          active: "0"
        })
      }
    }
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
    let pages = getCurrentPages(); 
    let prePage = pages[pages.length - 2]; 
    prePage.onPullDownRefresh();
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.setData({
      isRefreshing:true,
      pageNum:1,
      isLoadingMoreData: false,
      hasMoreData:true,
      queryFinish:false
    })
    heo.heoinfo.queryHeoInfos();
    wx.stopPullDownRefresh();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (this.data.isRefreshing || this.data.isLoadingMoreData || !this.data.hasMoreData) {
      return;
    }
    this.setData({
      isLoadingMoreData: true
      ,pageNum:this.data.pageNum +1
    })
    heo.heoinfo.queryHeoInfos();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  onChange(event) {
    console.log('onChange')
    if(event.detail.name == '0'){
      this.setData({
        pageNum:1,
        heoInfos:new Array(),
        queryType:'R',
        active:event.detail.name,
        emptyMsg:'您还没有发布任何信息',
        queryFinish:false
      })
      heo.heoinfo.queryHeoInfos()
    }else{
      this.setData({
        pageNum:1,
        heoInfos:new Array(),
        queryType:'P',
        active:event.detail.name,
        emptyMsg:'您还没有参与任何信息',
        queryFinish:false
      })
      heo.heoinfo.queryHeoInfos()
    }
  },
  onLoadMore:function(){
    this.setData({
      pageNum:this.data.pageNum + 1
    })
    heo.heoinfo.queryHeoInfos()
  },
  previewImage: function(e){
    wx.previewImage({
        current: e.currentTarget.dataset.id,
        urls:e.currentTarget.dataset.item
    })
  },
  chekHeoInfoDetail:function(e){
    var heoInfo = e.currentTarget.dataset.item;
    console.log(heoInfo)
    wx.navigateTo({
      url: '/subpages/heo/heodetail/heodetail?heoDate=' + heoInfo.heoDate + "&heoSeqId=" + heoInfo.heoSeqId 
      + "&queryType=" + this.data.queryType
    })
  },
  release:function(e){
    if(!this.data.canRelease){
      wx.showToast({
        title: '您暂无发帖权限',
        icon:'none',
        duration:3000
      })
      return false;
    }

    if(!this.data.huStat || this.data.huStat != 'N'){
      wx.showToast({
        title: this.data.loginErrDesc ? this.data.loginErrDesc : '您当前房屋还未绑定，暂时不能发贴。',
        icon:'none',
        duration:3000
      })
      return false;
    }
    this.setData({
      showHeoTypeClass:!this.data.showHeoTypeClass
    })
  },
  closeCheckHeoType:function(){
    this.setData({
      showHeoTypeClass:!1
    })
  },
  closeHeoInfo:function(e){
    Dialog.confirm({
      title: '提示',
      message: '确定要关闭该帖子么？',
    }).then(() => {
      var heoInfo = e.currentTarget.dataset.heoinfo;
      console.log(heoInfo)
      console.log(heoInfo)
      var updHeoInfo = {};
      updHeoInfo.stat = 'C'
      updHeoInfo.heoDate = heoInfo.heoDate
      updHeoInfo.heoSeqId = heoInfo.heoSeqId
      console.log(updHeoInfo)
      heo.heoinfo.updateHeoInfo(updHeoInfo)
      })
      .catch(() => {
        console.log('点击取消')
      });
  },
  moveEnd:function(e){
    var xNumLeft = 20 / 750 * app.globalData.windowW;
  	var xNumRight = 650 / 750 * app.globalData.windowW;
  	var x = e.changedTouches[0].pageX;
    var average = 375 / 750 * app.globalData.windowW;
  	var yNum = e.changedTouches[0].clientY - 25;
  	if (x < average) {
  		this.setData({
  			x: xNumLeft,
			  y: yNum < 55 ? 55 : yNum
  		})
  	} else {
  		this.setData({
  			x: xNumRight,
		  	y: yNum < 55 ? 55 : yNum
  		})
    }
  },
  refreshHeoInfos:function(heoInfo){
    var heoInfos = this.data.heoInfos;
    for(var index in heoInfos){
      if(heoInfo.heoDate == heoInfos[index].heoDate
        && heoInfo.heoSeqId == heoInfos[index].heoSeqId){
          heoInfos[index].stat = heoInfo.stat
          heoInfos[index].notReadMsgCount = 0
          heoInfos[index].takePartInPraise = heoInfo.takePartInPraise
          heoInfos[index].praiseCnt = heoInfo.praiseCnt
        }
    }
    this.setData({
      heoInfos:heoInfos
    })
  },
  praiseHeo:function(e){
    console.log(e)
    let that = this;
    let heoInfo = e.currentTarget.dataset.item;
    if(that.data.huSeqId == heoInfo.usrSeqId){
      wx.showToast({
        title: '不能给自己发布的贴子点赞',
        icon:'none',
        duration:3000
      })
      return false;
    }
    let heoInfos = that.data.heoInfos;
    app.req.postRequest(api.doHeoPraise, {heoDate:heoInfo.heoDate,heoSeqId:heoInfo.heoSeqId, houseSeqId:heoInfo.houseSeqId}).then(function (res) {
      if(res.data && res.data.RESPCODE == '000'){
        for(var index in heoInfos){
          if(heoInfos[index].heoDate == heoInfo.heoDate &&
            heoInfos[index].heoSeqId == heoInfo.heoSeqId){
              heoInfos[index].takePartInPraise = heoInfos[index].takePartInPraise == 'Y' ? 'N' : 'Y';;
              heoInfos[index].praiseCnt = heoInfos[index].takePartInPraise == 'Y' ? parseInt(heoInfos[index].praiseCnt) + 1 : parseInt(heoInfos[index].praiseCnt) - 1 
              break;
            }
        }
        that.setData({
          heoInfos:heoInfos
        })
      }else{
        wx.showToast({
          title: '网络异常，请稍后重试',
          icon:'none',
          duration:3000
        })
      }
    })
  }
})