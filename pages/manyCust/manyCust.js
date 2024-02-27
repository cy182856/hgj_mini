import { transferHouseUsrInfo } from '../../const/api';
import Toast from './../../miniprogram_npm/@vant/weapp/dialog/dialog';
const api = require('../../const/api'),
app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    radio: '0',

    pubOrgId:'',
    hgjModuleId:'00',

    objList:null,

    huSeqId:'',
    custId:'',
    desc:'Hi，欢迎来到智慧社区服务平台。\n'+
      '1）平台可提供以下业主日常所需服务：公告、通知、报修、投票、缴费、'+'文件公示、邻里圈、访客、场地预约、门禁、车辆、充电桩等；\n'+
      '2）服务仅对业主部分开放，您可向所属的物业公司人员咨询入驻流程；'
  },



  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //初始化
    app.loading(),this.showLoading(0);
    //参数
    let pubOrgId = options['pubOrgId'];
    let hgjModuleId = options['hgjModuleId'];
    this.initParam(pubOrgId,hgjModuleId);
    //判断是否已经登录
    if(!this.isLogin(pubOrgId)){
      this.toMainPage();
      return;
    }
    //加载多账户数据
    this.queryManyCust();

  },
  //初始化参数数据
  initParam(pubOrgId,hgjModuleId){
    this.setData({
      pubOrgId:pubOrgId,
      hgjModuleId:hgjModuleId,
    })
  },
  isLogin(pubOrgId){
    let info = app.storage.getLoginInfo();
    console.log('info========>',info);
    if(info == null || info == '' || info.pubOrgId != pubOrgId){
      return true;
    }else {
      let custId = info.custId;
      let huSeqId = info.huSeqId;
      this.setData({
        huSeqId:huSeqId,
        custId:custId,
      })
      return false;
    }
  },
 //加载多账户数据
  queryManyCust(){
    let pubOrgId = this.data.pubOrgId;
    let hgjModuleId = this.data.hgjModuleId;
    let that = this;
    if(pubOrgId==undefined || pubOrgId == ''){
      Toast.alert({message:"关键信息未配置，无法选择账户"}).then(()=>{
        // that.toErrorPage("关键信息未配置，无法选择账户");
      })
      return;
    }
    this.showLoading(1);
    wx.login({
      success:res=>{
        app.req.postRequest(api.queryManyCust,{pubOrgId:pubOrgId,code:res.code}).then(res=>{
          that.showLoading(0);
          let data = res.data;
          if(data.respCode == '000'){
            let countNum = data.huHgjBindList.length;
            if(countNum == 1){
              console.log('当前只有一个账户在该小区，直接进行登录操作');
              let obj = data.huHgjBindList[0];
              this.toMain(obj.custId,obj.huSeqId,obj.hgjModuleId);
              return true;
            }
            that.setData({
              objList:data.huHgjBindList,
            })
          }else{
            // Toast.alert({message:data.errDesc}).then(()=>{
            //   that.toErrorPage(data.errDesc);
            // })
            that.showErrDesc(res);
          }
        });
      },
    })
  },

  //选中了用户，去主页登录
  toMainPage(){
    let data = this.data;
    let custId = data.custId;
    let huSeqId = data.huSeqId;
    let hgjModuleId = data.hgjModuleId;
    if(custId == undefined || huSeqId == undefined  || custId == '' || huSeqId == ''){
      Toast.alert({message:'请选择一个账户登录'});
      return;
    }
    let param = 'custId='+custId+'&huSeqId='+huSeqId+'&hgjModuleId='+hgjModuleId;
    console.log('param========>',param);
    wx.redirectTo({
      url: '../main/main?'+param,
    })
  },

  toMain(custId,huSeqId,hgjModuleId){
    if(custId == undefined || huSeqId == undefined  || custId == '' || huSeqId == ''){
      Toast.alert({message:'关键信息缺失，登录失败'});
      return;
    }
    let param = 'custId='+custId+'&huSeqId='+huSeqId+'&hgjModuleId='+hgjModuleId;
    console.log('param========>',param);
    wx.redirectTo({
      url: '../main/main?'+param,
    })
  },
  // //对已经登录的用户直接做直接登录操作
  // toMainForHasLogin(){
  //   wx.redirectTo({
  //     url: '../main/main?custId'+this.data.custId+'&hgjModuleId='+this.data.hgjModuleId+,
  //   })
  // },

  //去错误提示页面
  toErrorPage(errmsg){
    wx.redirectTo({
      url: '../noauth/noauth?errDesc='+errmsg,
    })
  },

  //切换选择
  onChange(event) {
    this.setData({
      radio: event.detail,
    });
  },

  //当前选中的
  onClick(event) {
    const { cust,hu,name } = event.currentTarget.dataset;
    console.log('选中了',event);
    this.setData({
      radio: name,
      custId:cust,
      huSeqId:hu,
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

  showErrDesc:function(res){
    var that = this;
    if(res.data.errCode == '01012012'){
      var errDesc = res.data.errDesc;
      if(errDesc.indexOf("账户未开通")!=-1){
        errDesc = that.data.desc
      }
      Toast.alert({
        messageAlign: 'left',
        message:errDesc
      }).then(()=>{
        wx.reLaunch({
          url: '../noauth/noauth?errDesc='+errDesc,
        })
      })
    }else{
      Toast.alert({message:res.data.errDesc}).then(()=>{
        wx.reLaunch({
          url: '../noauth/noauth?errDesc='+res.data.errDesc,
        })
      })
    }
  }
})