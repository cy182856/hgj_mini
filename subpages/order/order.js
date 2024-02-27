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
    pageNum: 1,
    totalNum: 0,
    pageSize: 8,
    curYear: new Date().getFullYear(), 
    curMonth: new Date().getMonth() + 1,
    today: new Date().getDate(),
    prev: !0,
    next: !0,
    header: true,           
    week_title: true,    
    title_type: 'cn',  
    cellSize:100,
    more:!1, 
    activeType: "square",
    currentDate: new Date().getTime(),
    maxDate: new Date().getTime(),
    formatter(type, value) {
      if (type === 'year') {
        return `${value}年`;
      } else if (type === 'month') {
        return `${value}月`;
      }else if(type==='day'){
        return `${value}日`;
      }
      return value;
    },
    nextPage: true,
    payTransLogDtos: [],
    bottomText: "点击/下拉加载更多",
    showBottom:false,
    msg:"哎呀，暂无查询数据",
    showErrMsg:false,
    showPopup:false,
    busiIds: [
      { text: '请选择', value: '' },
      { text: '预约', value: '01' },
      { text: '物业费', value: '02' },
      { text: '维修费', value: '03' },
      { text: '停车费', value: '10' },
      { text: '店铺收款', value: '04' },
    ],
    payStats: [
      { text: '请选择', value: '' },
      { text: '支付成功', value: 'S' },
      { text: '已退款', value: 'R' },
    ],
    busiId: '',
    payStat: '',
    lastWeekButtonType:'default',
    thisWeekButtonType:'default',
    thisMonthButtonType:'default',
    thisCalendarButtonType:'info',
    calendarShow:false,
    dateChoosed:'',
    dateType:4, // 1-上周、2-本周、3-上月、4-自定义
    dateTypeDesc:'',
    beginDate:'',
    endDate:'',
    busiIdDesc:'',
    payStatDesc:'',
    popupH:'36%',
    globalPopupH:'36%',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.loading();this.showLoading(1);
    this.setData({
      selStartDate:dateUtil.getDaysAgo(6,2),
      selEndDate:dateUtil.getCurrentDate("yyyyMMdd"),
      dateChoosed:dateUtil.getDaysAgo(6,3) + '~' + dateUtil.getCurrentDate("yyyy-MM-dd"),
      dateTypeDesc:dateUtil.getDaysAgo(6,3) + '~' + dateUtil.getCurrentDate("yyyy-MM-dd"),
      beginDate:dateUtil.getDaysAgo(6,3),
      endDate:dateUtil.getCurrentDate("yyyy-MM-dd"),
    })
    let windowH = app.globalData.windowH;
    console.log(windowH);
    if (windowH >= 520 && windowH < 680) {
      this.setData({
        popupH:'43%',
        globalPopupH:'43%',
      });
    } else if (windowH < 520) {
      this.setData({
        popupH:'45%',
        globalPopupH:'45%',
      });
    }
    this.queryOrder();
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
    this.toNextPage();
  },

  scrolltolower:function(){
    this.onReachBottom();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  toNextPage: function(){
    //查询我的物业订单
    let pageNum = this.data.pageNum;
    pageNum++;
    let pageSize = this.data.pageSize;
    let totalNum = this.data.totalNum;
    if(!hasNextPage(pageNum, pageSize, totalNum)){
      this.setData({
        bottomText: "已经到底了"
      });
      return;
    }
    let beginDate = this.data.beginDate;
    let endDate = this.data.endDate;
    let dateType = this.data.dateType;
    let busiId = this.data.busiId;
    let payStat = this.data.payStat;
    if (dateType == 0) {
      this.showLoading(0);
      Toast("付款时间必须");
      return;
    } else if (dateType == 4 && (beginDate == '' || endDate == '')) {
      this.showLoading(0);
      Toast("请确定时间范围");
      return;
    } else if (dateType == 1) {
      let preWeek = dateUtil.getPreWeek();
      beginDate = preWeek.begin;
      console.log(beginDate);
      endDate = preWeek.end;
      console.log(endDate);
    } else if (dateType == 2) {
      let thisWeek = dateUtil.getCurrentWeek();
      beginDate = thisWeek.begin;
      console.log(beginDate);
      endDate = thisWeek.end;
      console.log(endDate);
    } else if (dateType == 3) {
      let thisMonth = dateUtil.getCurrentMonth();
      beginDate = thisMonth.begin;
      console.log(beginDate);
      endDate = thisMonth.end;
      console.log(endDate);
    }
    var that = this;
    that.showLoading(1);
    let data = {
      pageNum: pageNum,
      pageSize: pageSize,
      transType:'P',
      payBeginDate:beginDate,
      payEndDate:endDate,
      busiId:busiId,
      payStat:payStat,
    };

    app.req.postRequest(
      apiUtil.orderQueryUrl,
      data
    ).then(function (res) {
        that.showLoading(0);
        console.log(res.data)
        if (res.data.RESPCODE != '000') {
          Toast(res.data.ERRDESC);
          return;
        } 
        let payTransLogDtosTmp = res.data.payTransLogDtos;
        let payTransLogDtosCurr = that.data.payTransLogDtos;
        let payTransLogDtos = payTransLogDtosCurr.concat(payTransLogDtosTmp);
        that.setData({
          payTransLogDtos: payTransLogDtos,
          pageNum: pageNum,
          totalNum: totalNum,
          pageSize: pageSize,
          'showErrMsg':false
        });
    }).catch(error => {
      that.showLoading(0);
      // 网络异常，请稍后再试
      Toast("网络异常，请稍后再试");
    });
  },
  queryRefundDetail:function(ele) {
    let payDate = ele.currentTarget.dataset.paydate;
    let paySeqId = ele.currentTarget.dataset.payseqid;
    let payStat = ele.currentTarget.dataset.paystat;
    var pathurl = '../order/orderdetail/orderdetail?payDate=' + payDate + '&paySeqId=' + paySeqId + '&payStat=' + payStat;
    wx.navigateTo({
      url: pathurl
    });
  },

  queryOrder:function() {
    let beginDate = this.data.beginDate;
    let endDate = this.data.endDate;
    let dateType = this.data.dateType;
    let busiId = this.data.busiId;
    let payStat = this.data.payStat;
    if (dateType == 0) {
      this.showLoading(0);
      Toast("付款时间必须");
      return;
    } else if (dateType == 4 && (beginDate == '' || endDate == '')) {
      this.showLoading(0);
      Toast("请确定时间范围");
      return;
    } else if (dateType == 1) {
      let preWeek = dateUtil.getPreWeek();
      beginDate = preWeek.begin;
      console.log(beginDate);
      endDate = preWeek.end;
      console.log(endDate);
    } else if (dateType == 2) {
      let thisWeek = dateUtil.getCurrentWeek();
      beginDate = thisWeek.begin;
      console.log(beginDate);
      endDate = thisWeek.end;
      console.log(endDate);
    } else if (dateType == 3) {
      let thisMonth = dateUtil.getCurrentMonth();
      beginDate = thisMonth.begin;
      console.log(beginDate);
      endDate = thisMonth.end;
      console.log(endDate);
    }
    this.setData({
      pageNum: 1,
      totalNum: 0,
      pageSize: 8,
      bottomText: "点击/下拉加载更多",
    });
    //查询我的物业订单
    let data = {
      pageNum: this.data.pageNum,
      pageSize: this.data.pageSize,
      payBeginDate:beginDate,
      payEndDate:endDate,
      busiId:busiId,
      payStat:payStat,
      transType:'P'
    };
    var that = this;
    app.req.postRequest(
      apiUtil.orderQueryUrl,
      data
    ).then(function (res) {
        that.showLoading(0);
        console.log(res.data)
        if (res.data.RESPCODE != '000') {
          that.setData({
            payTransLogDtos:[],
            'msg':res.data.ERRDESC,
            'showErrMsg':true
          });
          return;
        }
        let pageSize = that.data.pageSize;
        let pageNum = that.data.pageNum; 
        let totalNum = res.data.totalNum;
        let showBottom = that.data.showBottom;
        let maxPageNum = parseInt(totalNum/pageSize)+1;
        console.log(maxPageNum);
        if (maxPageNum > pageNum) {
          console.log("1111");
          showBottom = true;
        }
        that.setData({
          payTransLogDtos: res.data.payTransLogDtos,
          pageNum: that.data.pageNum,
          totalNum: totalNum,
          showBottom:showBottom,
          'showErrMsg':false
        });
    }).catch(error => {
      that.showLoading(0);
      that.setData({
        payTransLogDtos:[],
        'msg':'网络异常，请稍后再试',
        'showErrMsg':true
      });
    });
  },
  confirmQuery:function(){
    let dateType = this.data.dateType;
    let beginDate = this.data.beginDate;
    let endDate = this.data.endDate;
    if (dateType == 0) {
      Toast("付款时间必须");
      return;
    } else if (dateType == 4 && (beginDate == '' || endDate == '')) {
      Toast("请确定时间范围");
      return;
    }
    this.showLoading(1);
    this.setData({
      showPopup:false,
    });
    this.queryOrder();
  },
  onPopClose:function() {
    this.setData({
      showPopup:false,
    });
  },
  showPopup:function() {
    this.setData({
      showPopup:true,
    });
  },
  lastWeek:function(){
    this.setData({
      lastWeekButtonType:'info',
      thisMonthButtonType:'default',
      thisWeekButtonType:'default',
      thisCalendarButtonType:'default',
      calendarShow:false,
      dateChoosed:'',
      dateType:1, // 1-上周、2-本周、3-上月、4-自定义
      dateTypeDesc:'上周',
      beginDate:'',
      endDate:'',
    });
  },
  thisWeek:function(){
    this.setData({
      lastWeekButtonType:'default',
      thisMonthButtonType:'default',
      thisWeekButtonType:'info',
      thisCalendarButtonType:'default',
      calendarShow:false,
      dateChoosed:'',
      dateTypeDesc:'本周',
      dateType:2, // 1-上周、2-本周、3-上月、4-自定义
      beginDate:'',
      endDate:'',
    });
  },
  thisMonth:function(){
    this.setData({
      lastWeekButtonType:'default',
      thisMonthButtonType:'info',
      thisWeekButtonType:'default',
      thisCalendarButtonType:'default',
      calendarShow:false,
      dateChoosed:'',
      dateTypeDesc:'本月',
      dateType:3, // 1-上周、2-本周、3-本月、4-自定义
      beginDate:'',
      endDate:'',
    });
  },
  showCalendarClick:function(){
    this.setData({
      lastWeekButtonType:'default',
      thisMonthButtonType:'default',
      thisWeekButtonType:'default',
      thisCalendarButtonType:'info',
      calendarShow:true,
      dateType:4, // 1-上周、2-本周、3-本月、4-自定义
    });
  },
  onCalendarClose:function(){
    this.setData({
      calendarShow:false,
    })
  },
  /** 
   * yyyy-MM-dd
   */
  formatDate(date) {
    return dateUtil.formatDate(new Date(date), 'yyyy-MM-dd')
    //return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
  },
  /**
  * MM/dd
  */
  formatShortDate(date) {
    date = new Date(date);
    return `${date.getMonth() + 1}/${date.getDate()}`;
  },
  onCalendarConfirm:function(event){
    console.log(event);
    var beginDate = dateUtil.convertShortDateToLang(event.detail.startDate),
    endDate = dateUtil.convertShortDateToLang(event.detail.endDate);
    this.setData({
      calendarShow:false,
      dateChoosed:beginDate + '~' + endDate,
      dateTypeDesc:beginDate + '~' + endDate,
      beginDate:beginDate,
      endDate:endDate,
    });
  },
  dropdownmenuOpen:function(event) {
    if (!isIphone) {
      return;
    }
    this.setData({
      popupH:'55%',
    });
  },
  dropdownmenuClose:function(event) {
    if (!isIphone) {
      return;
    }
    this.setData({
      popupH:this.data.globalPopupH,
    });
  },
  chooseBusiId:function(event){
    let busiId = event.detail;
    let busiIdDesc = getBusiIdDesc(busiId);
    this.setData({
      busiId:busiId,
      busiIdDesc:busiIdDesc,
    });
  },
  choosePayStat:function(event){
    let payStat = event.detail;
    let payStatDesc = getPayStatDesc(payStat);
    
    this.setData({
      payStat:payStat,
      payStatDesc:payStatDesc,
    });
  }

})
function getPayStatDesc(payStat) {
  let payStatDesc = "";
  if (payStat == 'I') {
    payStatDesc = "未支付";
  } else if (payStat == 'S') {
    payStatDesc = "支付成功";
  } else if (payStat == 'F') {
    payStatDesc = "支付失败";
  } else if (payStat == 'P') {
    payStatDesc = "处理中";
  } else if (payStat == 'R') {
    payStatDesc = "已退款";
  } 
  return payStatDesc;
}
function getBusiIdDesc(busiId) {
  let busiIdDesc = "";
  if (busiId == '01') {
    busiIdDesc = "预约";
  } else if (busiId == '02') {
    busiIdDesc = "物业费";
  } else if (busiId == '03') {
    busiIdDesc = "维修费";
  } else if (busiId == '04') {
    busiIdDesc = "店铺收款";
  } else if (busiId == '10') {
    busiIdDesc = "停车费";
  } 
  return busiIdDesc;
}

function hasNextPage(pageNum, pageSize, totalNum){
  let maxPageNum = totalNum/pageSize+1;
  return maxPageNum > pageNum;
}