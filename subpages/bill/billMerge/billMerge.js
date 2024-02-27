const { unique } = require('../../../utils/stringUtil');

const api = require('../../../const/api'),
 app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
      billMergeList:[],
      pageNum:1,
      pageSize:5,
      pages:10,
      totalNum:1,
      obj:null,
      cstCode:'',
      proNum:'',
      wxOpenId:'',
      navList: ['全部', '待支付', '已支付'],
      nav_type: 1,
      payment_button_disabled:false
  },

  changeType: function (e) {
    let {
      index
    } = e.currentTarget.dataset;
    if (this.data.nav_type=== index || index === undefined) {
      return false;
    } else {
      this.setData({
        nav_type: index
      })
    }
    this.setData({
      pageNum:1,
      checkIds:[],
      checkedAll:false
    });
    this.queryForPage();
  },

  loadMore(event){
    var pageNum = this.data.pageNum + 1;
    this.setData({
      pageNum:pageNum,
    });
    this.queryForPage('loadMore');
  },

  queryForPage(type){
    var that = this;
    that.showLoading(1);
    var datas = this.data;
    var pageNum = datas.pageNum;
    var pageSize = datas.pageSize;
    var billStatus = datas.nav_type;
    var data = {};
    data['pageNum'] = pageNum;
    data['pageSize'] = pageSize;
    data['cstCode'] = app.storage.getCstCode();
    data['wxOpenId'] = app.storage.getWxOpenId();
    data['proNum'] = app.storage.getProNum();   
    data['billStatus'] = billStatus;
    app.req.postRequest(api.queryBillMerge,data).then(res=>{
        console.log("回调用",res);
        if(res.data.respCode == '000'){
          that.showLoading(0);
          var billMergeList = res.data.billMergeList;
          let totalNum = res.data.totalNum;
          var pages = parseInt(res.data.pages);
          that.data.billMergeList.push.apply(that.data.billMergeList,billMergeList);
          that.setData({
            pages:pages,
            billMergeList:type == 'loadMore'?that.data.billMergeList:billMergeList,
            totalNum:totalNum,
            isRefreshing:false
          });
        }else{
          var desc = res.data.errDesc;
          if(!desc){
            desc = '网络异常，请稍后再试';
          }
          app.alert.alert(desc);
        }
    });
  },

  payment(e){
    // id
    var id = e.currentTarget.dataset.datavalue.id;
    //var checkIds = this.data.checkIds;
    // 所属账期
    //var repYears = e.currentTarget.dataset.datavalue.repYears;
    // 本金应收
    var priRev = e.currentTarget.dataset.datavalue.priRev;
    // 本金已收
    //var priPaid = e.currentTarget.dataset.datavalue.priPaid;
    // 收付项目
    var ipItemName = e.currentTarget.dataset.datavalue.ipItemName;
    var data = {};
    data['cstCode'] = app.storage.getCstCode();
    data['wxOpenId'] = app.storage.getWxOpenId();
    data['proNum'] = app.storage.getProNum();   
    data['id'] = id;
    //data['repYears'] = repYears;
    data['priRev'] = priRev;
    //data['priPaid'] = priPaid;
    data['ipItemName'] = ipItemName;
    //data['orderIds'] = checkIds;
    var that = this;
    if(!that.data.payment_button_disabled){
      that.setData({ payment_button_disabled: true });
      // 服务端获取支付参数
      app.req.postRequest(api.placeOrder,data).then(res=>{
        console.log("下单返回",res);
        if(res.data.respCode == '000'){
          that.setData({ payment_button_disabled: false });
          var timeStamp = res.data.signInfoVo.timeStamp;
          var nonceStr = res.data.signInfoVo.nonceStr;
          var repayId = res.data.signInfoVo.repayId;
          var paySign = res.data.signInfoVo.paySign;
          wx.requestPayment({
            timeStamp: timeStamp,
            nonceStr: nonceStr,
            package: repayId,
            signType: 'RSA',
            paySign: paySign,
            success (res) {
                console.log("-------------成功---------------" + res);
                // 支付完成，修改支付状态为支付中
                app.req.postRequest(api.paymentCompleted,data).then(res=>{
                  console.log("下单完成返回",res);
                  if(res.data.respCode == '000'){
                    console.log("下单完成返回成功！")   
                  }
                });
                // 支付成功跳转到已支付页面
                that.setData({
                  nav_type:2
                })
                that.queryForPage(); 
            },
            fail (res) {
              console.log("-------------失败---------------" + res);
            }
          });
        }else{
          that.setData({ payment_button_disabled: false });
          var code = res.data.errCode;
          var desc = res.data.errDesc;
          // if(!desc){
          //   desc = '网络异常，请稍后再试';
          // }
          app.alert.alert(code + ":" + desc);
        }
      }); 
    }
  },

  cancelBill(e){
    var id = e.currentTarget.dataset.datavalue.id;
    var data = {};
    data['cstCode'] = app.storage.getCstCode();
    data['wxOpenId'] = app.storage.getWxOpenId();
    data['proNum'] = app.storage.getProNum();   
    data['id'] = id;
    var that = this;
    wx.showModal({
      title: '提示',
      content: '确定取消吗?',
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定');
          app.req.postRequest(api.cancelBill,data).then(res=>{
            console.log("取消账单返回",res);
            if(res.data.respCode == '000'){
              that.queryForPage(); 
            }else{
              var code = res.data.errCode;
              var desc = res.data.errDesc;
              // if(!desc){
              //   desc = '网络异常，请稍后再试';
              // }
              app.alert.alert(code + ":" + desc);
            }
          }); 
        } else if (res.cancel) {
          console.log('用户点击取消');
        }
      }
    });  
  },

  costDetail: function (event) {
   
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.loading(),this.showLoading(0);
    this.queryForPage();
    //获取页面栈
    //let pages = getCurrentPages();
    //获取所需页面
    //let prevPage = pages[pages.length -2];//上一页
    //prevPage.setData({
    //  refreshIfNeeded:true,//你需要传过去的数据
   // });
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
    this.setData({
      pageNum:1,
      loading:false,
      isRefreshing:true,
      billMergeList:new Array()
    })
    this.queryForPage()
    wx.stopPullDownRefresh({
    })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    let totalNum = this.data.totalNum;
    let pageNum = this.data.pageNum;
    let pageSize = this.data.pageSize;
    if(pageNum * pageSize < totalNum){
      this.loadMore();
      this.setData({
        checkedAll: ""
      })
    }else{
      wx.showToast({
        title: '已经到底了',
        icon:'none'
      })
    }
    
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})