//queryQnInfo.js
var app = getApp();
const apiConstant = require('../../../const/api.js');

Page({
  data:{
    webviewSrc:''
	},
	
  //生命周期函数--监听页面加载
  onLoad: function (options) {
	  app.loading();
    this.showLoading(false);
  },

  fillInQn() {
    // var cstCode = app.storage.getCstCode();
     wx.navigateToMiniProgram({
       appId: 'wx34b0738d0eef5f78',
       path: 'pages/forms/publish?token=OLy33f',     
       envVersion: 'release',
       success(res) {
         console.log("打开成功")
       }
     })
   },

   toWebViewUrl() {
     this.setData({
      webviewSrc:'https://mp.weixin.qq.com/s?__biz=MzI0MTAzNTAwOQ==&mid=2247484106&idx=1&sn=01f31ce0cd058fca633a4a648a7d873a&chksm=e910f0a4de6779b2e5420c0fe3f9511924b0c210b8e25dbadf34d512e71852fe7ff17e3a36c6#rd'
     })
   },
 

})