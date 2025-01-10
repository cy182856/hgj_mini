const api = require('../../const/api'),
 app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: { 
    loading: false,//是否正在加载
    cardCstBatchId_swim:'',
    cardName_swim:'',
    cardCode_swim:'',
    cardExpNum_swim:'',
    expDate_swim:'',
    cardNo_swin:'',
    card_button_disabled:false
  },

  // 游泳卡信息
  queryCardSwim(){
    this.showLoading(1); 
    var data = {};
    data['cstCode'] = app.storage.getCstCode();
    data['proNum'] = app.storage.getProNum();   
    data['wxOpenId'] = app.storage.getWxOpenId();
    var that = this;
    app.req.postRequest(api.queryCardSwim,data).then(res=>{
        console.log("回调用",res);
        this.showLoading(0);
        if(res.data.respCode == '000'){          
          var cardCstBatchId_swim = res.data.cardCstBatchId;
          var cardName_swim = res.data.cardName;
          var cardCode_swim = res.data.cardCode;
          var cardExpNum_swim = res.data.cardExpNum;
          var expDate_swim = res.data.expDate;
          that.setData({
            cardCstBatchId_swim:cardCstBatchId_swim,
            cardName_swim:cardName_swim,
            cardCode_swim:cardCode_swim,
            cardExpNum_swim:cardExpNum_swim,
            expDate_swim:expDate_swim,
            isRefreshing:false
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

  // 生成二维码
  createCardQrCode:function(){  
    var that = this;
    var cstCode = app.storage.getCstCode();
    var wxOpenId = app.storage.getWxOpenId();
    var proNum = app.storage.getProNum();
    var cardCstBatchId = that.data.cardCstBatchId_swim;
    var data = {
      cardCstBatchId: cardCstBatchId,
      cstCode: cstCode,
      wxOpenId: wxOpenId,
      proNum: proNum
    }
    if(!that.data.card_button_disabled){
      that.setData({ card_button_disabled: true });
      app.req.postRequest(api.createCardQrCode, data).then(function (value) {
        console.log("createCardQrCode 返回", value);
        if(value.data.RESPCODE == "000" && value.data.cardQrCode != null){
          that.setData({ card_button_disabled: false });
          var cardQrCode = value.data.cardQrCode;
          var startExpDate = value.data.startExpDate;
          var endExpDate = value.data.endExpDate;
          var openDoorTotalNum = value.data.openDoorTotalNum;
          var openDoorApplyNum = value.data.openDoorApplyNum;
          var cardNo = value.data.cardNo;
          wx.navigateTo({
            url: '/subpages/card/cardQrCode/cardQrCode?cardQrCode=' + cardQrCode +'&startExpDate=' + startExpDate +'&endExpDate=' + endExpDate +'&openDoorTotalNum=' + openDoorTotalNum +'&openDoorApplyNum=' + openDoorApplyNum + '&cardNo=' + cardNo
          })
        }else{
          that.setData({ card_button_disabled: false });
          wx.showToast({
            icon:'none',
            title: value.data.ERRDESC?value.data.ERRDESC:'失败',
            duration:5000
          })
        }
      }); 
    }    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.loading(),
    this.showLoading(!1)
    this.queryCardSwim()
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
    this.queryCardSwim();
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
      isRefreshing:true
    })
    this.queryCardSwim();
    wx.stopPullDownRefresh({
      success: (res) => {},
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