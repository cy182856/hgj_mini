// subpages/advice/add/addAdvice.js
import Toast from '../../../miniprogram_npm/@vant/weapp/dialog/dialog';
const app = getApp();
const api = require('../../../const/api.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    totalNum:0,
    pageNum:0,
    pageSize:10,
    objList:[],
    comObj:null,

    wxOpenId:'',//匿名报修时，业务性非空
    custId:'',
    isLogin:'',
    huSeqId:''

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //初始化加载开始
    app.loading(),this.showLoading(0);
    //参数值
    let custId = options['custId'];
    let isLogin = options['isLogin'];
    let wxOpenId = options['wxOpenId'];
    let huSeqId = options['huSeqId'];
    //初始化传来参数
    let checkParamResult = this.initParam(custId,isLogin,wxOpenId,huSeqId);
    if(!checkParamResult){
      return;
    }
    //加载分页数据
    this.queryForPage();
  },
  //对传来的参数进行初始化
  initParam(custId,isLogin,wxOpenId,huSeqId){
    if(custId == undefined || custId == ''){
      Toast.alert({message:'关键信息缺失'});
      return false;
    }
    if(isLogin == 'Y'&&(huSeqId==undefined||huSeqId == '')){
      Toast.alert({message:'关键信息缺失，请退出重新登录'});
      return false;
    }else if(isLogin == 'N'&&(wxOpenId==undefined||wxOpenId == '')){
      Toast.alert({message:'关键信息缺失，请重新扫码再试'});
      return false;
    }
    this.setData({
      custId:custId,
      isLogin:isLogin,
      wxOpenId:wxOpenId,
      huSeqId:huSeqId,
    })
    return true;
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
    //加载更多
    this.loadMore();
  },
  //加载更多
  loadMore(){
    // let pageNum = this.data.pageNum + 1;
    let pageSize = this.data.pageSize;
    let totalNum = this.data.totalNum;
    // console.log('加载更多','totalNu='+totalNum,'pageNum*pageSize='+pageNum*pageSize);
    if(!(totalNum > this.data.pageNum * pageSize)){
      
      wx.showToast({
        title: '没有更多数据了',
        icon:'none'
      })
      return;
    }
    this.queryForPage();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  // other function
  //分页查询
  queryForPage(){
    let that = this;
    this.showLoading(1);
    app.req.postRequest(api.queryAdviceLog,this.getQueryParam()).then(res=>{
      that.showLoading(0)
      let data = res.data;
      console.log('匿名分页查询结果',data);
      if(data.respCode == '000'){
        let newDataList = data.adviceDtoList;
        if(newDataList == null){
          wx.showToast({
            title: '已经没有更多了',
            icon:'none',
          })
          return;
        }
        let objList = that.data.objList;
        objList.push.apply(objList,newDataList);
        that.setData({
          objList:objList,
          pageNum:(that.data.pageNum+1),
          totalNum:data.totalNum,
          comObj:data,
        })
      }else{
        Toast.alert({message:data.errDesc});
      }
    })
  },
  //分页查询的参数
  getQueryParam(){
    let data = {};
    data['custId'] = this.data.custId;
    data['wxOpenId'] = this.data.wxOpenId;
    data['isLogin'] = this.data.isLogin;
    data['huSeqId'] = this.data.huSeqId;
    data['pageNum'] = this.data.pageNum + 1;
    data['pageSize'] = this.data.pageSize;
    console.log('querydata===>',data);
    return data;
  },

  //进入详情页
  toDetailPage(event){
    // console.log('detail page data',event);
    let obj = event.currentTarget.dataset;
    let adviceDate = obj.date;
    let adviceSeqId = obj.seq;
    let custId = this.data.custId;
    let isLogin = this.data.isLogin;
    let wxOpenId = this.data.wxOpenId;
    let adviceType = obj.type;
    wx.navigateTo({
      url: '../detail/addviceDetail?adviceDate='+adviceDate+'&adviceSeqId='+adviceSeqId+'&isLogin='+isLogin+'&custId='+custId+'&adviceType='+adviceType+'&wxOpenId='+wxOpenId,
    })
  }
})