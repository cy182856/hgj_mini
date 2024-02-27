var that = null,
app = getApp();
const dateUtil = require('../../utils/dateUtil'),
stringUtil = require('../../utils/stringUtil'),
api = require('../../const/api');
import Dialog from '../../miniprogram_npm/@vant/weapp/dialog/dialog';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showCheckPayMonth:false,
    isIphoneX:false,
    advCfeeMon:6,
    payfee:0,
    payIndex:0,
    paymonths:[
      {num:0,desc:'请选择要缴费的车辆'}
    ],
    payUpDate:'',
    padding_bottom:0,
    isFail:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.loading(),that = this,that.showLoading(!1);
    let userInfo = app.storage.getLoginInfo();
    that.setData({
      isIphoneX:app.globalData.iphoneX,
      userInfo:userInfo,
      advCfeeMon:userInfo.advCfeeMon
    })
    that.queryCarInfos();
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
  checkFeeRecord:function(){
    wx.navigateTo({
      url: './feelog/feelog',
    })
  },
  queryCarInfos:function(){
    that.showLoading(!0);
    app.req.postRequest(api.queryCarInfos, {}).then(function (res) {
      if(res.data && res.data.respCode == '000'){
        if(res.data.data && res.data.data.length >0){
          for(var i in res.data.data){
            res.data.data[i].carNumber = res.data.data[i].carNumber.substr(0,2) + "-***" 
            + res.data.data[i].carNumber.substr(res.data.data[i].carNumber.length - 2,2)
          }
          that.setData({
            carInfos:res.data.data,
            padding_bottom:that.data.isIphoneX ? '176' : '140',
            isFail:false
          })
          that.doCheckCar(res.data.data[0])
        }else{
          that.setData({
            carInfos:new Array(),
            padding_bottom:0,
            isFail:false
          })
        }
      }else{
        wx.showToast({
          title: '获取车辆信息失败,请稍后重试',
          icon:'none',
          duration:2000,
          isFail:true
        })
      }
      that.showLoading(!1)
    })
  },
  bindCheckCar:function(e){
    let carInfo = e.currentTarget.dataset.item;
    that.doCheckCar(carInfo);
  },
  doCheckCar:function(carInfo){
    let carInfos = that.data.carInfos,
    paymonths = new Array();
    var checkCar = false;
    for(var index in carInfos){
      if(carInfo.carSeqId == carInfos[index].carSeqId){
        checkCar = carInfos[index].check ? false : true;
        carInfos[index].check = carInfos[index].check ? false : true;
      }else{
        carInfos[index].check = false
      }
    }
    if(checkCar){
      let currentDate = dateUtil.getCurrentDate("yyyyMMdd");
      let payUpDate = that.data.payUpDate ? that.data.payUpDate : carInfo.payUpDate;
      payUpDate = payUpDate.replace(/-/g, "");
      console.log(dateUtil.getTwoDateDiff(payUpDate, currentDate));
      let days = dateUtil.getTwoDateDiff(payUpDate , currentDate) > 0 ? dateUtil.getTwoDateDiff(payUpDate , currentDate) : 0;
      let advCfeeMon = that.data.advCfeeMon - parseInt(days/30);
      console.log(advCfeeMon)
      paymonths.push({num:0,desc:'请选择'});
      if(carInfo.cfeePayCyc == 'M'){
        for(var i = 0 ;i < advCfeeMon ; i++){
          paymonths.push({num:i + 1, desc: (i + 1) + '个月'})
        }
      }else{
        let quarter = parseInt(advCfeeMon)%3 == 0 ?  parseInt(advCfeeMon)/3 
        : parseInt(parseInt(advCfeeMon)/3) + 1
        for(var i = 0 ;i < quarter; i++){
          paymonths.push({num:i + 1, desc: (i + 1) + '个季度'})
        }
      }
    }else{
      paymonths.push({num:'0',desc:'请选择要缴费的车辆'});
    }
    that.setData({
      carInfos : carInfos,
      paymonths:paymonths,
      payIndex:0,
      carInfo:checkCar? carInfo : {},
      finalPayUpDate:'请选择缴费时长',
      payfee:0
    })
  },
  showPyMonth(){
    if(that.data.paymonths.length == 1){
      return false;
    }
    that.setData({
      showCheckPayMonth:true
    })
  },
  onClose(){
    that.setData({
      showCheckPayMonth:false
    })
  },
  onCancel(){
    that.setData({
      showCheckPayMonth:false
    })
  },
  onConfirm(e){
    console.log(e)
    if(e.detail.index == 0){
      wx.showToast({
        title: '请选择缴费时长',
        icon:'none',
        duration:2000
      })
      return false;
    }
    let carInfo = that.data.carInfo,
    payUpDate = that.data.payUpDate && that.data.payUpDate != '' ? that.data.payUpDate : carInfo.payUpDate;
    payUpDate = payUpDate.replace(/-/g, "");
    let payMonth = e.detail.value.num,
    payUpMonthLength = dateUtil.getMonthLength(payUpDate.substr(0,4), payUpDate.substr(4,2));
    var finalPayUpDate = '';
    if(carInfo.cfeePayCyc == 'Q'){
      payMonth = payMonth * 3
    }
    if(parseInt(payUpDate.substr(6,2)) <= 27){
      finalPayUpDate = dateUtil.convertShortDateToLang(dateUtil.dateStrAddUtils(payUpDate , 'm', parseInt(payMonth)));
    }else{
      finalPayUpDate = dateUtil.dateStrAddUtils(payUpDate.substr(0,6) + "01" , 'm', parseInt(payMonth));
      console.log(finalPayUpDate)
      let finalMonthLenth = dateUtil.getMonthLength(finalPayUpDate.substr(0,4), finalPayUpDate.substr(4,2));
      console.log(finalMonthLenth)
      let days = payUpMonthLength - parseInt(payUpDate.substr(6,2)) < 0? 0 : payUpMonthLength - parseInt(payUpDate.substr(6,2))
      finalPayUpDate = dateUtil.formatDate(new Date(finalPayUpDate.substr(0,4),
        finalPayUpDate.substr(4,2)-1,finalMonthLenth - (days)), 'yyyyMMdd')
      if(parseInt(finalPayUpDate.substr(6,2)) < 28){
        finalPayUpDate = finalPayUpDate.substr(0,6) + '28'
      }
      finalPayUpDate = dateUtil.convertShortDateToLang(finalPayUpDate)
    }
    that.setData({
      payIndex:e.detail.index,
      showCheckPayMonth:false,
      payMonth : payMonth,
      payfee : stringUtil.changeMoney(payMonth * carInfo.monFee + ""),
      finalPayUpDate:finalPayUpDate
    })
  },
  // onCurrentYmChange:function(e){
  //   that.setData({
  //     currentYm:e.detail
  //   })
  // },
  onMaxMonChange:function(e){
    that.setData({
      advCfeeMon:e.detail
    })
  },
  onPayUpDateChange:function(e){
    that.setData({
      payUpDate:e.detail
    })
  },
  bindPayFee:function(){
    if(!that.data.carInfo || Object.keys (that.data.carInfo).length === 0){
      wx.showToast({
        title: '请选择要缴费的车辆',
        icon:'none',
        duration:2000
      })
      return false;
    }
    if(that.data.payfee == 0){
      wx.showToast({
        title: '请选择缴费时长',
        icon:'none',
        duration:2000
      })
      return false;
    }
    Dialog.confirm({
      title: '提示',
      message: '确定要支付吗？',
    }).then(() => {
      that.commitPay();
    })
    .catch(() => {
      console.log('点击取消')
    });
    
  },
  commitPay:function(){
    let openId = app.storage.getHgjOpenId();
    let payUpDate = that.data.payUpDate ? that.data.payUpDate : that.data.carInfo.payUpDate;
    let feeStartDate = dateUtil.dateStrAddUtils(payUpDate,'d',1);
    console.log(feeStartDate)
    // var payParams = {
    //   carSeqId:that.data.carInfo.carSeqId,
    //   carTag : that.data.carInfo.carTag,
    //   payMon:that.data.payMonth,
    //   feeStartDate: feeStartDate,
    //   feeEndDate:that.data.finalPayUpDate.replace(/-/g, ""),
    //   openid:openId,
    //   ordAmt:that.data.payfee
    // };
    var payParams = {
      openid:openId,
      ordAmt:that.data.payfee
    };
    that.showLoading(!0)
    app.req.postRequest(api.cfeePay, payParams).then(function (res) {
      console.log(res)
      if(res.data.RESPCODE != '000'){
        console.log("停车缴费订单唤起失败");
        wx.showToast({
          title: '['+res.data.RESPCODE+']'+res.data.ERRDESC,
          icon:'none',
          duration:2000
        })
        that.showLoading(!1)
        return;
      }
      var payinfo = JSON.parse(res.data.PAYINFO);
      wx.requestPayment({
        'timeStamp': payinfo.timeStamp,
        'nonceStr': payinfo.nonceStr,
        'package': payinfo.package,
        'signType': payinfo.signType,
        'paySign': payinfo.paySign,
        'success':function(ree){
          console.log("success");
          console.log(ree);
          wx.showToast({
            title: '缴费成功，即将跳转订单详情页面...',
            icon:'none',
            duration:2000
          })
          setTimeout(function(){
            wx.navigateTo({
              url: './feedetail/feedetail?ordDate=' + res.data.ORDDATE + "&ordSeqId=" + res.data.ORDSEQID
            })
          },2000)
        },
        'fail':function(res){
          console.log(res);
          if(!res || res.errMsg.indexOf('cancel') == -1){
            wx.showToast({
              title: '缴费失败，请稍后重试',
              icon:'none',
              duration:2000
            })
          }
        },
        'complete':function(res){
          that.showLoading(!1)
        }
      })
    })
  }
})