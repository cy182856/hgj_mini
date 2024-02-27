const app = getApp();
const util = require('../../../utils/util');
const api = require('../../../const/api');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    proName:'',
    minHour: 10,
    maxHour: 20,
    minDate: new Date().getTime(),
    maxDate: new Date(2070, 12, 12).getTime(),
    currentDate: new Date().getTime(),
    active:0,
    radio:"1",
    expCnt:-1,
    expNum:1,
    showCheckExpTime:!1,
    quickCodes:['*', '*', '*', '*', '*','*'],
    randomNum:'* * * * * *',
    visitName:'',
    carNum:'',
    isjiantou:true  //箭头切换
    ,selectcontent:''
    ,value:''  //选中的值
    ,valueid:'' //选中的id
    ,houseId:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    this.setData({
      proName:app.storage.getProName()
    })

     //获取客户房屋列表
     this.getHouseList();
  },

  //获取客户房屋列表
  getHouseList(){
    var data = {
      cstCode:app.storage.getCstCode(),
      wxOpenId:app.storage.getWxOpenId()
    }
    app.req.postRequest(api.repairHouseList,data).then(res=>{
      let data = res.data;
      if(data.respCode == '000'){
        console.log('data===>',data);
        this.setData({
          selectcontent:data.data.list
        })
       console.log('selectcontent===>',this.data.selectcontent);
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
    this.setData({
      visitName:'',
      carNum:'',
      radio:"1",
      expCnt:-1,
      expNum:1
    })
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
      url: '/subpages/visit/checkVisit/checkVisit',
    })
  },
  onChangeRadio:function(e){
    var expCnt = this.data.expCnt;
    if(e.detail == '1'){
      expCnt = -1;
    }else{
      expCnt = this.data.expNum
    }
    this.setData({
      radio:e.detail,
      expCnt:expCnt
    })
  },
  onChangeExpCnt:function(e){
    this.setData({
      expNum:e.detail
    })
  },
  showCheckExpTime:function(e){
    this.setData({
      showCheckExpTime:!this.data.showCheckExpTime 
    })
  },
  hideCheckExpTime:function(){
    this.setData({
      showCheckExpTime:!1
    })
  },
  inputVisitName:function(e){
    let reg = /[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF][\u200D|\uFE0F]|[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF]|[0-9|*|#]\uFE0F\u20E3|[0-9|#]\u20E3|[\u203C-\u3299]\uFE0F\u200D|[\u203C-\u3299]\uFE0F|[\u2122-\u2B55]|\u303D|[\A9|\AE]\u3030|\uA9|\uAE|\u3030/ig;  
    var visitName = e.detail.value;
    var that = this;
    if(visitName.match(reg)){
      wx.showToast({
        title: '访客称呼不能输入表情符',
        icon:'none',
        success:function(){
          visitName = visitName.replace(reg,"");
          that.setData({
            visitName:visitName
          })
        }
      });
    }else{
      this.setData({
        visitName:visitName
      })
    }
  },
  inputCarNum:function(e){
    let reg = /[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF][\u200D|\uFE0F]|[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF]|[0-9|*|#]\uFE0F\u20E3|[0-9|#]\u20E3|[\u203C-\u3299]\uFE0F\u200D|[\u203C-\u3299]\uFE0F|[\u2122-\u2B55]|\u303D|[\A9|\AE]\u3030|\uA9|\uAE|\u3030/ig;  
    var carNum = e.detail.value;
    var that = this;
    let reg2 = /[^\w\.\/]/ig;
    var regEn = /[`~!@#$%^&*()_+<>?:"{},.\/;'[\]]/im,
	  regCn = /[·！#￥（——）：；“”‘、，|《。》？、【】[\]]/im;
    if(carNum.match(reg)){
      wx.showToast({
        title: '车牌号不能输入表情符',
        icon:'none',
        success:function(){
          carNum = carNum.replace(reg,"");
          that.setData({
            carNum:carNum
          })
        }
      });
    }else if(carNum.match(reg2)){
      wx.showToast({
        title: '车牌号不能输入中文',
        icon:'none',
        success:function(){
          carNum = carNum.replace(reg2,"");
          that.setData({
            carNum:carNum
          })
        }
      });
    }else if(carNum.match(regEn) || carNum.match(regCn)){
      wx.showToast({
        title: '车牌号不能输入特殊字符',
        icon:'none',
        success:function(){
          carNum = carNum.replace(regEn,"").replace(regCn,"");
          that.setData({
            carNum:carNum
          })
        }
      });
    } else{
      this.setData({
        carNum:carNum
      })
    }
  },
  clearVisitName:function(){
    this.setData({
      visitName:''
    })
  },
  clearCarNum:function(){
    this.setData({
      carNum:''
    })
  },
  checkExpTime:function(e){
    var date = new Date(e.detail);
    this.setData({
      expTime:util.formatTime(date),
      showCheckExpTime:!1
    })
  },
  createPassCode:function(){
    console.log(this.data.visitName)
    if(!this.data.visitName){
      wx.showToast({
        title: '请输入访客称呼',
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
    let reg = /[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF][\u200D|\uFE0F]|[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF]|[0-9|*|#]\uFE0F\u20E3|[0-9|#]\u20E3|[\u203C-\u3299]\uFE0F\u200D|[\u203C-\u3299]\uFE0F|[\u2122-\u2B55]|\u303D|[\A9|\AE]\u3030|\uA9|\uAE|\u3030/ig;  
    if(this.data.visitName.match(reg)){
      wx.showToast({
        title: '访客称呼不能包含表情符',
        icon:'none'
      });
      return false;
    }
    if(this.data.visitName.length > 15 ){
      wx.showToast({
        title: '访客称呼不能超过15个字',
        icon:'none'
      });
      return false;
    }
    if(this.data.carNum && this.data.carNum.length != 4 ){
      wx.showToast({
        title: '车牌号必须输入后四位',
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
      visitName: that.data.visitName,
      houseId: that.data.valueid,
      carNum: that.data.carNum,
      expCnt:that.data.expCnt,
      visitType:'V'
    }

    app.req.postRequest(api.addVisitQrCode, visitInfo).then(function (value) {
      console.log("addVisitLog 返回", value);
      if(value.data.RESPCODE == "000" && value.data.visitQrCode != null){
        var visiPass = value.data.visitLogVo;
        wx.navigateTo({
          // url: '/subpages/visit/visitDetail/visitDetail?'+'visitDate=' +  value.data.visitLogInfo.visitDate +
          //   '&visitSeqId=' + value.data.visitLogInfo.visitSeqId
          url: '/subpages/visit/visitDetail/visitDetail?'+'visitQrCode=' + value.data.visitQrCode + '&houseName=' + visiPass.houseName + '&visitName=' + visiPass.visitName + '&carNum=' + visiPass.carNum + '&expNum=' + visiPass.expCnt + '&effectuateDate=' + visiPass.effectuateDate
        })
      }else{
        wx.showToast({
          icon:'none',
          title: value.data.ERRDESC?value.data.ERRDESC:'生成访客通行证失败',
          duration:3000
        })
      }
    }, function (value) {
      console.log("addVisitLog F ", value);
      wx.showToast({
        icon:'none',
        title: '生成访客通行证失败',
        duration:3000
      })
    }); 
  },
  createQuickCode:function(){
    var that = this;
    //var loginInfo = app.storage.getLoginInfo();
    var cstCode = app.storage.getCstCode();
    var wxOpenId = app.storage.getWxOpenId();
    var proNum = app.storage.getProNum();
    var proName = app.storage.getProName();
    var visitInfo = {
      cstCode: cstCode,
      wxOpenId: wxOpenId,
      proNum:proNum,
      proName: proName,
      visitType:'Q',
      expCnt:1
    }
    app.req.postRequest(api.addVisitRandomNum, visitInfo).then(function (value) {
      console.log("addVisitLog 返回", value);
      if(value.data.RESPCODE == "000" && value.data.randomNum != null){
          //var quickCode = value.data.visitLogInfo.visitCode;
          var randomNum = value.data.randomNum;
          //var quickCodes = new Array();
          // for(var i = 0;i < quickCode.length; i++){
          //   quickCodes.push(quickCode.substr(i,1))
          // }
          that.setData({
            //quickCodes:quickCodes,
            randomNum:randomNum
          })
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