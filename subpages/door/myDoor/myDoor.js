var app = getApp(),   
acdev = require('../../../model/acdev'),
that = null;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    queryFinish:false,
    showDesc:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.loading(),acdev.acdevinfo.init(), this.showLoading(!0), that = this;
    acdev.acdevinfo.queryAcDevList();
    that.setData({
      paddingBottom:app.globalData.isFullSucreen ? '36' : '0',
      marginBottom: app.globalData.isFullSucreen ? '166' : '130'
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

  },

  checkDetail:function(){
    that.setData({
      showDesc:true
    })
  },

  closeInstru:function(){
    that.setData({
      showDesc:false
    })
  },

  selectDoor:function(e){
    var gate = e.currentTarget.dataset.item;
    var cellGates = that.data.cellGates, gates = that.data.gates;
    for(var index in cellGates){
      cellGates[index].check = false
      if(cellGates[index].acDevId == gate.acDevId){
        cellGates[index].check = true;
      }
    }
    for(var i in gates){
      gates[i].check = false
      if(gates[i].acDevId == gate.acDevId){
        gates[i].check = true;
      }
    }
    that.setData({
      selectDoor:true,
      cellGates:cellGates,
      gates:gates,
      checkGate:gate
    })
  },

  openGate:function(e){
    if(!that.data.checkGate || that.data.checkGate == null){
      wx.showToast({
        title: '请选择您要打开的门禁信息',
        icon:'none',
        duration:2000
      })
      return false;
    }
    var logInfo = app.storage.getLoginInfo();
    var params = {
      usrName:logInfo.nickName,
      acDevId:that.data.checkGate.acDevId
    }
    acdev.acdevinfo.openDoor(params);
  }
})