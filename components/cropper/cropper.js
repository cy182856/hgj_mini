import WeCropper from './we-cropper';
const device = wx.getSystemInfoSync() // 获取设备信息
const width = device.windowWidth // 示例为一个与屏幕等宽的正方形裁剪框
const height = device.windowHeight-120
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cropperOpt: {
      id: 'cropper', // 用于手势操作的canvas组件标识符
      targetId: 'targetCropper', // 用于用于生成截图的canvas组件标识符
      pixelRatio: device.pixelRatio, // 传入设备像素比
      width,  // 画布宽度
      height, // 画布高度
      scale: 2, // 最大缩放倍数
      zoom: 10, // 缩放系数
      cut:{
        x:10,
        y:(height-(450/800)*(width-20))/2,
        width: width-20, // 裁剪框宽度
        height: (450/800)*(width-20) // 裁剪框高度
      }
    },
    isFullSucreen : app.globalData.isFullSucreen
  },
  touchStart (e) {
    this.cropper.touchStart(e)
  },
  touchMove (e) {
    this.cropper.touchMove(e)
  },
  touchEnd (e) {
    this.cropper.touchEnd(e)
  },
  getCropperImage () {
    this.cropper.getCropperImage()
      .then((src) => {
        var pages = getCurrentPages();
        var prevPage = pages[pages.length - 2];  // 上一个页面
        //调用上一个页面初始图片信息
        prevPage.initUpImg(src)
        wx.navigateBack({
          delta: 1 //想要返回的层级
        })
      })
      .catch((err) => {
        wx.showModal({
          title: '上传图片失败',
          content: err.message,
          duration:3000
        })
        setTimeout(function(){
          wx.navigateBack({
            delta: 1 //想要返回的层级
          })
        },3000)
      })
  },
  croperCancel () {
    wx.navigateBack({
      delta: 1 //想要返回的层级
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let updData=JSON.parse(options.data);
    this.setData({cropperOpt:this.data.cropperOpt});
    const { cropperOpt } = this.data
    if(updData.width
      && updData.height
      && updData.y){
        cropperOpt.cut.width = updData.width,
        cropperOpt.cut.height = updData.height
        cropperOpt.cut.y = updData.y
      }
    this.cropper = new WeCropper(cropperOpt)
        .on('ready', (ctx) => {
            console.log(`wecropper is ready for work!`)
        })
        .on('beforeImageLoad', (ctx) => {
            wx.showToast({
                title: '上传中',
                icon: 'loading',
                duration: 20000
            })
        })
        .on('imageLoad', (ctx) => {
            wx.hideToast()
        })
    this.cropper.pushOrign(updData.img)

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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  
})