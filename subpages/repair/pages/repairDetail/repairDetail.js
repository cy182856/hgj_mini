import Toast from '../../../../miniprogram_npm/@vant/weapp/dialog/dialog';
const 
      api = require('../../../../const/api'),
      app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    active:3,
    steps: [{text: '待处理',},{text: '处理中',},{text: '待付款',},{text: '待评价',},],
    aotosize:{ maxHeight: 110, minHeight: 80 },
    repairDesc:'',
    repairTimeDesc:'',
    repairDate:'',
    repairSeqId:'',
  },

  //新的报事报修
  newjob(event){
    wx.redirectTo({
      url: '../repairApply/repairApply?source='+1,
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.loading(),this.showLoading(1);
    var that = this;
    app.req.postRequest(api.repairQuery,options).then(value=>{
        console.log('详情概览页：',value);
        that.showLoading(0);
        if(value.data.respCode == '000'){
            var datas = value.data.repairDtos[0];
            var repairType = datas.repairType;
            var ordAmt = datas.ordAmt;
            var procStat = datas.procStat;
            var repairDesc = datas.repairDesc;
            var repairTimeDesc = datas.repairTimeDesc;
            var active;
            // if(procStat == '01'){
            //   active = 0;
            // }else if(procStat == '09'){
            //   active=2;
            // }else if(procStat == '11'){
            //   active = 3;
            // }else{
            //   active = 1;
            // }
            that.step(procStat,repairType,ordAmt);
            that.setData({
              repairDesc:repairDesc,
              repairTimeDesc:repairTimeDesc,
              active:active,
              repairDate:options['repairDate'],
              repairSeqId:options['repairSeqId'],
            })
          
        }else{
          var desc = value.data.errDesc;
          if(!desc){
            desc = '网络异常,请稍后再试'
          }
          app.alert.alert(desc);
          
        }
    });
  },
  //订单进度
  //01 待接单 待维修 待付款 待评价
  //03 已接单 维修中 待付款 待评价
  //05 已接单 维修中 待付款 待评价
  //07 已接单 维修完成 待付款 待评价
  //09 已接单 维修完成 已付款/已确认 待评价
  //11 已接单 维修完成 已付款/已确认 已评价
  step(procStat,repairType,ordAmt){
    var step3 = '已确认';
    if(ordAmt > 0){
      step3 = '已付款';
    }
    if(repairType == 'S'){
      if(procStat == '01'){
        this.setData({
          steps:[{text: '待接单',},{text: '待维修',},{text: '待付款',},{text: '待评价',},],
          active:0
        })
      }else if(procStat == '03'){
        this.setData({
          steps:[{text: '已接单',},{text: '维修中',},{text: '待付款',},{text: '待评价',},],
          active:0
        })
      }else if(procStat == '05'){
        this.setData({
          steps:[{text: '已接单',},{text: '维修中',},{text: '待付款',},{text: '待评价',},],
          active:1
        })
      }else if(procStat == '07'){
        this.setData({
          steps:[{text: '已接单',},{text: '维修完成',},{text: '待付款',},{text: '待评价',},],
          active:1
        })
      }else if(procStat == '09'){
        this.setData({
          steps:[{text: '已接单',},{text: '维修完成',},{text: step3,},{text: '待评价',},],
          active:2
        })
      }else if(procStat == '11'){
        this.setData({
          steps:[{text: '已接单',},{text: '维修完成',},{text: step3,},{text: '已评价',},],
          active:3
        })
      }
    }else{
      if(procStat == '01'){
        this.setData({
          steps:[{text: '待接单',},{text: '待维修',},{text: '待评价',},],
          active:0
        })
      }else if(procStat == '03'){
        this.setData({
          steps:[{text: '已接单',},{text: '维修中',},{text: '待评价',},],
          active:0
        })
      }else if(procStat == '05'){
        this.setData({
          steps:[{text: '已接单',},{text: '维修中',},{text: '待评价',},],
          active:1
        })
      }else if(procStat == '07'){
        this.setData({
          steps:[{text: '已接单',},{text: '维修完成',},{text: '待评价',},],
          active:1
        })
      }else if(procStat == '09'){
        this.setData({
          steps:[{text: '已接单',},{text: '维修完成',},{text: '待评价',},],
          active:1
        })
      }else if(procStat == '11'){
        this.setData({
          steps:[{text: '已接单',},{text: '维修完成',},{text: '已评价',},],
          active:2
        })
      }
    }
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