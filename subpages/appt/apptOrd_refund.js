const app = getApp();
const apptInfo = require('./apptInfo.js');
const apiUtil = require('../../const/api.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    'REFUNDAMT':0,
    'ISREFUNDALL':true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.loading(), this.showLoading(!1);
    let ordDate = options.ordDate;
    let ordSeqId = options.ordSeqId;
    this.refundAmt=0;
    this.refundInfo=[];
    this.chnlRefundInfo=[];
    this.ordDate = ordDate;
    this.ordSeqId = ordSeqId;
    this.requestApptOrdInfo();
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
  refundAdd:function(event){
    let objCnt = event.currentTarget.dataset.objcnt;
    let apptPrice = event.currentTarget.dataset.apptprice;
    let dtlId = event.currentTarget.dataset.dtlid;
    this.refundAmt = (parseFloat(this.refundAmt) + parseFloat(apptPrice)).toFixed(2);
         
    if (this.refundInfo.length==0){
      let refundDtl={};
      refundDtl.ordDate=this.ordDate;
      refundDtl.ordSeqId=this.ordSeqId;
      refundDtl.dtlId=dtlId;
      refundDtl.objCnt=1;
      refundDtl.refUsrSeq = app.storage.getLoginInfo().huSeqId;
      refundDtl.apptPrice = apptPrice;
      this.refundInfo.push(refundDtl);

      if(parseFloat(apptPrice).toFixed(2)!=parseFloat('0.00').toFixed(2)){
         this.chnlRefundInfo.push(refundDtl);
      }
    }else{
      let isMatched=false;
      for(let i=0;i<this.refundInfo.length;i++){
        if (this.refundInfo[i].dtlId==dtlId){
          this.refundInfo[i].objCnt = parseInt(this.refundInfo[i].objCnt)+1;
          isMatched=true;
        }
      }
      if (!isMatched){
        let refundDtl = {};
        refundDtl.ordDate = this.ordDate;
        refundDtl.ordSeqId = this.ordSeqId;
        refundDtl.dtlId = dtlId;
        refundDtl.objCnt = 1;
        refundDtl.apptPrice = apptPrice;
        refundDtl.refUsrSeq = app.storage.getLoginInfo().huSeqId;
        this.refundInfo.push(refundDtl);
      }

      if(parseFloat(apptPrice).toFixed(2)!=parseFloat('0.00').toFixed(2)){
        let isChnlMatched=false;
        for(let i=0;i<this.chnlRefundInfo.length;i++){
          if (this.chnlRefundInfo[i].dtlId==dtlId){
            this.chnlRefundInfo[i].objCnt = parseInt(this.chnlRefundInfo[i].objCnt)+1;
            isChnlMatched=true;
          }
        }
        if (!isChnlMatched){
          let refundDtl = {};
          refundDtl.ordDate = this.ordDate;
          refundDtl.ordSeqId = this.ordSeqId;
          refundDtl.dtlId = dtlId;
          refundDtl.objCnt = 1;
          refundDtl.apptPrice = apptPrice;
          refundDtl.refUsrSeq = app.storage.getLoginInfo().huSeqId;
          this.chnlRefundInfo.push(refundDtl);
        }  
      }
    }
    this.isRefundAll();
    this.setData({ 'REFUNDAMT': this.refundAmt });
  },
  refundSub:function(event){
    let objCnt = event.currentTarget.dataset.objcnt;
    let apptPrice = event.currentTarget.dataset.apptprice;
    let dtlId = event.currentTarget.dataset.dtlid;
    this.refundAmt = (parseFloat(this.refundAmt) - parseFloat(apptPrice)).toFixed(2);
    if (this.refundAmt<0){
       return;
    }

    for (let i = 0; i < this.refundInfo.length; i++) {
      if (this.refundInfo[i].dtlId == dtlId) {
        if (this.refundInfo[i].objCnt==1){
          this.refundInfo.splice(i, 1);
        }else{
          this.refundInfo[i].objCnt = parseInt(this.refundInfo[i].objCnt)-1;
        }
      }
    }

    if(parseFloat(apptPrice).toFixed(2)!=parseFloat('0.00').toFixed(2)){
      for (let i = 0; i < this.chnlRefundInfo.length; i++) {
        if (this.chnlRefundInfo[i].dtlId == dtlId) {
          if (this.chnlRefundInfo[i].objCnt==1){
            this.chnlRefundInfo.splice(i, 1);
          }else{
            this.chnlRefundInfo[i].objCnt = parseInt(this.chnlRefundInfo[i].objCnt)-1;
          }
        }
      }
    }
    
    this.isRefundAll();
    this.setData({ 'REFUNDAMT': this.refundAmt});
  },
  isRefundAll:function(){
    if (this.refundInfo.length==0){
      this.setData({ 'ISREFUNDALL': true });
    }else{
      this.setData({ 'ISREFUNDALL': false });
    }
  },
  requestApptOrdInfo: function () {
    this.showLoading(!0);
    this.payinfo = '';
    var data = {
      'custId': app.storage.getLoginInfo().custId,
      'ordBeginDate': this.ordDate,
      'ordEndDate': this.ordDate,
      'ordSeqId': this.ordSeqId,
      'pageNum': 1,
      'pageSize': 10
    };
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
        that.setData({ 'APPTORDLOGDTOS': res.data.APPTORDLOGDTOS });
      } else {
        //接口返回错误
        wx.showToast({
          title: res.data.ERRDESC + '[' + res.data.RESPCODE + ']',
          icon: 'none'
        })
        // wx.navigateTo({
        //   url: '/subpages/appt/common_fail?msg=' + res.data.ERRDESC
        // })
      }
      that.showLoading(!1);
    });
  },
  doOrdRefund:function(){
    if(this.refundInfo.length==0){
      wx.showModal({
        title: '操作提示',
        content: '退款笔数未选中',
        showCancel: false,
        success(res) {
          if (res.confirm) {
          }
        }
      });
      return false;
    }
    var that = this;
    wx.showModal({
      title: '操作提示',
      content: '确定退款?',
      showCancel: true,
      success(res) {
        if (res.confirm) {
          var data = {
            'custId': app.storage.getLoginInfo().custId,
            'ordDate': that.ordDate,
            'ordSeqId': that.ordSeqId,
            'processStat': apptInfo.refund,
            'ordDtlJson': JSON.stringify(that.refundInfo),
            'refUsrSeq': app.storage.getLoginInfo().huSeqId
          };
          that.showLoading(!0);
          var res = app.req.postRequest(apiUtil.preApptOrdProcess,data).then(function (res) {
            console.log("返回结果:" + JSON.stringify(res.data));
            that.showLoading(!1);
            if (res.data.RESPCODE == '000') {
              if(that.chnlRefundInfo.length==0){
                wx.showModal({
                  title: '操作提示',
                  content: '退款成功',
                  showCancel: false,
                  success(res) {
                    if (res.confirm) {
                      wx.redirectTo({
                        url: '/subpages/appt/mine_appt'
                      })
                    }
                  }
                });
              }else{
                let refundData={
                  'custId': app.storage.getLoginInfo().custId,
                  'refAmt': that.data.REFUNDAMT,
                  'busiId': apptInfo.busiId,
                  'ordDate': that.ordDate,
                  'ordSeqId': that.ordSeqId,
                  'payDate': that.data.APPTORDLOGDTOS[0].PAYDATE ? that.data.APPTORDLOGDTOS[0].PAYDATE:'',
                  'paySeqId': that.data.APPTORDLOGDTOS[0].PAYSEQID ? that.data.APPTORDLOGDTOS[0].PAYSEQID:'',
                  'huSeqId': app.storage.getLoginInfo().huSeqId,
                  'houseSeqId': app.storage.getLoginInfo().houseSeqId,
                  'extension': JSON.stringify(that.refundInfo),
                }
                that.ordRefund(refundData);
              }
            } else {
              //接口返回错误
              wx.showToast({
                title: res.data.ERRDESC + '[' + res.data.RESPCODE + ']',
                icon: 'none'
              })
            }
          });
        }
      }
    });
   
  },
  doRefundAll:function(){
     let  refundInfos=[];
     let chnlRefundInfos=[];
     let refundSumAmt =0;
     for(let i=0;i<this.data.APPTORDLOGDTOS.length;i++){
       let APPTORDDTLDTOS = this.data.APPTORDLOGDTOS[i].APPTORDDTLDTOS;
       for (let k = 0; k < APPTORDDTLDTOS.length; k++) {
         if (APPTORDDTLDTOS[k].STAT == 'S' || APPTORDDTLDTOS[k].STAT == 'P' || APPTORDDTLDTOS[k].STAT == 'O'){
           let objCnt = APPTORDDTLDTOS[k].OBJCNT - APPTORDDTLDTOS[k].CANCELCNT - APPTORDDTLDTOS[k].ONCANCELCNT;
           if (objCnt>0){
             refundSumAmt = (parseFloat(refundSumAmt) + objCnt*parseFloat(APPTORDDTLDTOS[k].APPTPRICE)).toFixed(2);
             let refundData = {};
             refundData.ordDate = this.ordDate;
             refundData.ordSeqId = this.ordSeqId;
             refundData.dtlId = APPTORDDTLDTOS[k].DTLID;
             refundData.objCnt = objCnt;
             refundData.apptPrice = APPTORDDTLDTOS[k].APPTPRICE ;
             refundData.refUsrSeq = app.storage.getLoginInfo().huSeqId;
             refundInfos.push(refundData);

             if(parseFloat(APPTORDDTLDTOS[k].APPTPRICE).toFixed(2)!=parseFloat('0.00').toFixed(2)){
              chnlRefundInfos.push(refundData);
             }
          }
         } 
       }
     } 

    if (refundInfos.length == 0) {
      wx.showModal({
        title: '操作提示',
        content: '没有可退款的笔数',
        showCancel: false,
        success(res) {
          if (res.confirm) {
          }
        }
      });
      return false;
    }
    var that = this;
    wx.showModal({
      title: '操作提示',
      content: '确认全部退款？',
      showCancel: true,
      success(res) {
        if (res.confirm) {
          var data = {
            'custId': app.storage.getLoginInfo().custId,
            'ordDate': that.ordDate,
            'ordSeqId': that.ordSeqId,
            'processStat': apptInfo.refund,
            'ordDtlJson': JSON.stringify(refundInfos),
            'refUsrSeq': app.storage.getLoginInfo().huSeqId
          };
          that.showLoading(!0);
          var res = app.req.postRequest(apiUtil.preApptOrdProcess, data).then(function (res) {
            console.log("返回结果:" + JSON.stringify(res.data));
            that.showLoading(!1);
            if (res.data.RESPCODE == '000') {
              if(chnlRefundInfos.length==0){
                wx.showModal({
                  title: '操作提示',
                  content: '退款成功',
                  showCancel: false,
                  success(res) {
                    if (res.confirm) {
                      wx.redirectTo({
                        url: '/subpages/appt/mine_appt'
                      })
                    }
                  }
                });
              }else{
                let refundData = {
                  'custId': app.storage.getLoginInfo().custId,
                  'refAmt': refundSumAmt,
                  'busiId': apptInfo.busiId,
                  'ordDate': that.ordDate,
                  'ordSeqId': that.ordSeqId,
                  'payDate': that.data.APPTORDLOGDTOS[0].PAYDATE ? that.data.APPTORDLOGDTOS[0].PAYDATE : '',
                  'paySeqId': that.data.APPTORDLOGDTOS[0].PAYSEQID ? that.data.APPTORDLOGDTOS[0].PAYSEQID : '',
                  'huSeqId': app.storage.getLoginInfo().huSeqId,
                  'houseSeqId': app.storage.getLoginInfo().houseSeqId,
                  'extension': JSON.stringify(chnlRefundInfos),
                }
                that.ordRefund(refundData);
              }
            } else {
              //接口返回错误
              wx.showToast({
                title: res.data.ERRDESC + '[' + res.data.RESPCODE + ']',
                icon: 'none'
              })
            }
          });
        }
      }
    });
  },
  ordRefund:function(data){
    this.showLoading(!0);
    let that=this;
    var res = app.req.postRequest(apiUtil.minProgramRefundUrl,data).then(function (res) {
      console.log("返回结果:" + JSON.stringify(res.data));
      that.showLoading(!1);
      if (res.data.RESPCODE == '000') {
        wx.showModal({
          title: '操作提示',
          content: '退款处理中,请稍后查询结果',
          showCancel: false,
          success(res) {
            if (res.confirm) {
              wx.redirectTo({
                url: '/subpages/appt/mine_appt'
              })
            }
          }
        });
      } else {
        //接口返回错误
        wx.showToast({
          title: res.data.ERRDESC + '[' + res.data.RESPCODE + ']',
          icon: 'none'
        })
      }
    });
  }
})