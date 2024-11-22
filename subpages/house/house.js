const api = require('../../const/api'),
 app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
      checkValue: [], // 用于存储选中的值
      proNum:'',
      proName:app.storage.getProName(),
      list:[],
      cstCode:'',
      proNum:'',
      wxOpenId:'',
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
    app.req.postRequest(api.huList,data).then(res=>{
        console.log("回调用",res);
        if(res.data.respCode == '000'){
          var list = res.data.data.list;
          var ownerFlag = res.data.data.ownerFlag;
          var proNum = res.data.data.proNum;
          app.storage.setProNum(proNum);
          that.setData({
            list:list,
            isRefreshing:false,
            ownerFlag:ownerFlag,
            proNum:proNum
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

  checkboxChange: function(e) {
    var that = this;
    var tenantWxOpenId = e.currentTarget.dataset.datavalue.wxOpenId;
    that.setData({
        checkValue: e.detail.value // 更新选中的值
    });
    console.log("已选中的卡："+that.data.checkValue)
    console.log("租客或员工微信号："+ tenantWxOpenId)

    var data = {};
    data['cstCode'] = app.storage.getCstCode();
    data['wxOpenId'] = app.storage.getWxOpenId();
    data['proNum'] = app.storage.getProNum();   
    data['tenantWxOpenId'] = tenantWxOpenId;
    data['cardIds'] = e.detail.value;
    
    var ownerFlag = that.data.ownerFlag;
    // 只有业主、租户有权限设置，其他身份操作不生效
    if(ownerFlag == 1){
      app.req.postRequest(api.cardPerm,data).then(res=>{
        if(res.data.respCode == '000'){
          that.queryForPage(); 
        }
      }); 
    }
  
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
          app.req.postRequest(api.huOperate,data).then(res=>{
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
          app.req.postRequest(api.huOperate,data).then(res=>{
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
    var tenantWxOpenId = e.currentTarget.dataset.datavalue.wxOpenId;
    var data = {};
    data['cstCode'] = app.storage.getCstCode();
    data['wxOpenId'] = app.storage.getWxOpenId();
    data['proNum'] = app.storage.getProNum();   
    data['id'] = id;
    data['cstIntoHouseId'] = cstIntoHouseId;
    data['tenantWxOpenId'] = tenantWxOpenId;
    data['buttonType'] = 'remove';
    var that = this;
    wx.showModal({
      title: '提示',
      content: '确定移除吗?',
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定');
          app.req.postRequest(api.huOperate,data).then(res=>{
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