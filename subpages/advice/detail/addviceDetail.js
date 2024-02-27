// subpages/advice/add/addAdvice.js
import Toast from '../../../miniprogram_npm/@vant/weapp/dialog/dialog';
const app = getApp();
const api = require('../../../const/api.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    activeNames: ['1'],

    obj:null,
    msgObj:null,
    rateScore:'',

    isLogin:'',
    custId:'',
    wxOpenId:'',
    adviceType:'',
    adviceDate:'',
    adviceSeqId:'',

    title:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //初始化loading
    app.loading(),this.showLoading(0);
    //获取基本参数
    let custId = options['custId'];
    let wxOpenId = options['wxOpenId'];
    let isLogin = options['isLogin'];
    let adviceType = options['adviceType'];
    let adviceDate = options['adviceDate'];
    let adviceSeqId = options['adviceSeqId'];
    //初始化参数
    this.initParam(custId,wxOpenId,isLogin,adviceType,adviceDate,adviceSeqId);
    //加载初始详情数据
    this.getDetailInfo(adviceDate,adviceSeqId,custId);
  },
  //初始化参数
  initParam(custId,wxOpenId,isLogin,adviceType,adviceDate,adviceSeqId){
    this.setData({
      isLogin:isLogin,
      custId:custId,
      wxOpenId:wxOpenId,
      adviceType:adviceType,
      adviceDate:adviceDate,
      adviceSeqId:adviceSeqId,
    })
    

    this.getTitleName(adviceType);
   
  },
  getTitleName(adviceType){
    let title = '';
    if(adviceType == 'C'){
      title = '投诉详情';
    }else if(adviceType=='A'){
      title = '建议详情';
    }else if(adviceType=='P'){
      title = '表扬详情';
    }
    this.setData({title:title});
    if(title != ''){
      wx.setNavigationBarTitle({
        title: title,
      })
    }
  },
  //详情数据
  getDetailInfo(adviceDate,adviceSeqId,custId,isLogin){
    this.showLoading(1);
    let that = this;
    app.req.postRequest(api.queryAdviceDetail,{adviceDate:adviceDate,adviceSeqId:adviceSeqId,custId:custId,isLogin:isLogin}).then(res=>{
      that.showLoading(0);
      console.log('投诉建议详细信息：',res);
      let data = res.data;
      if(data.respCode == '000'){
        that.setData({
          obj:data,
        })
        let title = that.data.title;
        if(title == ''){
          this.getTitleName(data.adviceType);
        }
      }else{
        Toast.alert({message:data.errDesc});
      }
    })
  },
  //切换反馈过程展开
  onChange(event) {
    this.setData({
      activeNames: event.detail,
    });
  },

  //取消反馈
  cancelAdvice(){
    let adviceDate = this.data.adviceDate;
    let adviceSeqId = this.data.adviceSeqId;
    let wxOpenId = this.data.wxOpenId;
    let huSeqId = this.data.obj.huSeqId;
    let that = this;
    this.showLoading(1);
    app.req.postRequest(api.cancelAdvice,{
      adviceDate:adviceDate,
      adviceSeqId:adviceSeqId,
      wxOpenId:wxOpenId,
      huSeqId:huSeqId,
    }).then(res=>{
      that.showLoading(0);
      let data = res.data;
      if(data.respCode == '000'){
        Toast.alert({message:'您的反馈已经取消!'}).then(()=>{
          that.reloadPage();
        })
      }else{
        Toast.alert({message:data.errDesc});
      }
    })
  },

  //确认反馈完成
  finishAdvice(){
    let adviceDate = this.data.adviceDate;
    let adviceSeqId = this.data.adviceSeqId;
    let wxOpenId = this.data.wxOpenId;
    let huSeqId = this.data.obj.huSeqId;
    let that = this;
    if((wxOpenId == undefined || wxOpenId == '') && (huSeqId == undefined||huSeqId == '')){
      Toast.alert({message:'关键信息缺失，无法进行确认'});
      return;
    }
    if(adviceDate == undefined || adviceSeqId == undefined){
      Toast.alert({message:'关键信息缺失，无法进行确认'});
      return;
    }
    this.showLoading(1);
    app.req.postRequest(api.finishAdvice,{
      adviceDate:adviceDate,
      adviceSeqId:adviceSeqId,
      wxOpenId:wxOpenId,
      huSeqId:huSeqId,
    }).then(res=>{
      that.showLoading(0);
      let data = res.data;
      if(data.respCode == '000'){
        Toast.alert({message:'确认反馈成功!'}).then(()=>{
          that.reloadPage();
        })
      }else{
        Toast.alert({message:data.errDesc});
      }
    })
  },

  //评价
  pingjia(){
    let adviceDate = this.data.adviceDate;
    let adviceSeqId = this.data.adviceSeqId;
    let rateScore = this.data.rateScore;
    let wxOpenId = this.data.wxOpenId;
    let huSeqId = this.data.obj.huSeqId;
    let that = this;
    if(rateScore < 1){
      Toast.alert({message:'您还未评分，请评分'});
      return;
    }
    this.showLoading(1);
    app.req.postRequest(api.evaluateAdvice,{
      adviceDate:adviceDate,
      adviceSeqId:adviceSeqId,
      rateScore:rateScore,
      wxOpenId:wxOpenId,
      huSeqId:huSeqId
    }).then(res=>{
      that.showLoading(0);
      let data = res.data;
      if(data.respCode == '000'){
        Toast.alert({message:'评价成功!'}).then(()=>{
          that.reloadPage();
        })
      }else{
        Toast.alert({message:data.errDesc});
      }
    })
  },

  //评分
  pingfen(event) {
    this.setData({
      rateScore: event.detail,
    });
  },

  //页面重载
  reloadPage(){
    let adviceDate = this.data.adviceDate;
    let adviceSeqId = this.data.adviceSeqId;
    let wxOpenId = this.data.wxOpenId;
    let isLogin = this.data.isLogin;
    let custId = this.data.custId;
    wx.redirectTo({
      url: './addviceDetail?adviceDate='+adviceDate+'&adviceSeqId='+adviceSeqId+'&isLogin='+isLogin+'&wxOpenId='+wxOpenId+'&custId='+custId,
    })
  },

  //修改留言
  addMsgBody(event) {
    console.log(event.detail);
    this.setData({addMsgBody:event.detail})
  },
  //提交留言
  submitAddMsgBody() {
    let that = this;
    let msgBody = this.data.addMsgBody;
    if (msgBody === undefined || msgBody === '') {
      Toast.alert({message: '请输入反馈备注'});
      return;
    }
    let adviceDate = this.data.obj.adviceDate;
    let adviceSeqId = this.data.obj.adviceSeqId;
    app.req.postRequest(api.addMsgBody,{ adviceDate:adviceDate,
      adviceSeqId:adviceSeqId,
      msgBody:msgBody}).then(res=>{
      console.log('res====>', res);
      if (res.data.RESPCODE === '000') {
        Toast.alert({message: '反馈成功'}).then(res=>{
          //that.setData({msgList:[],addMsgBody:''});
          //that.onOpen();
          this.reloadPage();
        })

      }else{
        Toast.alert({message: res.data.errDesc}).then(res=>{
          //that.setData({msgList:[],addMsgBody:''});
          //that.onOpen();
          this.reloadPage();
        })
      }
    })
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