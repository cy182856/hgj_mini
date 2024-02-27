const api = require('../../const/api'),
 app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
      refreshIfNeeded: false,
      billList:[],
      pageNum:1,
      pageSize:5,
      pages:5,
      totalNum:1,
      obj:null,
      cstCode:'',
      proNum:'',
      wxOpenId:'',
      navList: ['未交清', '已交清'],
      nav_type: 0,
      payment_button_disabled:false,
      checkedAll: '',
      checkIds:[],
      totalAmount:0
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
      checkedAll:false,
      totalAmount:0
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
    var datas = this.data;
    var pageNum = datas.pageNum;
    var pageSize = datas.pageSize;
    var lockLogo = datas.nav_type;
    var data = {};
    data['pageNum'] = pageNum;
    data['pageSize'] = pageSize;
    data['cstCode'] = app.storage.getCstCode();
    data['wxOpenId'] = app.storage.getWxOpenId();
    data['proNum'] = app.storage.getProNum();   
    data['lockLogo'] = lockLogo;
    var that = this;
    app.req.postRequest(api.queryBill,data).then(res=>{
        console.log("回调用",res);
        if(res.data.respCode == '000'){
          var billList = res.data.billList;
          let totalNum = res.data.totalNum;
          var pages = parseInt(res.data.pages);
          that.data.billList.push.apply(that.data.billList,billList);
          that.setData({
            pages:pages,
            billList:type == 'loadMore'?that.data.billList:billList,
            totalNum:totalNum
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

  // 废弃
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
    //data['totalAmount'] = totalAmount;
    var that = this;
    if(!this.data.payment_button_disabled){
      that.setData({ payment_button_disabled: true });
      // 服务端获取支付参数
      app.req.postRequest(api.placeOrder,data).then(res=>{
        console.log("下单返回",res);
        if(res.data.respCode == '000'){
          this.setData({ payment_button_disabled: false });
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
            },
            fail (res) {
              console.log("-------------失败---------------" + res);
            }
          });
        }else{
          this.setData({ payment_button_disabled: false });
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

  mergeBill(e){
    var checkIds = this.data.checkIds;
    var totalAmount = this.data.totalAmount;
    var data = {};
    data['cstCode'] = app.storage.getCstCode();
    data['wxOpenId'] = app.storage.getWxOpenId();
    data['proNum'] = app.storage.getProNum();   
    data['orderIds'] = checkIds;
    data['totalAmount'] = totalAmount;
      app.req.postRequest(api.mergeBill,data).then(res=>{
        console.log("合并账单返回",res);
        if(res.data.respCode == '000'){
          console.log("跳转到缴费中页面");
          wx.navigateTo ({
            url: '../bill/billMerge/billMerge',
          })       
          this.setData({
            totalAmount:0
          });
          this.queryForPage();      

        }else{
          var code = res.data.errCode;
          var desc = res.data.errDesc;
          // if(!desc){
          //   desc = '网络异常，请稍后再试';
          // }
          app.alert.alert(code + ":" + desc);
        }
      }); 
    
  },

  checkboxChange(e) {
    console.log('checkbox发生change事件，携带value值为：', e.detail.value)
    const items = this.data.billList;
    const values = e.detail.value;
    var checkIds = [];
    var totalAmount = 0;
    for (let i = 0, lenI = items.length; i < lenI; ++i) {
        items[i].checked = false
        for (let j = 0, lenJ = values.length; j < lenJ; ++j) {
            if (items[i].id === values[j]) {
                items[i].checked = true
                checkIds.push (items[i].id);
                totalAmount =  parseFloat((totalAmount + items[i].priRev).toFixed(2));
                break
            }
        }
    }
    this.setData({
      billList:items,
      checkIds:checkIds,
      totalAmount:totalAmount
    })
    
    if (e.detail.value.length == this.data.totalNum) {
        console.log(this.data.checkedAll);
        this.setData({
            checkedAll: true
        })
    }else{
        this.setData({
            checkedAll: ""
        })
    }
  },
  checkboxAll(e) {
    var checkIds = [];
    var totalAmount = 0;
    if (e.detail.value.length == 1) {
        // 全选状态
        const items = this.data.billList
        for (let i = 0; i < items.length; i++) {
            items[i].checked = true;
            checkIds.push (items[i].id);
            totalAmount =  parseFloat((totalAmount + items[i].priRev).toFixed(2));
        }
        this.setData({
          billList:items,
          checkIds:checkIds,
          totalAmount:totalAmount
        })
    } else {
        // 没有全选状态
        const items = this.data.billList
        for (let i = 0; i < items.length; i++) {
            items[i].checked = false
            var index = checkIds.indexOf(items[i].id);
            if(index !== -1) {
              checkIds.splice(index, 1);
              totalAmount =  parseFloat((totalAmount - items[i].priRev).toFixed(2));
              }
        }
        this.setData({
          billList:items,
          checkIds:checkIds,
          totalAmount:totalAmount
        })
    }
},

  costDetail: function (event) {
   
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.queryForPage();
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
     // 获取当前页面栈
    var pages = getCurrentPages();
    // 当前页面
    var currentPage = pages[pages.length - 1]; 
    if (currentPage.data.refreshIfNeeded) {
        currentPage.data.refreshIfNeeded = false;    
        this.setData({
          checkedAll: false,
          checkIds:[],
          totalAmount:0,
          pageNum:1,
          pageSize:5
        });
        // 当前页面 method中的方法，用来刷新当前页面
        // wx.navigateTo({
        //   url: 'bill',
        // })
        this.queryForPage(); 
    } 
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
    // console.log('onPullDownRefresh')
    // this.queryForPage();
	  // this.getReservation(this.resParams)
	  // uni.stopPullDownRefresh()

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