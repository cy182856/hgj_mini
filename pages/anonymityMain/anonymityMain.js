import Toast from './../../miniprogram_npm/@vant/weapp/dialog/dialog';
const api = require('../../const/api');
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 背景图相关
    background: [''],
    indicatorDots: false,
    vertical: false,
    autoplay: false,
    interval: 2000,
    duration: 500,

    obj:null,//后台功能对象

    custId:'', //参数传来的custId
    wxOpenId:'', //参数传来的wxOpenId
    objId:'',

    hgjOpenId:'',//当点击个人住宅后，首次会记录该值
    sign:'',
    repairUrl:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //初始化loading
    app.loading(),this.showLoading(0);
    //获取传入的参数
    let custId = options['custId'];
    let wxOpenId = options['wxOpenId'];
    let objId = options['objId'];
    //参数校验
    if(!this.varifyParam(custId,wxOpenId)){
      console.log('options:',options);
      Toast.alert({message:'扫码无效，请重新扫码!'});
      return;
    }
    //参数固定
    this.setParamToData(custId,wxOpenId,objId);
    //获取背景图
    this.getBackgroundImg(custId);
    //获取功能菜单
    let that = this;
    app.req.postRequest(api.noName, this.sendParam(custId,wxOpenId)).then(res=>{
      console.log('res=>',res);
      let data = res.data;
      if(data.respCode == '000'){
        that.setData({obj:data});
      }else{
        Toast.alert({message:data.errDesc});
      }
    });
  },
  //参数校验
  varifyParam(custId,wxOpenId){
    if(custId && custId !=null && custId!='' && wxOpenId && wxOpenId !=null && wxOpenId!=''){
      return true;
    }
    return false;
  },
  //将参数设置到data对象中
  setParamToData(custId,wxOpenId,objId){
    console.log('data=>',custId,wxOpenId,objId);
    this.setData({
      custId:custId,
      wxOpenId:wxOpenId,
      objId:objId,
    })
  },
  //获取背景图
  getBackgroundImg(custId){
    var imgNum = 1;
    var background = new Array();
    for (let i = 0; i < imgNum; i++) {
      let imgurl = api.queryImageUrl.replace('FILENAME',i+'.png').replace('PACKNAME','main/'+custId).replace('OTHER','main');
      background.push(imgurl);
    }
    this.setData({background:background,})
  },
  //参数组合
  sendParam(custId,wxOpenId){
    let param = {};
    param['custId'] = custId;
    param['wxOpenId'] = wxOpenId;
    return param;
  },

  //跳转到指定的页面
  toPage(event){
    let url = event.currentTarget.dataset.url;
    console.log('待跳转的URL=》',url);
    if(this.isBankUrl(url)){
      return;
    }
    this.toModulePage(url);
  },
  //个人住宅报修
  doRepair(event){
    let that = this;
    let url = event.currentTarget.dataset.url;
    if(this.isBankUrl(url)){
      return;
    }
    let hgjOpenId = this.data.hgjOpenId;
    let custId = this.data.custId
    let wxOpenId = this.data.wxOpenId;
    this.setData({repairUrl:url});
    this.showLoading(1);
    // if(hgjOpenId == ''){
    //   //首次点击住宅，该用户当前没有记录hgjOpenId
    //   console.log('首次点击住宅，该用户当前没有记录hgjOpenId');
      this.getBind();
    // }else{
    //   console.log('用户已经点击过，且已经知道了hgjOpenId的值',hgjOpenId);
      // this.getBindInfo();
    // }
    
  },


  //访问绑定功能
  getBind(){
    let that = this;
    let sign = this.data.sign;
    // if(!sign && sign != ''){
    //   that.getBindInfo();
    // }else{
      wx.login({
        success:res=>{
          let code = res.code;
          that.getBindInfo(code);
        }
      })
    // }
  },

  //获取绑定信息
  getBindInfo(code){
    let custId = this.data.custId
    let wxOpenId = this.data.wxOpenId;
    let that = this;
    let url = this.data.repairUrl;
    if(code==undefined || code == ''){
      code = '';
    }
    app.req.postRequest(api.isBind,{code:code,custId:custId,wxOpenId:wxOpenId}).then(res=>{
      that.showLoading(0);
      let data = res.data;
      if(data.respCode == '000'){
        if(!data.bind){ //未绑定，需要进入注册页
          console.log('用户未绑定，需要进入绑定页',url);
          url = data.bindPage+'?sign='+data.sign+'&custid='+custId+'&wxopenid='+wxOpenId;
          that.setData({
            hgjOpenId:data.hgjOpenId,
            sign:data.sign
          });
          Toast.confirm({
            message:'该功能对认证用户开放，请认证',
            closeOnClickOverlay:true
          }).then(()=>{
            that.toModulePage(url);
          }).catch(() => {
            // on cancel
          });
          return;
        }

        that.toModulePage(url+'?custId='+this.data.custId+'&hgjModuleId=08');
      }else{
        Toast.alert({message:data.errDesc});
      }
    })
  },



  //跳转功能页
  toModulePage(url){
    console.log('当前跳转到的页面是：',url);
    wx.navigateTo({
      url: url,
    });
  },
  //检查是否配置了URL
  isBankUrl(url){
    if(url == undefined || url == ''){
      Toast.alert({message:'您还没有该功能权限，请联系物业开通'});
      return true;
    }
    return false;
  },

  //报修记录列表
  toRepairListPage(){
    let url = '/subpages/repair/pages/niming/queryRepair'+this.mustParam("?")+"&isLogin=N";
    if(this.isBankUrl(url)){
      return;
    }
    this.toModulePage(url);
  },


  //反馈记录列表页
  toAdviceListPage(){
    let url = '/subpages/advice/query/queryAdvice'+this.mustParam("?")+"&isLogin=N";
    this.toModulePage(url);
  },

  //投诉建议表扬页
  toAdvicePage(event){
    let url = event.currentTarget.dataset.url;
    if(this.isBankUrl(url)){
      return;
    }
    let wxOpenId = this.data.wxOpenId;
    if(wxOpenId == undefined || wxOpenId == ''){
      Toast.alert({message:'缺失关键信息，请重新扫码'});
      return;
    }
    url += this.mustParam("&");
    console.log('匿名投诉建议的地址',url);
    this.toModulePage(url);
  },
  //共建家园
  toRepariPage(event){
    let url = event.currentTarget.dataset.url;
    if(this.isBankUrl(url)){
      return;
    }
    url += this.mustParam('?');
    this.toModulePage(url);
  },
  //返回&形式在匿名主页到所有子页面必传的固定参数
  mustParam(type){
    let wxOpenId = this.data.wxOpenId;
    let custId = this.data.custId;
    let objId = this.data.objId;
    let result = '';
    switch(type){
      case '&':result = "&custId="+custId+"&wxOpenId="+wxOpenId+"&objId="+objId;break;
      case '?':result = "?custId="+custId+"&wxOpenId="+wxOpenId+"&objId="+objId;break;
      default: result = "custId="+custId+"&wxOpenId="+wxOpenId+"&objId="+objId;
    }
    return result;
  },

  //登录绑定页
  toLoginPage(){
    let custId = this.data.custId
    let wxOpenId = this.data.wxOpenId;
    let that = this;
    wx.login({
      success:res=>{
        let code = res.code;
        app.req.postRequest(api.isBind,{code:code,custId:custId,wxOpenId:wxOpenId}).then(res=>{
          that.showLoading(0);
          let data = res.data;
          if(data.respCode == '000'){
            let url = '/pages/main/main'+that.mustParam('?');
            if(!data.bind){ //未绑定，需要进入注册页
              // console.log('用户未绑定，需要进入绑定页',url);
              url = data.bindPage+'?sign='+data.sign+'&custid='+custId+'&wxopenid='+wxOpenId;
              console.log('用户未绑定，需要进入绑定页',data,url);
              that.setData({
                hgjOpenId:data.hgjOpenId,
                sign:data.sign
              });
              that.toModulePage(url);
              return;
            }
            that.toModulePage(url);
          }else{
            Toast.alert({message:data.errDesc});
          }
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