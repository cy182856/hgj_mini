const apiUtil = require('../../const/api.js')
const stringUtil = require('../../utils/stringUtil.js')
const dateUtil=require('../../utils/dateUtil.js')
import Toast from '../../@vant/weapp/toast/toast';
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    DEFAULT_OBJID:'',
    OBJINFOS: [],
    APPTTIMEDTLDTOS:[],
    APPTOBJDTLDTOS: [],
    APPTDATES:[],
    CHOOSECNT:'',
    TRANS_AMT:0,
    isShowDtl:false,
    isStepAble:false,
    'isLoading': true,
    isShowDialog:false,
    showDialogDesc:'',
    currentDateTime: dateUtil.getDaysAgo(0,2)+stringUtil.doHandleMonth(new Date().getHours()) + "" + stringUtil.doHandleMonth(new Date().getMinutes())+""+stringUtil.doHandleMonth(new Date().getSeconds()),
    currentDate: dateUtil.getDaysAgo(0,2),
    currentTime: stringUtil.doHandleMonth(new Date().getHours()) + "" + stringUtil.doHandleMonth(new Date().getMinutes()) + "" + stringUtil.doHandleMonth(new Date().getSeconds()),

    //对象内部属性
    // isHasTip:false,
    APPTOBJINFO:null,//
    APPTCTRLINFODTO: null,
    APPTTIMEDTLINFOS:null,
    APPTCTRLTYPE:'',
    APPTOBJCTRLDTOS:[],
    chooseApptDateDtls:[],
    chooseApptWeekDateDtls:[],
    chooseApptMonDateDtls:[],
    advApptDay:'',
    chooseTimeDtls:[],

    //'iphoneX': app.globalData.iphoneX,
    btuBottom:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.loading(), this.showLoading(!1);
    var objId = options.objId;
    // objId='001';
    this.objId=objId;
    this.setData({ 'DEFAULT_OBJID': this.objId});
    this.requestApptObjInfo();
    this.chooseTimeDtls=[];//存放选中的数据

    let iphone8 = app.globalData.iphone8;
    if (iphone8) {
      this.setData({
        btuBottom: '68rpx',
      })
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

  },
  selectedDtlAdd:function(event){
    this.chooseApptTime(event);
    this.setData({ 'CHOOSECNT': this.data.CHOOSECNT, 'APPTTIMEDTLDTOS': this.data.APPTTIMEDTLDTOS, 'CHOOSETIMEDTL': this.chooseTimeDtls, 'isStepAble': false });
  },
  selectedDtlSub: function (event) {
    this.setData({'isStepAble':true})
    let apptDate = event.currentTarget.dataset.apptdate;
    let apptTimeId = event.currentTarget.dataset.appttimeid;
    //明细选中数量的处理
    let curApptTimeDtls = this.data.APPTTIMEDTLDTOS;
    for (let i = 0; i < curApptTimeDtls.length; i++) {
      if (this.objId == curApptTimeDtls[i].OBJID && apptDate == curApptTimeDtls[i].APPTDATE && curApptTimeDtls[i].APPTTIMEID == apptTimeId) {
        if (curApptTimeDtls[i].SELECTEDCNT==1) {
          curApptTimeDtls[i].SELECTEDCNT='';
        } else {
          curApptTimeDtls[i].SELECTEDCNT--;
        }
        this.data.TRANS_AMT = (parseFloat(this.data.TRANS_AMT) - parseFloat(curApptTimeDtls[i].APPTPRICE)).toFixed(2);
        break;
      }
    }
    //总数的减少
    if (this.data.CHOOSECNT==1){
      this.data.CHOOSECNT='';
      this.setData({ 'isShowDtl': false });
    }else{
      this.data.CHOOSECNT --;
    }

    //明细详情的处理
    let curChooseTImeDtls=this.chooseTimeDtls;
    for (let k = 0; k < curChooseTImeDtls.length; k++) {
      if (apptDate == curChooseTImeDtls[k].APPTDATE && apptTimeId == curChooseTImeDtls[k].APPTTIMEID) {
        if (curChooseTImeDtls[k].OBJCNT==1){
          curChooseTImeDtls.splice(k,1)
        }else{
          curChooseTImeDtls[k].OBJCNT--;
        }
        //curChooseTImeDtls[k].OBJCNT--;
        break;
      }
    }
    //标的日期选中的处理
    for(let n=0;n<this.data.chooseApptDateDtls.length;n++){
      if(this.data.chooseApptDateDtls[n].APPTDATE==apptDate){
        if(this.data.chooseApptDateDtls[n].APPTCNT==1){
          this.data.chooseApptDateDtls.splice(n,1);
        }else{
          this.data.chooseApptDateDtls[n].APPTCNT--;
        }
      }
      break;
    } 
    for(let n=0;n<this.data.chooseApptWeekDateDtls.length;n++){
      if(this.data.chooseApptWeekDateDtls[n].WEEKDATE==stringUtil.getWeekNumber(apptDate.substring(0,4),apptDate.substring(4,6),apptDate.substring(6,8))){
        if(this.data.chooseApptWeekDateDtls[n].WEEKCNT==1){
          this.data.chooseApptWeekDateDtls.splice(n,1);
        }else{
          this.data.chooseApptWeekDateDtls[n].WEEKCNT--;
        }
      }
      break;
    } 
    for(let n=0;n<this.data.chooseApptMonDateDtls.length;n++){
      if(this.data.chooseApptMonDateDtls[n].MONDATE==apptDate.substring(0,6)){
        if(this.data.chooseApptMonDateDtls[n].MONCNT==1){
          this.data.chooseApptMonDateDtls.splice(n,1);
        }else{
          this.data.chooseApptMonDateDtls[n].MONCNT--;
        }
      }
      break;
    } 
    this.data.APPTTIMEDTLDTOS = curApptTimeDtls;
    this.chooseTimeDtls = curChooseTImeDtls;

    this.setData({ 'CHOOSECNT': this.data.CHOOSECNT, 'APPTTIMEDTLDTOS': this.data.APPTTIMEDTLDTOS,'CHOOSETIMEDTL': this.chooseTimeDtls,'TRANS_AMT':this.data.TRANS_AMT,'isStepAble':false});  
  },
  showApptTimeDtl:function(){
    //有选中时段才显示
    if (this.chooseTimeDtls.length>0){
      this.setData({ 'isShowDtl': !this.data.isShowDtl, 'CHOOSETIMEDTL': this.chooseTimeDtls});
    }else{
      this.setData({'isShowDtl':false});
    }
  },
  chooseApptTime:function(event){
    let apptDate = event.currentTarget.dataset.apptdate;
    let apptTimeId = event.currentTarget.dataset.appttimeid;
    let isTip = event.currentTarget.dataset.istip;
    let beginTimeDesc=event.currentTarget.dataset.begintimedesc;
    let endTimeDesc=event.currentTarget.dataset.endtimedesc;
    //封装选中的数据
    let curTimeDtl = {};
    let curApptTimeDtls=this.data.APPTTIMEDTLDTOS;
    for (let i = 0; i < curApptTimeDtls.length; i++) {
      if (this.objId == curApptTimeDtls[i].OBJID && apptDate == curApptTimeDtls[i].APPTDATE && curApptTimeDtls[i].APPTTIMEID == apptTimeId) {
        if (curApptTimeDtls[i].AVLCNT <= curApptTimeDtls[i].SELECTEDCNT){
           return false;
        }
        if (curApptTimeDtls[i].SELECTEDCNT) {
          curApptTimeDtls[i].SELECTEDCNT++;
        } else {
          curApptTimeDtls[i].SELECTEDCNT = 1;
        }
        this.data.TRANS_AMT = (parseFloat(this.data.TRANS_AMT) + parseFloat(curApptTimeDtls[i].APPTPRICE)).toFixed(2);
        curTimeDtl.APPTDATE = apptDate;
        curTimeDtl.APPTLONGDATE = curApptTimeDtls[i].APPTLONGDATE;
        curTimeDtl.BEGINTIME = curApptTimeDtls[i].BEGINTIME;
        curTimeDtl.ENDTIME = curApptTimeDtls[i].ENDTIME;
        curTimeDtl.BEGINTIMEDESC = curApptTimeDtls[i].BEGINTIMEDESC;
        curTimeDtl.ENDTIMEDESC = curApptTimeDtls[i].ENDTIMEDESC;
        curTimeDtl.APPTTIMEID = apptTimeId;
        curTimeDtl.APPTPRICE = curApptTimeDtls[i].APPTPRICE;
        curTimeDtl.AVLCNT = curApptTimeDtls[i].AVLCNT;
        curTimeDtl.OBJCNT = 1;
        break;
      }
    }
     //封装按标的日期选中的数据
     let chooseApptDateData={};
     if(this.data.chooseApptDateDtls.length==0){
       chooseApptDateData.APPTDATE=apptDate;
       chooseApptDateData.APPTCNT=1;
       this.data.chooseApptDateDtls.push(chooseApptDateData);
     }else{
       let isMatchedApptDate=false;
       for(let n=0;n<this.data.chooseApptDateDtls.length;n++){
           if(this.data.chooseApptDateDtls[n].APPTDATE==apptDate){
             this.data.chooseApptDateDtls[n].APPTCNT++;
             isMatchedApptDate=true;
             break;
           }
       } 
       if(!isMatchedApptDate){
         chooseApptDateData.APPTDATE=apptDate;
         chooseApptDateData.APPTCNT=1;
         this.data.chooseApptDateDtls.push(chooseApptDateData);
       }
     }
    //标的周选中
    let chooseApptWeekData={};
    if(this.data.chooseApptWeekDateDtls.length==0){
      chooseApptWeekData.WEEKDATE=stringUtil.getWeekNumber(apptDate.substring(0,4),apptDate.substring(4,6),apptDate.substring(6,8));
      chooseApptWeekData.WEEKCNT=1;
      this.data.chooseApptWeekDateDtls.push(chooseApptWeekData);
    }else{
      let isMatchedApptWeekDate=false;
      for(let n=0;n<this.data.chooseApptWeekDateDtls.length;n++){
          if(this.data.chooseApptWeekDateDtls[n].WEEKDATE==stringUtil.getWeekNumber(apptDate.substring(0,4),apptDate.substring(4,6),apptDate.substring(6,8))){
            this.data.chooseApptWeekDateDtls[n].WEEKCNT++;
            isMatchedApptWeekDate=true;
            break;
          }
      } 
      if(!isMatchedApptWeekDate){
        chooseApptWeekData.WEEKDATE=stringUtil.getWeekNumber(apptDate.substring(0,4),apptDate.substring(4,6),apptDate.substring(6,8));
        chooseApptWeekData.WEEKCNT=1;
        this.data.chooseApptWeekDateDtls.push(chooseApptWeekData);
      }
    }   
    //标的月选中
    let chooseApptMonData={};
    if(this.data.chooseApptMonDateDtls.length==0){
      chooseApptMonData.MONDATE=apptDate.substring(0,6);
      chooseApptMonData.MONCNT=1;
      this.data.chooseApptMonDateDtls.push(chooseApptMonData);
    }else{
      let isMatchedApptMonDate=false;
      for(let n=0;n<this.data.chooseApptMonDateDtls.length;n++){
          if(this.data.chooseApptMonDateDtls[n].MONDATE==apptDate.substring(0,6)){
            this.data.chooseApptMonDateDtls[n].MONCNT++;
            isMatchedApptMonDate=true;
            break;
          }
      } 
      if(!isMatchedApptMonDate){
        chooseApptMonData.MONDATE=apptDate.substring(0,6);
        chooseApptMonData.MONCNT=1;
        this.data.chooseApptMonDateDtls.push(chooseApptMonData);
      }
    }
    //明细的维护
    let curChooseTImeDtls = this.chooseTimeDtls;
    let isAdd = true;
    if (curChooseTImeDtls.length == 0) {
      isAdd=true;
      this.data.CHOOSECNT = 1;
    } else {
      this.data.CHOOSECNT++;
      for (let k = 0; k < curChooseTImeDtls.length; k++) {
        if (apptDate == curChooseTImeDtls[k].APPTDATE && apptTimeId == curChooseTImeDtls[k].APPTTIMEID) {
          curChooseTImeDtls[k].OBJCNT++;
          isAdd = false;
        }
      }
    }
    //预约合法性校验
    let validMsg = this.validateParam(isAdd, apptDate);
    if(validMsg!=''){
      if(!isAdd){//本地保存选中数据进行回滚
        for (let k = 0; k < curChooseTImeDtls.length; k++) {
          if (apptDate == curChooseTImeDtls[k].APPTDATE && apptTimeId == curChooseTImeDtls[k].APPTTIMEID) {
            if (curChooseTImeDtls[k].OBJCNT == 1) {
              curChooseTImeDtls.splice(k, 1)
            } else {
              curChooseTImeDtls[k].OBJCNT--;
            }
          }
        }
      }
      //选中数量的回滚
      if (this.data.CHOOSECNT == 1) {
        this.data.CHOOSECNT = '';
        this.setData({ 'isShowDtl': false });
      } else {
        this.data.CHOOSECNT--;
      }
      //选中明细标记的回滚
      for (let i = 0; i < curApptTimeDtls.length; i++) {
        if (this.objId == curApptTimeDtls[i].OBJID && apptDate == curApptTimeDtls[i].APPTDATE && curApptTimeDtls[i].APPTTIMEID == apptTimeId) {
          if (curApptTimeDtls[i].SELECTEDCNT==1) {
            curApptTimeDtls[i].SELECTEDCNT='';
          } else {
            curApptTimeDtls[i].SELECTEDCNT--;
          }
          this.data.TRANS_AMT = (parseFloat(this.data.TRANS_AMT) - parseFloat(curApptTimeDtls[i].APPTPRICE).toFixed(2));
          break;
        }
      }
      //按标的日期选中数量的回滚
      for(let n=0;n<this.data.chooseApptDateDtls.length;n++){
        if(this.data.chooseApptDateDtls[n].APPTDATE==apptDate){
          if(this.data.chooseApptDateDtls[n].APPTCNT==1){
            this.data.chooseApptDateDtls.splice(n,1);
          }else{
            this.data.chooseApptDateDtls[n].APPTCNT--;
          }
        }
        break;
      } 
      for(let n=0;n<this.data.chooseApptWeekDateDtls.length;n++){
        if(this.data.chooseApptWeekDateDtls[n].WEEKDATE==stringUtil.getWeekNumber(apptDate.substring(0,4),apptDate.substring(4,6),apptDate.substring(6,8))){
          if(this.data.chooseApptWeekDateDtls[n].WEEKCNT==1){
            this.data.chooseApptWeekDateDtls.splice(n,1);
          }else{
            this.data.chooseApptWeekDateDtls[n].WEEKCNT--;
          }
        }
        break;
      } 
      for(let n=0;n<this.data.chooseApptMonDateDtls.length;n++){
        if(this.data.chooseApptMonDateDtls[n].MONDATE==apptDate.substring(0,6)){
          if(this.data.chooseApptMonDateDtls[n].MONCNT==1){
            this.data.chooseApptMonDateDtls.splice(n,1);
          }else{
            this.data.chooseApptMonDateDtls[n].MONCNT--;
          }
        }
        break;
      } 
      // wx.showModal({
      //   title: '操作提示',
      //   content: validMsg,
      //   showCancel: false,
      //   success(res) {
      //     if (res.confirm) {
      //     }
      //   }
      // })
      this.setData({'isShowDialog':true,'showDialogDesc':validMsg});
    }else{
      if (isTip=='Y'){
        // let that=this;
        // wx.showModal({
        //   title: '操作提示',
        //   content: '当前选择标的时间段为：'+beginTimeDesc+'~'+endTimeDesc+'，请以购物车中显示时间为准。',
        //   showCancel: false,
        //   success(res) {
        //     if (res.confirm) {
        //     }
        //   }
        // })
        this.setData({'isShowDialog':true,'showDialogDesc':'当前选择标的时间段为：'+beginTimeDesc+'~'+endTimeDesc+'，请以购物车中显示时间为准。'});
      }
      this.data.APPTTIMEDTLDTOS = curApptTimeDtls;
      if (isAdd) {
        curChooseTImeDtls.push(curTimeDtl);
      }
    }
    this.chooseTimeDtls = curChooseTImeDtls;
    this.setData({ 'CHOOSECNT': this.data.CHOOSECNT, 'APPTTIMEDTLDTOS': this.data.APPTTIMEDTLDTOS, 'TRANS_AMT': this.data.TRANS_AMT});
    if (this.chooseTimeDtls.length>0){
      this.setData({ 'isShowDtl': true, 'CHOOSETIMEDTL': this.chooseTimeDtls });
    }
  },
  chooseObj:function(event){
    console.log("选中的标的==》" + event.detail);
    this.objId = event.detail;
    this.selectedEmpty();
    this.setData({'isLoading': true});
    this.requestApptObjInfo();
  },
  closeOverlay:function(){
    this.setData({'isShowDtl': false});
  },
  selectedEmpty:function(event){
    let curApptTimeDtls = this.data.APPTTIMEDTLDTOS;
    for (let i = 0; i < curApptTimeDtls.length; i++) {
      curApptTimeDtls[i].SELECTEDCNT='';
    }  
    this.data.APPTTIMEDTLDTOS = curApptTimeDtls;
    this.chooseTimeDtls=[];
    this.data.chooseApptDateDtls=[];
    this.data.chooseApptWeekDateDtls=[];
    this.data.chooseApptMonDateDtls=[];
    this.setData({ 'CHOOSECNT': '', 'APPTTIMEDTLDTOS': this.data.APPTTIMEDTLDTOS, 'TRANS_AMT': 0 });
    this.setData({ 'isShowDtl': false, 'CHOOSETIMEDTL': this.chooseTimeDtls });
  },
  validateParam: function (isAdd, apptDate){
    //最大时段
    let maxTimeUnit = this.APPTOBJINFO.maxTimeUnit;
    let timeUnit = isAdd ? this.chooseTimeDtls.length + 1 : this.chooseTimeDtls.length;
    if (timeUnit>maxTimeUnit){
      return "超过一次可预约的最大时段";
    }
    //最大预约数量
    let maxApptCnt = this.APPTOBJINFO.maxApptCnt;
    if (this.data.CHOOSECNT > maxApptCnt) {
      return "超过一次可预约的最大数量";
    }
    //一天最大数量判断
    let maxDayCnt = this.APPTOBJINFO.dayMaxCnt;
    //一周最大数量判断
    let maxWeekCnt = this.APPTOBJINFO.weekMaxCnt;
    //一月最大数量判断
    let maxMonCnt = this.APPTOBJINFO.monMaxCnt;
    if (this.APPTCTRLTYPE=='OB'){
      for(let k=0;k<this.APPTOBJCTRLDTOS.length;k++){
        for (let i = 0; i < this.data.chooseApptDateDtls.length; i++) {
          if (this.APPTOBJCTRLDTOS[k].DAYCYCDATE==apptDate&&this.data.chooseApptDateDtls[i].APPTDATE ==apptDate){
            if (maxDayCnt != 0 && maxDayCnt < (parseInt(this.APPTOBJCTRLDTOS[k].DAYAPPTCNT) + this.data.chooseApptDateDtls[i].APPTCNT)) {
              return "超过每户每日最大预约标的数量(" + dateUtil.convertShortDateToLang(apptDate)+")";
            }
            let weekDate=stringUtil.getWeekNumber(apptDate.substring(0,4),apptDate.substring(4,6),apptDate.substring(6,8));
            for (let w = 0; w < this.data.chooseApptWeekDateDtls.length; w++) {
              if (this.APPTOBJCTRLDTOS[k].WEEKCYCDATE==weekDate&&this.data.chooseApptWeekDateDtls[w].WEEKDATE ==weekDate){
                if (maxWeekCnt != 0 && maxWeekCnt < (parseInt(this.APPTOBJCTRLDTOS[k].WEEKAPPTCNT) + this.data.chooseApptWeekDateDtls[w].WEEKCNT)) {
                  return "超过每户每周最大预约标的数量("+this.APPTOBJCTRLDTOS[k].WEEKBEGINDATE+"~"+this.APPTOBJCTRLDTOS[k].WEEKENDDATE+")";
                }
                break;
              }  
            }
            let monDate=apptDate.substring(0,6);
            for (let m = 0; m < this.data.chooseApptMonDateDtls.length; m++) {
              if (this.APPTOBJCTRLDTOS[k].MONCYCDATE==monDate&&this.data.chooseApptMonDateDtls[m].MONDATE ==monDate){
                if (maxMonCnt != 0 && maxMonCnt < (parseInt(this.APPTOBJCTRLDTOS[k].MONAPPTCNT) +  + this.data.chooseApptMonDateDtls[m].MONCNT)) {
                  return "超过每户每月最大预约标的数量("+this.APPTOBJCTRLDTOS[k].MONDATE+")";
                }
                break;
              }  
            }
            break;
          }  
        }
      }
    }else{//按下单时间的控制判断
      let curDayCnt = this.APPTCTRLINFODTO ? this.APPTCTRLINFODTO.DAYCNT : 0;
      if (maxDayCnt != 0 && maxDayCnt < curDayCnt + this.data.CHOOSECNT) {
        return "超过每户每天预约下单数量上限";
      }
      let curWeekCnt = this.APPTCTRLINFODTO ? this.APPTCTRLINFODTO.WEEKCNT : 0;
      if (maxWeekCnt != 0 && maxWeekCnt < curWeekCnt + this.data.CHOOSECNT) {
        return "超过每户每周预约下单数量上限";
      }
      let curMonCnt = this.APPTCTRLINFODTO ? this.APPTCTRLINFODTO.MONTHCNT : 0;
      if (maxMonCnt != 0 && maxMonCnt < curMonCnt + this.data.CHOOSECNT) {
        return "超过每户每月预约下单数量上限";
      }
    }
    return '';
  },
  requestApptObjInfo: function () {
    this.showLoading(!0);
    var data = {
      // 'custId': '3048000060',
      'custId': app.storage.getLoginInfo().custId,
    };
    var that = this;
    var res = app.req.postRequest(apiUtil.queryApptObjInfo,data).then(function (res) {
      // console.log("返回结果:" + JSON.stringify(res.data));
      if (res.data.respCode == '000') {
        let apptObjs=[];
        for (var i = 0; i < res.data.apptObjInfoDtos.length;i++){
          if (that.objId == res.data.apptObjInfoDtos[i].objId){
            that.advApptDay = res.data.apptObjInfoDtos[i].advApptDay;
            that.APPTOBJINFO = res.data.apptObjInfoDtos[i];
            that.APPTCTRLTYPE = res.data.apptObjInfoDtos[i].apptCtrlType;
          }
          let apptObj={};
          apptObj.value = res.data.apptObjInfoDtos[i].objId;
          apptObj.text = res.data.apptObjInfoDtos[i].objName;
          apptObjs.push(apptObj);
        }
        that.setData({ 'OBJINFOS': apptObjs});
      } else {
        //接口返回错误
        wx.showToast({
          title: res.data.errDesc + '[' + res.data.respCode + ']',
          icon: 'none'
        })
        // wx.navigateTo({
        //   url: '/subpages/appt/common_fail?msg=' + res.data.ERRDESC
        // })

      }

      that.requestApptTimeDtls();
    });
  },
  requestApptTimeDtls:function(){
    var data = {
      'custId': app.storage.getLoginInfo().custId,
      'objId':this.objId,
      'houseSeqId': app.storage.getLoginInfo().houseSeqId,
      'advApptDay':this.advApptDay,
      'apptCtrlType': this.APPTCTRLTYPE
    };
    // var data = {
    //   'custId': '3048000060',
    //   'objId': this.objId,
    //   'houseSeqId': '00001',
    //   'advApptDay': this.advApptDay,
    //   'apptCtrlType': this.APPTCTRLTYPE
    // };
    var that = this;
    var res = app.req.postRequest(apiUtil.queryApptTimeDtl,data).then(function (res) {
      // console.log("返回结果:" + JSON.stringify(res.data));
      if (res.data.RESPCODE == '000') {
        that.setData({ 'APPTTIMEDTLDTOS': res.data.APPTTIMEDTLDTOS, 'APPTOBJDTLDTOS': res.data.APPTOBJDTLDTOS,'APPTDATES': res.data.APPTDATES,'isLoading': false});
        that.APPTCTRLINFODTO = res.data.APPTCTRLINFODTO;
        that.APPTOBJCTRLDTOS=res.data.APPTOBJCTRLDTOS;
      } else {
        //接口返回错误
        // wx.navigateTo({
        //   url: '/subpages/appt/common_fail?msg=' + res.data.ERRDESC
        // })
        wx.showToast({
          title: res.data.ERRDESC + '[' + res.data.RESPCODE + ']',
          icon: 'none'
        })
      }
      that.showLoading(!1);
    });
  },
  doliqTrans:function(){
    var app = getApp();
    // var data = {
    //   'custId': '6000000013',
    //   'objId': this.objId,
    //   'houseSeqId': '00018',
    //   'huSeqId': '10000032',
    //   'ordDtlJson': JSON.stringify(this.chooseTimeDtls)
    // };
    if (this.chooseTimeDtls.length<1){
      return;
    }
    let huStat=app.storage.getLoginInfo().huStat;
    if(huStat=='P'){
      let loginErrDesc=app.storage.getLoginInfo().loginErrDesc;
      let loginDesc=loginErrDesc&&loginErrDesc!=''?loginErrDesc:'您当前房屋未绑定，如需继续使用，请请前往物业进行绑定。';
      this.setData({'isShowDialog':true,'showDialogDesc':loginDesc});
      return;
    }
    var data = {
      'custId': app.storage.getLoginInfo().custId,
      'objId': this.objId,
      'houseSeqId': app.storage.getLoginInfo().houseSeqId,
      'huSeqId': app.storage.getLoginInfo().huSeqId,
      'ordDtlJson': JSON.stringify(this.chooseTimeDtls)
    };
    var that = this;
    var res = app.req.postRequest(apiUtil.addApptOrdLog,data).then(function (res) {
      console.log("返回结果:" + JSON.stringify(res.data));
      if (res.data.RESPCODE == '000') {
        wx.navigateTo({
          url: '/subpages/appt/apptOrd_confirm?ordDate=' +res.data.ORDDATE+'&ordSeqId='+res.data.ORDSEQID
        })
      } else {
        //接口返回错误
        wx.showToast({
          title: res.data.ERRDESC + '[' + res.data.RESPCODE + ']',
          icon: 'none'
        })
      }
    });
  },
  closeInstru:function(){
    this.setData({'isShowDialog':false});
  }
})