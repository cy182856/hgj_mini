const app = getApp();
const isIphone = app.globalData.isiPhone;
const apiUtil = require('../../const/api.js');
const dateUtil = require('../../utils/dateUtil.js');
import Toast from '../../miniprogram_npm/@vant/weapp/toast/toast';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    'bgColor':'#FFF',
    'isLoading':true,

    'chooseTimeWidth':'400rpx',
    'ordQueryDesc':'请选择',
    'iconName':'jia-zhankai',
    'isShowCondition':false,
    'choosed_transType':'',

    'transTypes':[
      { text: '请选择交易类型', value: '' },
      { text: '线上充值', value: '1302' },
      { text: '线上充值退款', value: '2302' },
      { text: '充电桩订单付款', value: '2501' },
      { text: '线下退款', value: '2801' },
    ],

    'curYear': new Date().getFullYear(),
    'curMonth': new Date().getMonth() + 1,
    'today': new Date().getDate(),
    'prev': !0,
    'next': !0,
    'header': true,
    'week_title': true,
    'title_type': 'cn',
    'cellSize': 100,
    'more': !1,
    'style': [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.loading();this.showLoading(!1);
    this.PAGENUM=1;
    this.PAGESIZE=8;
    this.beginAcctDate=dateUtil.getDaysAgo(30,2);
    this.endAcctDate=dateUtil.getCurrentDate("yyyyMMdd");
    this.transType='';
    let dateShowDesc=dateUtil.getDaysAgo(30,3) + '~' + dateUtil.getCurrentDate("yyyy-MM-dd");

    let cInnerText=new Array();
    cInnerText[0]='';
    cInnerText[1]=dateShowDesc;
    this.innerText=cInnerText;
    this.showText();

    this.setData({
      selStartDate:dateUtil.getDaysAgo(180,2),
      selEndDate:dateUtil.getCurrentDate("yyyyMMdd"),
      'CHOOSED_TIME_AREA':dateShowDesc,
    })
    let iphone = app.globalData.iphone;
    if (iphone) {
      this.setData({
        btuBottom: '68rpx',
      })
    }
    this.queryAcctOrder();
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
  showCondition:function(){
    if(this.data.isShowCondition){
      this.setData({'isShowCondition':!this.data.isShowCondition,'iconName':"jia-zhankai"});
    }else{
      this.setData({'isShowCondition':!this.data.isShowCondition,'iconName':"jia-shouqi"});
    }
  },
  // chooseTransType:function(event){
  //    this.transType=event.detail;
  //    if(this.transType==''){
  //     this.innerText[0]='';
  //    }else{
  //     for(let k=0;k<this.data.transTypes.length;k++){
  //       if(this.data.transTypes[k].value==this.transType){
  //         this.innerText[0]=this.data.transTypes[k].text;
  //         break;
  //       }
  //    }
  //    }
  //    this.showText();
  // },
  confirmDate: function (e) {
    let choosedDate = dateUtil.convertShortDateToLang(e.detail.startDate) + '~' + dateUtil.convertShortDateToLang(e.detail.endDate);
    if(e.detail.endDate>dateUtil.getCurrentDate('yyyyMMdd')){
         //接口返回错误
      wx.showToast({
        title: '查询日期间隔不能超过今天',
        icon: 'none'
      })
      return false;
    }
    
    this.setData({'CHOOSED_TIME_AREA':choosedDate,'chooseTimeWidth':'400rpx','IS_SHOW_CHOOSE_AREA': false, 'isShowOverlay': false,'CHOOSED_DATE':''});

    this.beginAcctDate = e.detail.startDate;
    this.endAcctDate=e.detail.endDate;

    this.innerText[1]=choosedDate;
    this.showText();
  },
  chooseThisDate:function(event){
    let date = event.currentTarget.dataset.date;
    // if(date=='D'){
    //   this.beginAcctDate=dateUtil.getCurrentDate("yyyyMMdd");
    //   this.endAcctDate=dateUtil.getCurrentDate("yyyyMMdd");
    //   this.innerText[1]=dateUtil.convertShortDateToLang(this.beginAcctDate)+"~"+dateUtil.convertShortDateToLang(this.endAcctDate);
    //   this.showText();
    // }else
     if(date=='W'){
      let curWeek=dateUtil.getCurrentWeek();
      this.beginAcctDate=dateUtil.convertLongDateToShort(curWeek.begin);
      this.endAcctDate=dateUtil.convertLongDateToShort(curWeek.end);
      this.innerText[1]=curWeek.begin+"~"+curWeek.end;
      this.showText();
    }else if(date=='L'){
      let preWeek=dateUtil.getPreWeek();
      this.beginAcctDate=dateUtil.convertLongDateToShort(preWeek.begin);
      this.endAcctDate=dateUtil.convertLongDateToShort(preWeek.end);
      this.innerText[1]=preWeek.begin+"~"+preWeek.end;
      this.showText();
    }else{
      let currentMonth=dateUtil.getCurrentMonth();
      this.beginAcctDate=dateUtil.convertLongDateToShort(currentMonth.begin);
      this.endAcctDate=dateUtil.convertLongDateToShort(currentMonth.end);
      this.innerText[1]=currentMonth.begin+"~"+currentMonth.end;
      this.showText();
    }
    this.setData({'CHOOSED_DATE':date,'CHOOSED_TIME_AREA':'按日历选择','chooseTimeWidth':'150rpx'});
  },
  chooseTimeArea:function(){
    this.setData({ 'IS_SHOW_CHOOSE_AREA': true, 'isShowOverlay': true});
  },
  hideDateOverLay:function(){
    this.setData({ 'IS_SHOW_CHOOSE_AREA': false, 'isShowOverlay': false});
  },
  showText:function(){
    if(this.innerText[0]==''&&this.innerText[1]==''){
      this.setData({'ordQueryDesc':'请选择'});
    }else{
       let ordQuery='';
       if(this.innerText[0]!=''){
        ordQuery=ordQuery+this.innerText[0]+"|";
       }
       if(this.innerText[1]!=''){
        ordQuery=ordQuery+this.innerText[1]+"|";
       }
       if(ordQuery.substring(0,1)=='|'){
        ordQuery=ordQuery.substring(l);
       }
       if(ordQuery.substring(ordQuery.length-1,ordQuery.length)=='|'){
        ordQuery=ordQuery.substring(0,ordQuery.length-1);
       }
       this.setData({'ordQueryDesc':ordQuery});
    }
  },
  onQueryAcctLogInfo:function(){
    this.showCondition();
    this.PAGENUM=1;
    this.queryAcctOrder();
  },
  queryMore:function() {
    if(this.data.CURRENTCOUNT==this.data.TOTALRECORD){
      return;
    }else{
      this.PAGENUM = this.PAGENUM + 1;
      this.setData({ 'isLoading': true });
      this.showLoading(!0);
      this.queryAcctOrder();
    }
  },
  queryAcctOrder:function(){
    this.showLoading(!0);
    var data = {
      'custId': app.storage.getLoginInfo().custId,
      'beginAcctDate': this.beginAcctDate,
      'endAcctDate': this.endAcctDate,
      // 'transType': this.transType,
      'huSeqId':app.storage.getLoginInfo().huSeqId,
      'pageNum':  this.PAGENUM,
      'pageSize': this.PAGESIZE
    };
    // var data = {
    //   'custId': '3048000060',
    //   'beginAcctDate': this.beginAcctDate,
    //   'endAcctDate': this.endAcctDate,
    //   'transType': this.transType,
    //   'huSeqId':'00000002',
    //   'pageNum': this.PAGENUM,
    //   'pageSize': this.PAGESIZE
    // };
    var that = this;
    var res = app.req.postRequest(apiUtil.queryAcctLog,data).then(function (res) {
      // console.log("返回结果:" + JSON.stringify(res.data));
      if (res.data.respCode == '000') {
        let acctLogDtos=that.PAGENUM==1?res.data.acctLogDtos:that.data.ACCTLOGDTOS.concat(res.data.acctLogDtos);
        that.setData({'ACCTLOGDTOS':acctLogDtos,'TOTALRECORD':res.data.totalRecord,'isLoading': false, 'CURRENTCOUNT': acctLogDtos.length, });
        if (that.data.ACCTLOGDTOS.length == 0) {
          that.setData({ 'bgColor': 'white' });
        } else {
          that.setData({ 'bgColor': '#FFF' });
        }
      } else {
        //接口返回错误
        wx.showToast({
          title: res.data.errDesc + '[' + res.data.respCode + ']',
          icon: 'none'
        })
      }
      that.showLoading(!1);
    });
  },
})