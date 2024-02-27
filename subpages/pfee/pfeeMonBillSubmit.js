// subpages/pfee/pfeeMonBillSubmit.js
import Toast from '../../miniprogram_npm/@vant/weapp/toast/toast';
import Dialog from '../../miniprogram_npm/@vant/weapp/dialog/dialog';
const app = getApp();
const api = require('../../const/api');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    shortName:"",
    houseName:"",
    currYearMon:"",
    // pfeeMonBillDtos: "",
    pfeePayMon: "",
    earliestBillMon: "",
    lastestBillMon: "",
    pfeePayMonDesc: "",
    ordAmt: 0,
    pfeeYearBillVos: "",
    selectedBillMons: "",
    pfeeRemark: "",
    checkboxArr:"",
    selectedColor:"",
    checkboxAllMon: false,
    rightIconBtm: '3'
  },

  initWxss: function(){
    let rightIconBtm = 3
    let platform = wx.getSystemInfoSync().platform;
    console.log('platform=======>',platform);
    if(platform == 'android'){
      rightIconBtm = 10
    }
    this.setData({rightIconBtm : rightIconBtm})
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // app.loading();
    // this.initYearMon();
    // this.queryBasePfeeInfo();

    // let loginInfo = app.storage.getLoginInfo();
    // let shortName = loginInfo.commanyShortName;
    // let houseName = loginInfo.completeAddr;
    // this.setData({
    //   shortName: shortName,
    //   houseName: houseName
    // });
    this.initWxss()
    console.log(this.getLastMonth('20201'));
  },
  initYearMon: function(){
    let date = new Date();
    let month = date.getMonth()+1<10? '0'+date.getMonth()+1 : date.getMonth()+1;
    let yearMon=date.getFullYear().toString()+month.toString();
    this.setData({
      currYearMon: yearMon
    });
  },
  queryBasePfeeInfo: function(){
    this.showLoading(true);
    app.req.postRequest(api.queryPfeeInfo).then(value => {
      this.showLoading(false);
      if(value.data.respCode != '000'){
        Toast('['+value.data.respCode+']'+value.data.errDesc);
        return;
      }
      let pfeePayMon = value.data.pfeePayMon;
      let pfeePayMonDesc = pfeePayMon.substring(0,4)+'年'+pfeePayMon.substring(4)+'月';
      let earliestBillMon  =  value.data.earliestBillMon;
      let lastestBillMon  =  value.data.lastestBillMon;
      let pfeePayCyc = value.data.pfeePayCyc;
      let isPfeeSpan = value.data.isPfeeSpan;
      let pfeeRemark = value.data.pfeeRemark;
      if((isPfeeSpan == "N" && pfeePayMon == "")){
        Dialog.alert({
          message: '请联系物业配置您的房屋缴清月份'
        })
      }else if((isPfeeSpan == "N" && pfeePayMon < this.getLastMonth(earliestBillMon))){//不可跨月，且房屋缴清日期小于企业配置日期
        Dialog.alert({
          message: '请联系物业(房屋缴清日期小于企业配置日期)'
        })
      }

      // pfeePayCyc = 'Q';
      this.setData({
        pfeePayMon: pfeePayMon,
        pfeePayMonDesc: pfeePayMonDesc,
        lastestBillMon: lastestBillMon,
        earliestBillMon: earliestBillMon,
        pfeePayCyc: pfeePayCyc,
        isPfeeSpan: isPfeeSpan,
        pfeeRemark: pfeeRemark
      });

      this.queryYearPfeeBillMon();
    });
  },
  queryYearPfeeBillMon: function(){
    let pfeePayMon = this.data.pfeePayMon;
    let lastestBillMon = this.data.lastestBillMon;
    if(parseInt(pfeePayMon)>=parseInt(lastestBillMon)){
      return;
    }
    let startBillMon ;
    if(pfeePayMon == ''){
      startBillMon = this.data.earliestBillMon;
    }else{
      startBillMon = this.getNextMonth(pfeePayMon);
    }

    //20210617  查询起始月份在哪个月，更改为从该季度第一个月查
    // startBillMon = this.getJDFirstBillMon(startBillMon);
    
    let endBillMon = lastestBillMon;
    let condition = {startBillMon : startBillMon, endBillMon : endBillMon};
    this.showLoading(true);
    app.req.postRequest(api.queryPfeeMonBillGBYear, condition).then(value => {
      this.showLoading(false);
      if(value.data.respCode != '000'){
        Toast('['+value.data.respCode+']'+value.data.errDesc);
        return;
      }
      let pfeeYearBillVos = value.data.pfeeYearBillVos;
      this.setData({
        pfeeYearBillVos: pfeeYearBillVos,
      });
      this.initSelectArr();
      this.initCheckboxArr();
    });
  },

  initSelectArr: function(){
    let selectBillMon = this.getSelectBillMon();//获取选中月份
    let pfeeYearBillVos = this.data.pfeeYearBillVos;
    let selectedBillMons = new Array();
    for(let i=0; i<pfeeYearBillVos.length; i++){
      selectedBillMons[i] = new Array();
      let pfeeMonBillDtos = pfeeYearBillVos[i].pfeeMonBillDtos;
      for(let j=0; j<pfeeMonBillDtos.length; j++){
        if(pfeeMonBillDtos[j].stat == 'I'){
          // selectedBillMons[i][j] = pfeeMonBillDtos[j].billMon;//全选
          let billMon = pfeeMonBillDtos[j].billMon;
          if(selectBillMon.includes(billMon)){
            selectedBillMons[i][j] = billMon;
          }else{
            selectedBillMons[i][j] = '';
          }
        }
      }
    }
    this.setData({
      selectedBillMons: selectedBillMons
    });
  },
  //不全选中时，获取需要选中当前几个月
  getSelectBillMon: function(){
    let pfeeYearBillVos = this.data.pfeeYearBillVos;
    let pfeePayCyc = this.data.pfeePayCyc;
    let pfeePayCycCnt = 1;
    if(pfeePayCyc == 'Q'){
      pfeePayCycCnt=3;
    }else if(pfeePayCyc == 'H'){
      pfeePayCycCnt=6;
    }else if(pfeePayCyc == 'Y'){
      pfeePayCycCnt=12;
    }

    //只需要取第一年即可
    let billMon = '';
    let pfeeMonBillDtos = pfeeYearBillVos[0].pfeeMonBillDtos;
    for(let j=0; j<pfeeMonBillDtos.length; j++){
      if(pfeeMonBillDtos[j].stat == 'I'){
        billMon = pfeeMonBillDtos[j].billMon;
        break;
      }
    }
    
    let tmpM = parseInt(billMon.substring(4));//第几月
    let tmpQ = parseInt((tmpM-1)/pfeePayCycCnt);//第几-1季度/半年

    let selectBillMons = new Array();
    for(let i=0; i<pfeePayCycCnt; i++){
      let tmpMon = tmpQ*pfeePayCycCnt+(i+1);
      selectBillMons[i] = this.getBillMonFormate(billMon.substring(0,4), tmpMon);
    }
    return selectBillMons;
  },

  initCheckboxArr:function(){
    let pfeeYearBillVos = this.data.pfeeYearBillVos;
    let checkboxArr = new Array();
    for(let i=0; i<pfeeYearBillVos.length; i++){
      checkboxArr[i] = false;
    }
    this.setData({
      checkboxArr: checkboxArr
    });
    this.calcOrdAmt();
  },
  selected: function(e){
    let iy = e.currentTarget.dataset.iy;
    let im = e.currentTarget.dataset.im;
    let billMon = e.currentTarget.dataset.billmon;
    let selectedBillMons = this.data.selectedBillMons;
    let checkboxArr = this.data.checkboxArr;
    let pfeePayCyc = this.data.pfeePayCyc;
    // pfeePayCyc="Q";
    let tmp = selectedBillMons[iy][im];
    let ylentth = selectedBillMons[iy].length;
    
    switch (pfeePayCyc){
      case "M"://按月
        
        if(tmp == ''){
          selectedBillMons[iy][im] = billMon;
        }else{
          selectedBillMons[iy][im] = '';
          checkboxArr[iy] = false;
        }
        break;
      case "Q"://按季度
        let tmpM = parseInt(billMon.substring(4));//第几月
        let tmpQ = parseInt((tmpM-1)/3);//第几-1季度
        let offee = tmpM-im;
        let billMon1 = tmpQ*3+1, billMon2=tmpQ*3+2, billMon3=tmpQ*3+3;
        let im1=billMon1-offee,im2=billMon2-offee,im3=billMon3-offee;
        
        if(tmp == ''){
          if(im1>=0 && im1<ylentth && selectedBillMons[iy][im1] != null)
            selectedBillMons[iy][im1] = this.getBillMonFormate(billMon.substring(0,4), billMon1);
          if(im2>=0 && im2<ylentth && selectedBillMons[iy][im2] != null)
            selectedBillMons[iy][im2] = this.getBillMonFormate(billMon.substring(0,4), billMon2);
          if(im3>=0 && im3<ylentth && selectedBillMons[iy][im3] != null)
            selectedBillMons[iy][im3] = this.getBillMonFormate(billMon.substring(0,4), billMon3);
        }else{
          if(im1>=0 && im1<ylentth && selectedBillMons[iy][im1] != null)
            selectedBillMons[iy][im1] = '';
          if(im2>=0 && im2<ylentth && selectedBillMons[iy][im2] != null)
            selectedBillMons[iy][im2] = '';
          if(im3>=0 && im3<ylentth && selectedBillMons[iy][im3] != null) 
            selectedBillMons[iy][im3] = '';
          checkboxArr[iy] = false;
        }
        break;
      default://默认按月
        if(tmp == ''){
          selectedBillMons[iy][im] = billMon;
        }else{
          selectedBillMons[iy][im] = '';
          checkboxArr[iy] = false;
        }
        break;
    }

    //去掉全选
    let checkboxAllMon = this.data.checkboxAllMon;
    if(checkboxAllMon == true){
      checkboxAllMon = false;
    }

    this.setData({
      selectedBillMons: selectedBillMons,
      checkboxArr: checkboxArr,
      checkboxAllMon: checkboxAllMon
    });
    this.calcOrdAmt();
  },
  //按年全选
  selectAll: function(e){
    let iy = e.currentTarget.dataset.iy;
    let checkboxArr = this.data.checkboxArr;
    checkboxArr[iy] = e.detail;

    let selectedBillMons = this.data.selectedBillMons;
    let pfeeYearBillVos = this.data.pfeeYearBillVos;
    for(let j=0; j<selectedBillMons[iy].length; j++){
      let pfeeMonBillDto = pfeeYearBillVos[iy].pfeeMonBillDtos[j];
      if(e.detail && pfeeMonBillDto.stat == 'I'){
        selectedBillMons[iy][j] = pfeeMonBillDto.billMon;
      }else{
        if(selectedBillMons[iy][j] != null){
          selectedBillMons[iy][j] = '';
        }
      }
    }

    this.setData({
      checkboxArr: checkboxArr,
      selectedBillMons: selectedBillMons
    });
    this.calcOrdAmt();
  },
  //20210618UI大变动按月全选
  selectAllMon: function(e){
    console.log(e.detail);
    let checkboxAllMon = this.data.checkboxAllMon;
    checkboxAllMon = e.detail;

    let selectedBillMons = this.data.selectedBillMons;
    let pfeeYearBillVos = this.data.pfeeYearBillVos;
    for(let i=0; i<selectedBillMons.length; i++){
      for(let j=0; j<selectedBillMons[i].length; j++){
        let pfeeMonBillDto = pfeeYearBillVos[i].pfeeMonBillDtos[j];
        if(e.detail && pfeeMonBillDto.stat == 'I'){
          selectedBillMons[i][j] = pfeeMonBillDto.billMon;
        }else{
          if(selectedBillMons[i][j] != null){
            selectedBillMons[i][j] = '';
          }
        }
      }
    }
    
    this.setData({
      checkboxAllMon: checkboxAllMon,
      selectedBillMons: selectedBillMons
    })
    this.calcOrdAmt();
  },

  calcOrdAmt: function(){
    let ordAmt=0;
    let selectedBillMons = this.data.selectedBillMons;
    let pfeeYearBillVos = this.data.pfeeYearBillVos;
    for(let i=0; i<selectedBillMons.length; i++){
      for(let j=0; j<selectedBillMons[i].length; j++){
        let pfeeMonBillDto = pfeeYearBillVos[i].pfeeMonBillDtos[j];
        let billAmt = parseFloat(pfeeMonBillDto.billAmt)*100;
        if(selectedBillMons[i][j] ==  pfeeMonBillDto.billMon && pfeeMonBillDto.stat == 'I'){
          ordAmt += billAmt;
        }
      }
    }
    // ordAmt = ordAmt;
    this.setData({
      ordAmt: ordAmt
    });
  },

  submitPfee:function(){
    let pfeePayMon = this.data.pfeePayMon;
    let isPfeeSpan = this.data.isPfeeSpan; 
    let earliestBillMon = this.data.earliestBillMon;
    if((isPfeeSpan == "N" && pfeePayMon == "")){
      Dialog.alert({
        message: '请联系物业配置您的房屋缴清月份'
      })
      return false;
    }
    if((isPfeeSpan == "N" && pfeePayMon < this.getLastMonth(earliestBillMon))){//不可跨月，且房屋缴清日期小于企业配置日期
      Dialog.alert({
        message: '请联系物业(房屋缴清日期小于企业配置日期)'
      })
      return false;
    }


    let selectedBillMons = this.data.selectedBillMons;
    let billMons = new Array();
    for(let i=0; i<selectedBillMons.length; i++){
      for(let j=0; j<selectedBillMons[i].length; j++){
        if(selectedBillMons[i][j]!=null && selectedBillMons[i][j] != ''){
          billMons.push(selectedBillMons[i][j]);
        }
      }
    }
    if(billMons.length == 0){
      Dialog.alert({
        message: '请选择需要缴费的月份'
      })
      return false;
    }
    let ordAmt = this.data.ordAmt;
    if(ordAmt == 0){
      Dialog.alert({
        message: '缴费订单总金额不能为0'
      })
      return false;
    }

    //根据isPfeeSpan判断缴费不可间断
    let startBillMon ;
    if(pfeePayMon == ''){
      startBillMon = this.data.earliestBillMon;
    }else{
      startBillMon = this.getNextMonth(pfeePayMon);
    }
    //该逻辑为了防止物业人员配置缴请月份刚好卡在一次支付成功的账单之前失误加的判断
    startBillMon = this.getStartBillMon(startBillMon);
    if(isPfeeSpan == 'N'){
      if(billMons[0] != startBillMon){
        Dialog.alert({
          message: '需从缴清月份之后开始缴费'
        })
        return false;
      }
      for(let i=0;i<billMons.length-1; i++){
        if(billMons[i+1] != this.getNextMonth(billMons[i])){
          Dialog.alert({
            message: '缴费月份不可间断'
          })
          return false;
        }
      }
    }
    
    let condition = {billMons : billMons};
    this.showLoading(true);
    app.req.postRequest(api.submitPfee, condition).then(value => {
      this.showLoading(false);
      console.log(value.data);
      if(value.data.respCode != '000' && value.data.respCode != '100'){
        console.log("提交物业缴费订单失败");
        Dialog.alert({
          message: '['+value.data.respCode+']'+value.data.errDesc
        })
        return;
      }
      if(value.data.respCode == '100'){
        Dialog.confirm({
          message: '存在已经下单的缴费订单,是否先关闭这些订单？',
          asyncClose: true
        }).then(() => {
          setTimeout(() => {
            Dialog.close();
          }, 1000);
          this.cancel(condition);
          this.submitPfee();
        }).catch(() => {
          Dialog.close();
          return;
        });
        return;
      }
      let ordDate = value.data.ordDate;
      let ordSeqId = value.data.ordSeqId;
      this.pay(ordDate, ordSeqId);
    });
  },
  //支付
  pay: function(ordDate, ordSeqId){
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
    this.showLoading(true);
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
      console.log(payinfo.timeStamp);
      wx.requestPayment({
        'timeStamp': payinfo.timeStamp,
        'nonceStr': payinfo.nonceStr,
        'package': payinfo.package,
        'signType': payinfo.signType,
        'paySign': payinfo.paySign,
        'success':function(res){
          console.log("success");
          console.log(res);
          Toast('支付成功');
        },
        'fail':function(res){
          console.log("fail");
          Toast('支付失败,请稍后重试');
        },
        'complete':function(res){
          console.log("complete");
          wx.navigateTo({
            url: 'pfeeOrdLogList'
          })
        }
      })
      Toast.clear();
    });
  },
  //取消已经落单的订单
  cancel: function(condition){
    this.showLoading(true);
    app.req.postRequest(api.closeInitPayPfeeOrdLog, condition).then(value => {
      this.showLoading(false);
      if(value.data.respCode != '000' && value.data.respCode != '100'){
        console.log("提交物业缴费订单失败");
        Toast.fail('['+value.data.respCode+']'+value.data.errDesc);
        return;
      }
    });  
  },


  toPfeeMonBill(){
    wx.navigateTo({
      url: 'pfeeMonBill'
    })
  },
  toOrdList(){
    wx.navigateTo({
      url: 'pfeeOrdLogList'
    })
  },
  getStartBillMon(startbillMon_){
    let tmpmon = startbillMon_;
    let pfeeYearBillVos = this.data.pfeeYearBillVos;
    for(let j=0; j<pfeeYearBillVos.length; j++){
      let pfeeMonBillDtos = pfeeYearBillVos[j].pfeeMonBillDtos;
      for(let i=0; i<pfeeMonBillDtos.length; i++){
        let pfeeMonBillDto = pfeeMonBillDtos[i];
        if(pfeeMonBillDto.stat == 'S' && pfeeMonBillDto.billMon  == tmpmon){
          tmpmon = this.getNextMonth(tmpmon)
        }else{
          console.log("可以开始缴费月份应该为====>："+tmpmon);
          return tmpmon;
        }
      }
    }
    return startbillMon_;
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
    // this.onLoad();
    app.loading();
    this.initYearMon();
    this.queryBasePfeeInfo();

    let loginInfo = app.storage.getLoginInfo();
    let shortName = loginInfo.commanyShortName;
    let houseName = loginInfo.completeAddr;
    this.setData({
      shortName: shortName,
      houseName: houseName
    });
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
  getNextMonth: function(date) {
    date=date.substring(0,4)+'-'+date.substring(4)+'-'+'15';//15号解决不同国家时区问题
    var now = new Date(date);
    var ds = new Date(now.setMonth(now.getMonth() + 1));
    var year = ds.getFullYear();
    var mon = ds.getMonth() + 1;
    var day = ds.getDate();
    var s = year + "" + (mon < 10 ? ('0' + mon) : mon) ;
    return s;
  },

  getLastMonth: function(date) {
    date=date.substring(0,4)+'-'+date.substring(4)+'-'+'15';
    var now = new Date(date);
    var ds = new Date(now.setMonth(now.getMonth() - 1));
    var year = ds.getFullYear();
    var mon = ds.getMonth() + 1;
    var day = ds.getDate();
    var s = year + "" + (mon < 10 ? ('0' + mon) : mon) ;
    return s;
  },

  getBillMonFormate: function(year, mon){
    if(mon<10){
      return year.toString()+'0'+mon;
    }else{
      return year.toString()+mon;
    }
  },

  getJDFirstBillMon: function(billMon){
    let year = billMon.substring(0, 4);
    let mon = billMon.substring(4, 6);
    let jd = parseInt((parseInt(billMon.substring(4,6))-1)/3) + 1;//季度
    mon = (jd-1)*3+1;
    if(mon < 10){
      billMon = year + '0' + mon
    }else{
      billMon = year + mon
    }
    return billMon;
  }

})