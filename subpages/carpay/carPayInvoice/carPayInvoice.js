const app = getApp();
const api = require("../../../const/api");
import Toast from '../../../miniprogram_npm/@vant/weapp/dialog/dialog';

Page({

  /**
   * 页面的初始数据
   */
  data: {

    orderId: '',
    buyerName: '',
    buyerTaxNo: '',
    pushEmail: '',
    invoiceType: '',
    searchText: '',
    companyInfoList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    var that = this;
    that.setData({
      orderId: options.orderId
    })
  },

  radioChange(e) {
    var checkValue = e.detail.value;
    this.setData({
      invoiceType: checkValue,
      buyerName: '',
      buyerTaxNo: '',
      pushEmail: '',
      searchText: '',
      companyInfoList: []
    });
   console.log("开票类型选择：" + checkValue)
  },

  handleInput: function(e) {
    this.setData({
      searchText: e.detail.value
    });
    console.log('handleInput搜索内容:', this.data.searchText);
  },

  // 模糊查询单位名称税号信息
  handleSearch: function() {
    var that = this;
    var searchText = that.data.searchText;
    if(searchText == '' || searchText == null){
      app.alert.alert('搜索内容不能为空');
      return;
    }
    console.log('handleSearch搜索内容:', that.data.searchText);
    var data = {};
    data['searchText'] = searchText;
    data['cstCode'] = app.storage.getCstCode();
    data['wxOpenId'] = app.storage.getWxOpenId();
    data['proNum'] = app.storage.getProNum();
    app.req.postRequest(api.parkPayCompanySearch,data).then(res=>{
      if(res.data.respCode == '000'){
           var companyInfoList = res.data.companyInfoList;
           that.setData({
            companyInfoList: companyInfoList
           })
      }else{
        wx.showToast({
          icon:'none',
          title: res.data.errDesc,
          duration:3000
        })
      }
    });   
   
  },

  // 选择搜索结果后处理
  invoiceInfo: function(e){
    var that = this;
    var name = e.currentTarget.dataset.datavalue.name;
    var taxId = e.currentTarget.dataset.datavalue.taxId;
    that.setData({
      buyerName: name,
      buyerTaxNo: taxId,
      companyInfoList:[]
    })
  },

  buyerNameInputValue: function(e) {
    this.setData({
      buyerName: e.detail.value // 将输入框的值存储到data中
    });
  },

  pushEmailInputValue: function(e) {
    this.setData({
      pushEmail: e.detail.value // 将输入框的值存储到data中
    });
  },


  // 开票
  makeInvoice:function(e){
    var that = this;
    var invoiceType = that.data.invoiceType;
    if(invoiceType == '' || invoiceType == null){
      app.alert.alert('请选择开票类型');
      return;
    }
    var buyerName = that.data.buyerName;
    if(buyerName == '' || buyerName == null){
      app.alert.alert('请填写发票抬头');
      return;
    }
    var buyerTaxNo = that.data.buyerTaxNo;
    if((buyerTaxNo == '' || buyerTaxNo == null) && invoiceType == '1'){
      app.alert.alert('请填写税号');
      return;
    }
    var pushEmail = that.data.pushEmail;
    if(pushEmail == '' || pushEmail == null){
      app.alert.alert('请填写邮箱');
      return;
    }
    let str = /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/	
    if (str.test(pushEmail)) {
      /*格式正确*/
    }else {
      /*格式不正确，弹窗提示*/
      app.alert.alert('邮箱格式错误');
      return;
    }
    var data = {};
    data['orderId'] = that.data.orderId;
    data['cstCode'] = app.storage.getCstCode();
    data['wxOpenId'] = app.storage.getWxOpenId();
    data['proNum'] = app.storage.getProNum();
    data['invoiceType'] = that.data.invoiceType;
    data['buyerName'] = that.data.buyerName;
    data['buyerTaxNo'] = that.data.buyerTaxNo;
    data['pushEmail'] = that.data.pushEmail;
    app.req.postRequest(api.parkPayInvoice,data).then(res=>{
      if(res.data.respCode == '000'){
        Toast.alert({
          message:'发票开具成功,请前往邮箱查看',
        }).then(()=>{    
          wx.navigateTo({
            url: '/subpages/carpay/carPayLog/carPayLog',
          })
        })
      }else{
        wx.showToast({
          icon:'none',
          title: res.data.errDesc,
          duration:3000
        })
      }
    });   
  },
  
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})