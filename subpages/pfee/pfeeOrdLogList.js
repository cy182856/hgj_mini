// pages/pfee/pfeeOrdLogList.js
import Toast from '../../miniprogram_npm/@vant/weapp/toast/toast';
const app = getApp();
const api = require('../../const/api');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    payFlag: '',
    pageNum: 1,
    totalNum: 0,
    pageSize: 5,
    nextPage: true,
    pfeeOrdLogVos: "",
    bottomText: "点击/下拉加载更多"
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.loading();
    //查询我的物业订单
    this.setData({pageNum:1, payFlag:''});
    let pageNum = this.data.pageNum;
    let condition = {pageNum: pageNum};
    this.showLoading(true);
    app.req.postRequest(api.queryPfeeOrdLog, condition).then(value => {
      this.showLoading(false);
      if(value.data.respCode != '000'){
        console.log("查询物业缴费订单失败");
        return;
      }
      let pfeeOrdLogVos = value.data.pfeeOrdLogVos;
      let totalNum =  value.data.totalNum;
      let pageSize = value.data.pageSize;
      
      console.log(pfeeOrdLogVos);
      this.setData({
        pfeeOrdLogVos: pfeeOrdLogVos,
        pageNum: pageNum,
        totalNum: totalNum,
        pageSize: pageSize
      });
    });
    
  },

  toDtl: function(ele){
    let ordDate = ele.currentTarget.dataset.orddate;
    let ordSeqId = ele.currentTarget.dataset.ordseqid;
    wx.navigateTo({
      url: 'pfeeOrdDtlList?ordDate='+ordDate+'&ordSeqId='+ordSeqId
    })
  },

  //取消订单
  cancel: function(ele){
    let ordDate = ele.currentTarget.dataset.orddate;
    let ordSeqId = ele.currentTarget.dataset.ordseqid;
    console.log("ordDate="+ordDate+", ordSeqId="+ordSeqId);
    this.showLoading(true);
    let condition = {ordDate: ordDate, ordSeqId: ordSeqId};
    app.req.postRequest(api.closePfeeOrdLog, condition).then(value => {
      this.showLoading(false);
      console.log(value.data);
      if(value.data.respCode != '000'){
        Toast('['+value.data.respCode+']'+value.data.errDesc());
        return;
      }
      Toast("取消成功");
      var index = ele.currentTarget.dataset.index;
      let pfeeOrdLogVos = this.data.pfeeOrdLogVos;
      pfeeOrdLogVos[index].stat='C';
      this.setData({
        pfeeOrdLogVos: pfeeOrdLogVos
      });
    });
  },

  //支付
  pay: function(ele){
    this.showLoading(true);
    let ordDate = ele.currentTarget.dataset.orddate;
    let ordSeqId = ele.currentTarget.dataset.ordseqid;
    console.log("ordDate="+ordDate+", ordSeqId="+ordSeqId);
    let loginInfo = app.storage.getLoginInfo();
    let condition = {
      custId : loginInfo.custId,
      huSeqId : loginInfo.huSeqId,
      houseSeqId : loginInfo.houseSeqId,
      openid : loginInfo.hgjOpenId,
      busiId : '02',
      ordDate : ordDate,
      ordSeqId : ordSeqId
    };
    let that = this;
    app.req.postRequest(api.minProgramPayUrl, condition).then(value => {
      this.showLoading(false);
      console.log(value.data);
      if(value.data.RESPCODE != '000'){
        console.log("物业订单开始唤起失败");
        Toast('['+value.data.RESPCODE+']'+value.data.ERRDESC);
        return;
      }
      var payinfo = JSON.parse(value.data.PAYINFO);
      console.log(payinfo);
      
      wx.requestPayment({
        'timeStamp': payinfo.timeStamp,
        'nonceStr': payinfo.nonceStr,
        'package': payinfo.package,
        'signType': payinfo.signType,
        'paySign': payinfo.paySign,
        'success':function(res){
          console.log("success");
          Toast('支付成功');
          that.reloadQueryPfeeOrdLog();
        },
        'fail':function(res){
          console.log("fail");
          Toast('支付失败,请稍后重试');
        },
        'complete':function(res){
          console.log("complete");
          that.reloadQueryPfeeOrdLog();
        }
      })
      Toast.clear();
    });
  },

  reloadQueryPfeeOrdLog: function(){
    //查询我的物业订单
    let pageNum = 1;
    let condition = {pageNum: pageNum};
    this.showLoading(true);
    app.req.postRequest(api.queryPfeeOrdLog, condition).then(value => {
      this.showLoading(false);
      if(value.data.respCode != '000'){
        console.log("查询物业缴费订单失败");
        return;
      }
      let pfeeOrdLogVos = value.data.pfeeOrdLogVos;
      let totalNum =  value.data.totalNum;
      let pageSize = value.data.pageSize;
      
      console.log(pfeeOrdLogVos);
      this.setData({
        pfeeOrdLogVos: pfeeOrdLogVos,
        pageNum: pageNum,
        totalNum: totalNum,
        pageSize: pageSize
      });
    });
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
    let payFlag = this.data.payFlag;
    console.log('payFlag='+payFlag);
    if(payFlag == 'Y'){
      this.onLoad();
    }
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
    console.log(222222);
    
  },

  toNextPage: function(){
    //查询我的物业订单
    let pageNum = this.data.pageNum;
    pageNum++;
    let pageSize = this.data.pageSize;
    let totalNum = this.data.totalNum;
    if(!hasNextPage(pageNum, pageSize, totalNum)){
      this.setData({
        bottomText: "已到最底"
      });
      return;
    }

    let condition = {pageNum: pageNum};
    this.showLoading(true);
    app.req.postRequest(api.queryPfeeOrdLog, condition).then(value => {
      this.showLoading(false);
      if(value.data.respCode != '000'){
        console.log("查询物业缴费订单失败");
        return;
      }
      let pfeeOrdLogVosTmp = value.data.pfeeOrdLogVos;
      let pfeeOrdLogVosCurr = this.data.pfeeOrdLogVos;
      let pfeeOrdLogVos = pfeeOrdLogVosCurr.concat(pfeeOrdLogVosTmp);
      console.log(pfeeOrdLogVos);
      this.setData({
        pfeeOrdLogVos: pfeeOrdLogVos,
        pageNum: pageNum,
        totalNum: totalNum,
        pageSize: pageSize
      });
    });
  },

  scrolltolower:function(){
    this.onReachBottom();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    console.log("页面上拉触底事件的处理函数");
    this.toNextPage();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})

function hasNextPage(pageNum, pageSize, totalNum){
  let maxPageNum = totalNum/pageSize+1;
  return maxPageNum > pageNum;
}