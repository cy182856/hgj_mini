const api = require('../../../const/api'),
app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    cstCode:'',
    cstName:'',
    cstIntoId:'',
    orgId:'',
    identity:'',
    resNames:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    var that = this;
    var cstIntoId = options.cstIntoId;
    that.setData({
      cstCode: options.cstCode,
      cstName: options.cstName,
      cstIntoId: cstIntoId,
      orgId: options.orgId
    })
    // 获取入住信息
    that.queryIntoInfo(cstIntoId);
  },

  // 获取入住信息
  queryIntoInfo(cstIntoId){
    var data = {
      cstIntoId:cstIntoId
    }
    app.req.postRequest(api.queryIntoInfo,data).then(res=>{
      if(res.data.respCode == '000'){
        this.setData({
          identity:res.data.identity,
          resNames:res.data.resNames
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {
    var path = 'pages/hu/hubind/hubind?cstCode=' + this.data.cstCode + '&cstName=' + this.data.cstName + '&cstIntoId=' + this.data.cstIntoId + '&proNum=' + this.data.orgId;
    return {
        title:'房屋入住邀请',
        path: path
    }
  }
})