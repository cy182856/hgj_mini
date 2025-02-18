const date = require('../../utils/dateUtil.js');
const api = require('../../const/api.js');
const app = getApp();

import Toast from '../../miniprogram_npm/@vant/weapp/dialog/dialog';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    show: false,
    fileList: [],
    fileList2: [],
    feedbackDesc:'',
    textArea:{ maxHeight: 110, minHeight: 110 },
    expArvTime:'',
    showTip:'' //申请成功的dialog
    ,tipDesc:'问题反馈成功' //申请成功提示语言
    ,repairDate:''
    ,repairSeqId:''
    ,obj:null
    ,sizeType:['compressed']//缩略图
    ,cWidth: 0 //画布的宽度，图片压缩后大小
    ,cHeight : 0 //画布的高度，图片压缩后大小
    ,quickDesc: []
    ,showQuickDesc:false
    ,cstCode:''
    ,wxOpenId:''
    ,proNum:''
    ,value:''  //选中的值
    ,valueid:'' //选中的id
    ,feedback_button_disabled:false

  },
//详情
topage(repairDate,repairSeqId){
    wx.redirectTo({
      url: '../repairDetailPage/repairDetailPage?repairDate='+repairDate+'&repairSeqId='+repairSeqId,
    })
  },
// 报修记录跳转
toListPage(){
  wx.redirectTo({
    url: 'query/query',
  })
},
//文本域
feedbackDesc(event){
  // console.log('描述',event.detail);
  let desc = event.detail;
  let reg = /[^\u0020-\u007E\u00A0-\u00BE\u2E80-\uA4CF\uF900-\uFAFF\uFE30-\uFE4F\uFF00-\uFFEF\u0080-\u009F\u2000-\u201f\u2026\u2022\u20ac\r\n]/g;
    if(desc.match(reg)) {
      this.setData({feedbackDesc:this.data.feedbackDesc});
      return;
    }else{
      this.setData({
        feedbackDesc:event.detail,
      })
    }
  this.setData({
    feedbackDesc:event.detail,
  })
},

inputChange(event) {
  this.setData({
    cstPhone: event.detail.value // 将input的值存入data中的inputVal
  })
},

// 显示弹窗
  showPopup() {
    this.setData({ show: true });
  },
// 隐藏弹窗
  onClose() {
    this.setData({ show: false });
  },
  
//文件上传结束
getUploaderList(e) {
  this.setData({
    fileList2: e.detail.compressList
  })
},

// 提交
submitInfo(){
  this.showLoading(1);
  var datas = this.data;
  var d = {};
  d['feedbackDesc'] = datas.feedbackDesc;
  d['cstCode'] = app.storage.getCstCode();
  d['wxOpenId'] = app.storage.getWxOpenId();
  d['proNum'] = app.storage.getProNum();
  d['cstPhone'] = datas.cstPhone;
  d['fileList'] = datas.fileList2;

  if(!datas.feedbackDesc || datas.feedbackDesc == ''){
    this.showLoading(0);
    app.alert.alert('请描述您的反馈建议，以便我们为您提供更好的服务！');
    return;
  }

  if(datas.cstPhone != null && datas.cstPhone != ''){
    this.showLoading(0);  
    if (!/^1[3456789]\d{9}$/.test(datas.cstPhone)) {
      app.alert.alert('请输入正确的手机号！');
      return;
    }
  }

  // if(this.data.fileList2.length < 1){
  //   this.showLoading(0);
  //   app.alert.alert('请至少上传一张图片');
  //   return;
  // }

  var that = this;
  if(!that.data.feedback_button_disabled){
    that.setData({ feedback_button_disabled: true });
    app.req.postRequest(api.feedback,d).then(value => {
        console.log('反馈响应结果',value.data);
        that.showLoading(0);
        if(value.data.respCode == '000'){
          that.setData({ feedback_button_disabled: false });  
          Toast.alert({
            message:'提交成功',
          }).then(()=>{
            this.toListPage();
          })
        }else{
          that.setData({ feedback_button_disabled: false });
          Toast.alert({
            message:'提交失败,' + value.data.errDesc,
          })
        }
    });
  }

},


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.loading(),
    this.showLoading(0);
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

  //选择快捷回复
  choseDesc:function (){
    console.log('选择快捷回复');
    this.closeQuick();
  },

  closeQuick: function () {
    this.setData({
      showQuickDesc:!this.data.showQuickDesc,
    })
  },

  sureQuick: function (event) {
    console.log('确认选中新值', event.detail);
    var feedbackDesc = this.data.feedbackDesc;
    let valueObj = event.detail.value;
    feedbackDesc = valueObj.text;
    // if(!feedbackDesc || feedbackDesc == ''){
    //   feedbackDesc = valueObj.text;
    // }else{
    //   feedbackDesc += valueObj.text;
    // }
    this.closeQuick();
    if(feedbackDesc.length > 140){
      Toast.alert({
        message:'内容超长，请输入合适内容',
      });
    }else{
      this.setData({
        feedbackDesc: feedbackDesc,
        repairCommonId:valueObj.repairCommonId
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
  }

  
})