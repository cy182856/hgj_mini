const app = getApp();
const util = require('../../utils/util');
const api = require('../../const/api');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    proName:'',
    active:0,
    randomNum:'* * * * * *',
    expDate: ''
    ,startDate :''
    ,endDate :'',
    isjiantou:true  //箭头切换
    ,selectcontent:''
    ,value:''  //选中的值
    ,valueid:'' //选中的id
    ,houseId:''
    ,visitorCode:''
    ,visitName:''
    ,cstName:app.storage.getCstName()
    ,quickCodeInterTime:''
    ,pass_code_button_disabled:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    this.setData({
      proName:app.storage.getProName()
    })
     //获取当前及一周后日期
     this.queryWeekDate();
     //获取客户房屋列表
     this.getHouseList();
     //获取访客通行码，快速通行码说明文字
     this.getVisitExplain();
     //获取创建快速码的间隔时间
     this.queryQuickCodeInterTime();
  },

  // 选择日期
  bindDateChange: function(e) {
    this.setData({
      expDate: e.detail.value
    })
  },

  //获取当前及一周后日期
  queryWeekDate(){
    var data = {
      cstCode:app.storage.getCstCode(),
      wxOpenId:app.storage.getWxOpenId()
    }
    app.req.postRequest(api.queryWeekDate,data).then(res=>{
      if(res.data.respCode == '000'){
        this.setData({
          expDate:res.data.startDate,
          startDate:res.data.startDate,
          endDate:res.data.endDate
        })
      }
    })
  },

  //获取创建快速码的间隔时间
  queryQuickCodeInterTime(){
    var data = {
      cstCode:app.storage.getCstCode(),
      wxOpenId:app.storage.getWxOpenId()
    }
    app.req.postRequest(api.queryQuickCodeInterTime,data).then(res=>{
      if(res.data.respCode == '000'){
        this.setData({
          quickCodeInterTime:res.data.quickCodeInterTime
        })
      }
    })
  },

  //获取访客通行码，快速通行码说明文字
  getVisitExplain(){
    var data = {
      cstCode:app.storage.getCstCode(),
      wxOpenId:app.storage.getWxOpenId()
    }
    app.req.postRequest(api.queryOpenDoorExplain,data).then(res=>{
      if(res.data.respCode == '000'){
        this.setData({
          visitorCode:res.data.visitorCode,
          quickAccessCode:res.data.quickAccessCode
        })
      }
    })
  },

  //获取客户房屋列表
  getHouseList(){
    var data = {
      cstCode:app.storage.getCstCode(),
      wxOpenId:app.storage.getWxOpenId()
    }
    app.req.postRequest(api.repairHouseList,data).then(res=>{
      let data = res.data;
      let list = data.data.list;
      if(data.respCode == '000'){
        console.log('data===>',data);
        this.setData({
          selectcontent:list
        })
        if(list.length == 1){
          this.setData({
            valueid:list[0].id,
            value:list[0].resName
          })
        }
       console.log('selectcontent===>',this.data.selectcontent);
      }
    })
  },

  inputChange(event) {
    this.setData({
      visitName: event.detail.value // 将input的值存入data中的inputVal
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

  },
  checkVisitInfos:function(){
    wx.navigateTo({
      url: '/subpages/opendoor/openDoorLog/openDoorLog',
    })
  },

  queryQuickCodeDayLog:function(){
    wx.navigateTo({
      url: '/subpages/opendoor/openDoorQuickCode/openDoorQuickCode',
    })
  },
 
  createPassCode:function(){
    console.log(this.data.expDate)
    if(!this.data.expDate){
      wx.showToast({
        title: '请选择有效时间',
        icon:'none'
      });
      return false;
    }

    if(!this.data.valueid){
      wx.showToast({
        title: '请选择房屋',
        icon:'none'
      });
      return false;
    }
   
    var that = this;
    var cstCode = app.storage.getCstCode();
    var wxOpenId = app.storage.getWxOpenId();
    var proNum = app.storage.getProNum();
    var proName = app.storage.getProName();
    var visitInfo = {
      cstCode: cstCode,
      wxOpenId: wxOpenId,
      proNum:proNum,
      proName: proName,
      expDate:that.data.expDate,
      houseId: that.data.valueid,
      visitName: that.data.visitName
    }

    if(!that.data.pass_code_button_disabled){
      that.setData({ pass_code_button_disabled: true });
      app.req.postRequest(api.addOpenDoorQrCode, visitInfo).then(function (value) {
        console.log("addVisitLog 返回", value);
        if(value.data.RESPCODE == "000" && value.data.visitQrCode != null){
          that.setData({ pass_code_button_disabled: false });
          var visiPass = value.data.openDoorCodeVo;
          wx.navigateTo({
            url: '/subpages/opendoor/openDoorDetail/openDoorDetail?'+'visitQrCode=' + value.data.visitQrCode + '&visitName=' + visiPass.visitName + '&expDate=' + visiPass.expDate
          })
        }else{
          that.setData({ pass_code_button_disabled: false });
          wx.showToast({
            icon:'none',
            title: value.data.ERRDESC?value.data.ERRDESC:'生成访客通行码失败',
            duration:3000
          })
        }
      }, function (value) {
        that.setData({ pass_code_button_disabled: false });
        console.log("addVisitLog F ", value);
        wx.showToast({
          icon:'none',
          title: '生成访客通行码失败',
          duration:3000
        })
      }); 
    }  
  },
  createQuickCode:function(){
    var that = this;  
    if(!that.data.valueid){
      wx.showToast({
        title: '请选择房屋',
        icon:'none'
      });
      return false;
    }
     // 获取当前时间
    var currentTime = Date.now();
    // 获取缓存时间
    var quickCodeClickTime = app.storage.getQuickCodeClickTime();
    // 如果距离上次点击超过N分钟,配置获取
    //if (currentTime - quickCodeClickTime > 3) { 
    var quickCodeInterTime = that.data.quickCodeInterTime;
    //var quickCodeInterTimeMin = quickCodeInterTime/1000/60;
    if (currentTime - quickCodeClickTime > quickCodeInterTime) { 
      // 执行按钮点击后的操作
      var cstCode = app.storage.getCstCode();
      var wxOpenId = app.storage.getWxOpenId();
      var proNum = app.storage.getProNum();
      var proName = app.storage.getProName();
      var visitInfo = {
        cstCode: cstCode,
        wxOpenId: wxOpenId,
        proNum:proNum,
        proName: proName,
        houseId: that.data.valueid
      }
      app.req.postRequest(api.createQuickCode, visitInfo).then(function (value) {
        console.log("addVisitLog 返回", value);
        if(value.data.RESPCODE == "000" && value.data.randomNum != null){
            var randomNum = value.data.randomNum; 
            that.setData({
              randomNum:randomNum
            })
            // 刷新点击时间
            app.storage.setQuickCodeClickTime(currentTime)
        }else{
          wx.showToast({
            icon:'none',
            duration:3000,
            title: value.data.ERRDESC?value.data.ERRDESC:'生成快速通行码失败'
          })
        }
      }, function (value) {
        console.log("addVisitLog F ", value);
        wx.showToast({
          icon:'none',
          title: '生成快速通行码失败',
        })
      });       
    } else {
      // 如果没有超过N分钟，不执行操作，并给出提示
      wx.showToast({
        title: '请稍后重试！',
        icon: 'none'
      });
    }
   
  },
  // 下拉框收起和下拉
 changejiantou(){
  this.setData({
    isjiantou:!this.data.isjiantou
  })
},
// 选择数据后回显
changecontent(e){
  this.setData({
    value:e.currentTarget.dataset.datavalue.resName,
    valueid:e.currentTarget.dataset.datavalue.id,
    isjiantou:true
  })
},
  onCarNumBlur:function(e){
    this.setData({
      carNum:e.detail.value.replace(/[^\w\.\/]/ig,'').toUpperCase()
    })
  }
})