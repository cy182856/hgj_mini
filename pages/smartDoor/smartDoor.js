const app = getApp();
const api = require("../../const/api");
import { toBarcode, toQrcode } from '../../utils/codeUtil';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    btnName:'jia-closeeye',
    showCode:'none'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var logInfo = app.storage.getLoginInfo(),that = this;
    app.loading(),this.showLoading(!1)
    if(!logInfo.custId
      || !logInfo.huSeqId){
        wx.showToast({
          icon: "none",
          title: "房屋信息获取失败，请退出重试。",
          duration: 3000
        }),setTimeout(function() {
          wx.navigateBack({})
        },2000);
        return;
      }
      if(logInfo.propType == 'B'){
        wx.setNavigationBarTitle({
          title: '出行码'
        })
      }
    var windowW = app.globalData.windowW;
    that.setData({
      windowW:windowW,
      logInfo:logInfo,
      houseInfo:logInfo.hideAddr,
      titleText:logInfo.propType == 'B' ? '出行码' : '业主码'
    })
    that.createCode()
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
  createCode:function(){
    var that = this;
    var logInfo = that.data.logInfo;
    var queryParams = {
      custId:logInfo.custId,
      huSeqId:logInfo.huSeqId
    };
    this.showLoading(!0)
    app.req.postRequest(api.querySmartCodeInfo, queryParams).then(function (value) {
      console.log("querySmartCodeInfo 返回", value);
      if(!value.data || value.data.RESPCODE != "000"
        || value.data.codeStr == null){
          wx.showToast({
            icon:'none',
            duration:3000,
            title: value.data.ERRDESC ? value.data.ERRDESC : '获取智能开门码失败，请稍后重试。',
            success:function(){
              setTimeout(function(){
                wx.navigateBack({
                  delta: 0,
                })
              },1000)
            }
          })
        }
      // var smartCodeInfo = value.data.smartCodeInfo;
      // toBarcode('barcode', smartCodeInfo.barCode , 600, 100);
      toQrcode('qrcode', value.data.codeStr, 560, 560);
      // const codeStr = visitLogInfo.barCode.slice(0, 4).concat('****').concat(visitLogInfo.barCode.slice(8));
      // const codeStr = smartCodeInfo.barCode;
      // var barCodeStrs = new Array();
      // for(var i = 0;i < codeStr.length; i++){
      //   barCodeStrs.push(codeStr.substr(i,1))
      // }
      that.setData({
          // code:smartCodeInfo.barCode,
          // codeStr:codeStr,
          // barCodeStrs:barCodeStrs,
          houseInfo:that.data.btnName == 'jia-closeeye' ? logInfo.hideAddr : logInfo.completeAddr,
          // smartCodeInfo:smartCodeInfo,
          commanyShortName:logInfo.commanyShortName,
          nickName: logInfo.nickName,
          showCode:'none'
      })
      that.setData({
        showCode:'block'
      })
      that.showLoading(!1)
    }, function (value) {
      that.showLoading(!1)
      console.log("querySmartCodeInfo F ", value);
      wx.showToast({
        icon:'none',
        title: '获取智能开门码失败，请稍后重试。',
        success:function(){
          wx.navigateBack({
            delta: 0,
          })
        }
      })
    }); 
  },
  controlHouseInfo:function(){
    let logInfo = this.data.logInfo;
    if(this.data.btnName == 'jia-closeeye'){
      this.setData({
        btnName:'jia-openeye',
        houseInfo:logInfo.completeAddr
      })
    }else{
      this.setData({
        btnName:'jia-closeeye',
        houseInfo:logInfo.hideAddr
      })
    }
  },
  refreshPassCode:function(){
    var that = this;
    that.setData({
      showCode:'none'
    })
    setTimeout(function(){
      that.setData({
        showCode:'block'
      })
    },300)
  },
  showTip:function(){
    this.setData({
      showTip:true,
      showCode:'none'
    })
  },
  closeTip:function(){
    this.setData({
      showTip:false,
      showCode:'block'
    })
  }
})