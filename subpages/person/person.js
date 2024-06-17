const api = require('../../const/api.js');
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userNameShow: false,
    phoneShow:  false,
    userName:'',
    newUserName:'',
    newPhone:'',
    phone:''
  },
  // 查询个人资料
  queryPersonData() {
    var data = {};
    data['cstCode'] = app.storage.getCstCode();
    data['wxOpenId'] = app.storage.getWxOpenId();
    data['proNum'] = app.storage.getProNum(); 
    var that = this;
    app.req.postRequest(api.queryPersonData, data).then(res => {
      console.log('个人资料查询结果', res);
      if (res.data.respCode == '000') {  
        let userName = res.data.userName;
        let phone = res.data.phone; 
        that.setData({
          userName: userName,
          phone: phone,
          isRefreshing:false
        })      
      } 
    });
  },

  tapModifyUserName() {
    this.setData({
      userNameShow: true
    })
  },
  onTapCancleModifyUserName() {
    console.log("onTapCancleModifyUserName")
    this.setData({
      userNameShow: false,
      newUserName: ""
    })
  },
  onUserNameChange(event) {
    console.log("onUserNameChange", event);
    this.setData({
      newUserName : this.filterEmoji(event.detail).replace(/\s+/g,"")
    }) 
  },
  filterEmoji(name){
    var str = name.replace(/[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF][\u200D|\uFE0F]|[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF]|[0-9|*|#]\uFE0F\u20E3|[0-9|#]\u20E3|[\u203C-\u3299]\uFE0F\u200D|[\u203C-\u3299]\uFE0F|[\u2122-\u2B55]|\u303D|[\A9|\AE]\u3030|\uA9|\uAE|\u3030/ig, '');
     return str;
  },
  onConfirm() {
    var that = this;
    var userName = that.data.newUserName;
    if(userName == '' || userName == null){
      app.alert.alert('请填写您要修改的姓名！');
      return;
    }
    var data = {}
    data['cstCode'] = app.storage.getCstCode();
    data['wxOpenId'] = app.storage.getWxOpenId();
    data['proNum'] = app.storage.getProNum();
    data['userName'] = that.data.newUserName;
    app.req.postRequest(api.updatePersonData,data).then(value => {
      if(value.data.respCode == '000'){       
        that.setData({
          newUserName: ""
        })
        that.queryPersonData();     
        //app.alert.alert('姓名修改成功！');
      }else{
        app.alert.alert('姓名修改失败,' + value.data.errDesc);
      }
  });    

  },

  tapModifyPhone() {
    this.setData({
      phoneShow: true
    })
  },
  onTapCancleModifyPhone() {
    console.log("onTapCancleModifyPhone")
    this.setData({
      phoneShow: false,
      newPhone: ""
    })
  },
  onPhoneChange(event) {
    console.log("onPhoneChange", event);
    this.setData({
      newPhone : event.detail
    }) 
  },
 
  onConfirmPhone() {
    var that = this;
    var phone = that.data.newPhone;
    if(phone == '' || phone == null){
      app.alert.alert('请填写您要修改的手机号！');
      return;
    }
    if(phone != null && phone != ''){
      if (!/^1[3456789]\d{9}$/.test(phone)) {
        app.alert.alert('请输入正确的手机号！');
        that.setData({
          newPhone: ""
        })
        return;
      }
    }

    var data = {}
    data['cstCode'] = app.storage.getCstCode();
    data['wxOpenId'] = app.storage.getWxOpenId();
    data['proNum'] = app.storage.getProNum();
    data['phone'] = that.data.newPhone;
    app.req.postRequest(api.updatePersonData,data).then(value => {
      if(value.data.respCode == '000'){
        that.setData({
          newPhone: ""
        })
        that.queryPersonData();    
        //app.alert.alert('手机号修改成功！'); 
      }else{
        app.alert.alert('手机号修改失败,' + value.data.errDesc);
      }
  });    

  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.queryPersonData();
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
    this.setData({
      isRefreshing:true
    })
    this.queryPersonData()
    wx.stopPullDownRefresh({
    })
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