const apiUtil = require('../../const/api.js')
const strUtil = require('../../utils/stringUtil.js')
const dateUtil = require('../../utils/dateUtil.js')
const app = getApp();
const apptInfo = require('./apptInfo.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    'APPTORDLOGDTOS':[],

    'isLoading': true,
    'TOTALCOUNT': 0 ,
    'CURRENTCOUNT': 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.loading(), this.showLoading(!1);
    this.PAGENUM='1';
    this.PAGESIZE='5';
    this.requestApptOrdInfos();
    this.CURRENTCOUNT=0;
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
    this.queryMore();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  requestApptOrdInfos: function(){
    this.showLoading(!0);
    var data = {
      'custId': app.storage.getLoginInfo().custId,
      'ordBeginDate': dateUtil.getDaysAgo(60,2),
      'ordEndDate': dateUtil.getCurrentDate('yyyyMMdd'),
      'huSeqId': app.storage.getLoginInfo().huSeqId,
      'pageNum': this.PAGENUM,
      'pageSize': this.PAGESIZE
    };
    // var data = {
    //   'custId': '6000000013',
    //   'ordBeginDate': dateUtil.getDaysAgo(60, 2),
    //   'ordEndDate': dateUtil.getCurrentDate('yyyyMMdd'),
    //   'huSeqId': '10000032',
    //   'pageNum': this.PAGENUM,
    //   'pageSize': this.PAGESIZE
    // };
    var that = this;
    var res = app.req.postRequest(apiUtil.queryApptOrdLog,data).then(function (res) {
      console.log("返回结果:" + JSON.stringify(res.data));
      if (res.data.RESPCODE == '000') {  
        for(let i=0;i<res.data.APPTORDLOGDTOS.length;i++){
          var APPTORDDTLS=res.data.APPTORDLOGDTOS[i].APPTORDDTLDTOS;
          for(let k=0;k<APPTORDDTLS.length;k++){
            let apptDateDesc=APPTORDDTLS[k].APPTDATEDESC;
            APPTORDDTLS[k].APPTDATEDAY=apptDateDesc.substring(5);
          }
        }
        let apptOrdLogDtos=that.data.APPTORDLOGDTOS.concat(res.data.APPTORDLOGDTOS);
        that.apptOrdLogDtos=apptOrdLogDtos;
        that.setData({ 'APPTORDLOGDTOS': apptOrdLogDtos, 'isLoading': false, 'CURRENTCOUNT': apptOrdLogDtos.length, 'TOTALCOUNT': res.data.TOTALRECORD});
        that.countDown();
      } else {
        //接口返回错误
        wx.showToast({
          title: res.data.ERRDESC + '[' + res.data.RESPCODE + ']',
          icon: 'none'
        })
      }
      that.showLoading(!1);
    });
  },// 倒计时
  countDown: function () {
    var that = this;
    var timer = setInterval(function () {
      var countCnt=0;
      let sumCnt=0;
      for (var i = 0; i < that.apptOrdLogDtos.length; i++) {
        if (that.apptOrdLogDtos[i].STAT=='I'){
          sumCnt = sumCnt+1;
          if (that.apptOrdLogDtos[i].downTime==0){
            countCnt = countCnt+1;
            continue;
          }
        }else{
          continue;
        }
        let lastPayTime = that.apptOrdLogDtos[i].LASTPAYTIME;
        var date = new Date(); 
        date.setFullYear(lastPayTime.substring(0,4));
        let month = lastPayTime.substring(4, 6);
        date.setMonth((parseInt(month)-1));
        date.setDate(parseInt(lastPayTime.substring(6,8)));
        date.setHours(parseInt(lastPayTime.substring(8, 10)));
        date.setMinutes(parseInt(lastPayTime.substring(10, 12)));
        date.setSeconds(parseInt(lastPayTime.substring(12)));

        let time = (date.getTime() - new Date().getTime()) / 1000;//距离结束的毫秒数
        if(time <=0){
          that.apptOrdLogDtos[i].downTime=0;
        }else{
          //生成分和秒
          let minute=parseInt(time/60);
          let second=parseInt(time-minute*60);
          let downTime = minute + "' " + second + '"';
          that.apptOrdLogDtos[i].downTime = downTime;
          countCnt=0;
        }
        that.setData({ 'APPTORDLOGDTOS': that.apptOrdLogDtos });
      }
      if (countCnt == sumCnt){
        clearInterval(timer);
      }
    },1000)
  },
  doOrdProcess:function(event){
    let ordDate = event.currentTarget.dataset.orddate;
    let ordSeqId = event.currentTarget.dataset.ordseqid;
    let operType=event.currentTarget.dataset.opertype;

    if (operType=='cancel'){
      var data = {
        'ordDate': ordDate,
        'ordSeqId': ordSeqId,
        'stat': apptInfo.handCancel
      }
      var that = this;
      wx.showModal({
        title: '操作提示',
        content: '确定取消预约订单吗?',
        showCancel: true,
        success(res) {
          if (res.confirm) {
            var res = app.req.postRequest(apiUtil.updApptOrdLog,data).then(function (res) {
              console.log("返回结果:" + JSON.stringify(res.data));
              if (res.data.RESPCODE == '000') {
                that.setData({ 'APPTORDLOGDTOS': [] ,'isLoading': true,'CURRENTCOUNT':0,'TOTALCOUNT':0});
                that.apptOrdLogDtos=[];
                wx.redirectTo({
                  url: '/subpages/appt/mine_appt'
                })
              } else {
                //接口返回错误
                wx.showModal({
                  title: '操作提示',
                  content: res.data.ERRDESC,
                  showCancel: false,
                  success(res) {
                    if (res.confirm) {
                    }
                  }
                })
              }
            });
          }
        }
      })
    }else if(operType=='pay'){
      wx.navigateTo({
        url: '/subpages/appt/apptOrd_Detail?ordDate=' + ordDate + '&ordSeqId=' + ordSeqId
      })
    }else if(operType=='refund'){
      wx.navigateTo({
        url: '/subpages/appt/apptOrd_refund?ordDate=' + ordDate + '&ordSeqId=' + ordSeqId
      })
    }
  },
  queryMore(retData, existData) {
    if(this.data.CURRENTCOUNT==this.data.TOTALCOUNT){
      return;
    }else{
      this.PAGENUM = parseInt(this.PAGENUM) + 1;
      this.setData({ 'isLoading': true });
      this.requestApptOrdInfos();
    }
  },

})