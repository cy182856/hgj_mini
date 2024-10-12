const api = require('../../const/api'),
 app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: { 
    loading: false,//是否正在加载
    cardCstId_swim:'',
    cardName_swim:'',
    cardCode_swim:'',
    cardExpNum_swim:'',
    startTime_swim:'',
    endTime_swim:''
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
          var cardCstId_swim = res.data.cardCstId;
          var cardName_swim = res.data.cardName;
          var cardCode_swim = res.data.cardCode;
          var cardExpNum_swim = res.data.cardExpNum;
          var startTime_swim = res.data.startTime;
          var endTime_swim = res.data.endTime;
          that.setData({
            cardCstId_swim:cardCstId_swim,
            cardName_swim:cardName_swim,
            cardCode_swim:cardCode_swim,
            cardExpNum_swim:cardExpNum_swim,
            startTime_swim:startTime_swim,
            endTime_swim:endTime_swim,
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
    var cstCode = app.storage.getCstCode();
    var wxOpenId = app.storage.getWxOpenId();
    var proNum = app.storage.getProNum();
    var cardCstId = this.data.cardCstId_swim;
    var data = {
      cardCstId: cardCstId,
      cstCode: cstCode,
      wxOpenId: wxOpenId,
      proNum: proNum
    }
    app.req.postRequest(api.createCardQrCode, data).then(function (value) {
      console.log("createCardQrCode 返回", value);
      if(value.data.RESPCODE == "000" && value.data.cardQrCode != null){
        var cardQrCode = value.data.cardQrCode;
        var expDate = value.data.expDate;
        var openDoorTotalNum = value.data.openDoorTotalNum;
        var openDoorApplyNum = value.data.openDoorApplyNum;
        wx.navigateTo({
          url: '/subpages/card/cardQrCode/cardQrCode?cardQrCode=' + cardQrCode +'&expDate=' + expDate +'&openDoorTotalNum=' + openDoorTotalNum +'&openDoorApplyNum=' + openDoorApplyNum
        })
      }else{
        wx.showToast({
          icon:'none',
          title: value.data.ERRDESC?value.data.ERRDESC:'失败',
          duration:3000
        })
      }
    }); 
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