
import req from './utils/networkUtils';
import storage from "./utils/storageUtils";
import dialogUtils from './utils/dialogUtils';
const l = require("./template/loading/loading"),
t = require("./template/toast/toast");
//app.js
App({
  toastComponent: t.toastComponent,
  loading: l.loading,
  onLaunch: function () {
    var that = this;
    wx.getSystemInfo({
      success: function(a) {
        console.log(a)
        var t = a.windowWidth,
          o = a.windowHeight,
          statusBarHeight = a.statusBarHeight;
        that.globalData.windowW = t, that.globalData.windowH = o, that.globalData.statusBarHeight = statusBarHeight;
        that.globalData.platform = a.platform;
        if (a.model.indexOf('X') >= 0) {
          that.globalData.iphoneX = true;
        }
        if(a.model.indexOf('iPhone') >= 0
          && a.model.indexOf('5') >= 0){
            that.globalData.iphone5 = true;
        }
        if (a.model.indexOf('iPhone') >= 0) {
          that.globalData.iphone8 = true;
        }
        if (a.model.indexOf('iPhone') >= 0) {
          that.globalData.isiPhone = true;
        }
        if(a.screenHeight - a.safeArea.height > 40){
          console.log('是全面屏')
          that.globalData.isFullSucreen = true
        }
      }
    });
  },
  onShow(){
    console.log('从新回到小程序页');
    const updateManager = wx.getUpdateManager()

    updateManager.onCheckForUpdate(function (res) {
      // 请求完新版本信息的回调
      console.log("请求完新版本信息的回调",res.hasUpdate)
      if(res.hasUpdate){
        updateManager.onUpdateReady(function () {
          wx.showModal({
            title: '更新提示',
            content: '新版本已经准备好，是否重启应用？',
            showCancel:false,
            success: function (res) {
              if (res.confirm) {
                // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
                updateManager.applyUpdate()
              }
            }
          })
        })

        updateManager.onUpdateFailed(function () {
          // 新版本下载失败
          wx.showModal({
            title:'更新提示',
            content: '网络原因，未为您下载最新版本，有可能会影响您的使用，请退出，重新点击进入，下载最新版本',
            showCancel:false
          })
        })
      }

    })
  },
  onAppHide  () {
    console.log('开始处理退出业务');
    if(app.globalData.needCleanSession != 'N'){
      new storage().cleanSessionId();
    }
  },
  globalData: {
    userInfo: null,
    env:'env',
    iphoneX: false,
    platform:'',
    windowW: 0,
    windowH: 0,
    statusBarHeight:0,
    iphone5:false,
    isiPhone:false,
    isFullSucreen:false
  },
  req:new req(),//初始化请求对象,
  storage:new storage(),//初始化缓存对象
  alert:new dialogUtils() //初始化弹窗对象
})