import Toast from './../../miniprogram_npm/@vant/weapp/dialog/dialog';
const api = require("../../const/api");
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    url:'',
    custId:'',
    wxOpenId:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let custId = options['custId'];
    let wxOpenId = options['wxOpenId'];
    this.setData({
      custId:custId,
      wxOpenId:wxOpenId,
    });
    let that = this;
    app.req.postRequest(api.getWechatUrl,{custId:custId}).then(res=>{
      let data = res.data;
      console.log('获取网页授权地址',data);
      if(data.respCode == '000'){
        that.setData({url:data.url});
      }else{
        Toast.alert({message:'获取网页授权地址失败'});
      }
    })
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

  }
})