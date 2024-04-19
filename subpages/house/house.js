const api = require('../../const/api'),
 app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
      refreshIfNeeded: false,
      list:[],
      pageNum:1,
      pageSize:5,
      pages:10,
      totalNum:1,
      obj:null,
      cstCode:'',
      proNum:'',
      wxOpenId:'',
      // navList: ['未缴费', '已缴费'],
      nav_type: 0,
      payment_button_disabled:false,
      checkedAll: '',
      checkIds:[],
      totalAmount:0,
      ownerFlag:0
  },

  queryForPage(){
    var data = {};
    data['cstCode'] = app.storage.getCstCode();
    data['wxOpenId'] = app.storage.getWxOpenId();
    var that = this;
    app.req.postRequest(api.repairHouseList,data).then(res=>{
        console.log("回调用",res);
        if(res.data.respCode == '000'){
          var list = res.data.data.list;
          var ownerFlag = res.data.data.ownerFlag;
          that.setData({
            list:list,
            isRefreshing:false,
            ownerFlag:ownerFlag
          });
        }else{
          var desc = res.data.errDesc;
          if(!desc){
            desc = '网络异常，请稍后再试';
          }
          app.alert.alert(desc);
        }
    });
  },

  agree(e){
    var id = e.currentTarget.dataset.datavalue.id;
    var cstIntoHouseId = e.currentTarget.dataset.datavalue.cstIntoHouseId;
    var data = {};
    data['cstCode'] = app.storage.getCstCode();
    data['wxOpenId'] = app.storage.getWxOpenId();
    data['proNum'] = app.storage.getProNum();   
    data['id'] = id;
    data['cstIntoHouseId'] = cstIntoHouseId;
    data['buttonType'] = 'agree';
    var that = this;
    wx.showModal({
      title: '提示',
      content: '确定同意吗?',
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定');
          app.req.postRequest(api.cohabitOperate,data).then(res=>{
            console.log("同意入住返回",res);
            if(res.data.respCode == '000'){
              that.queryForPage(); 
            }else{
              var code = res.data.errCode;
              var desc = res.data.errDesc;
              app.alert.alert(code + ":" + desc);
            }
          }); 
        } else if (res.cancel) {
          console.log('用户点击取消');
        }
      }
    });  
  },

  refuse(e){
    var id = e.currentTarget.dataset.datavalue.id;
    var cstIntoHouseId = e.currentTarget.dataset.datavalue.cstIntoHouseId;
    var data = {};
    data['cstCode'] = app.storage.getCstCode();
    data['wxOpenId'] = app.storage.getWxOpenId();
    data['proNum'] = app.storage.getProNum();   
    data['id'] = id;
    data['cstIntoHouseId'] = cstIntoHouseId;
    data['buttonType'] = 'refuse';
    var that = this;
    wx.showModal({
      title: '提示',
      content: '确定拒绝吗?',
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定');
          app.req.postRequest(api.cohabitOperate,data).then(res=>{
            console.log("拒绝入住返回",res);
            if(res.data.respCode == '000'){
              that.queryForPage(); 
            }else{
              var code = res.data.errCode;
              var desc = res.data.errDesc;
              app.alert.alert(code + ":" + desc);
            }
          }); 
        } else if (res.cancel) {
          console.log('用户点击取消');
        }
      }
    });  
  },

  remove(e){
    var id = e.currentTarget.dataset.datavalue.id;
    var cstIntoHouseId = e.currentTarget.dataset.datavalue.cstIntoHouseId;
    var data = {};
    data['cstCode'] = app.storage.getCstCode();
    data['wxOpenId'] = app.storage.getWxOpenId();
    data['proNum'] = app.storage.getProNum();   
    data['id'] = id;
    data['cstIntoHouseId'] = cstIntoHouseId;
    data['buttonType'] = 'remove';
    var that = this;
    wx.showModal({
      title: '提示',
      content: '确定移除吗?',
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定');
          app.req.postRequest(api.cohabitOperate,data).then(res=>{
            console.log("移除入住返回",res);
            if(res.data.respCode == '000'){
              that.queryForPage(); 
            }else{
              var code = res.data.errCode;
              var desc = res.data.errDesc;
              app.alert.alert(code + ":" + desc);
            }
          }); 
        } else if (res.cancel) {
          console.log('用户点击取消');
        }
      }
    });  
  },

  costDetail: function (event) {
   
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.queryForPage();
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
      loading:false,
      isRefreshing:true,
      list:new Array()
    })
    this.queryForPage()
    wx.stopPullDownRefresh({
    })
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