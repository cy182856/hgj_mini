const apiUtil = require('../../../const/api.js');
import { queryMutipUsr } from '../../../const/api.js';
import Dialog from '../../../miniprogram_npm/@vant/weapp/dialog/dialog';
import Toast from '../../../miniprogram_npm/@vant/weapp/toast/toast';
const api = require('../../../const/api'),
app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    'isCHeck':'',
    'cstCode':'',
    'cstName':'',
    'houseId':'',
    'houseName':'',
    'proNum':'',
    'proName':'',
    'custid':'',
    'huSeqId':'',
    'wxOpenId':'',
    'userName':'',
    'sign':'',
    'houseinfo':'',
    'isCHeckShow':true,
    'skeletonShow':true,
    'showConfirmHousePage':false,
    'showErrMsg':false,
    'showOverLay':false,
    'showClaim':false,
    'disabled':'none',
    'empty_src': "/assets/icons/empty/no-data.png",
    'msg':'',
     checked: false,
     commanyShortName: '',
     areaName:'',
    'back':'N',
    'packCode':'',
    'houseNo':'',
    'nickName':'',
     selectArea: {areaId:'0', areaName: "选择区域"},
     selectBuilding: {buildingId:'0',buildingName: '选择楼号'},
     select_height:580,
     areaList: [],
     buildingList: [],
    'bindMode':'',
    'hgjOpenid':'',
    'RES_SIGN':'',
    'areaId':'',
    'buildingId':'',
    'isPackCode':'N',
    'packPageTip':'',
    showSuccess:false,
    'miniProgramName':'',
    'propType':'',
    searchHouseNoList:[],
    searchText:'',
    showHouseNo:false
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
     let cstCode = options.cstCode;
     let cstName = options.cstName;
     let houseId = options.houseId;
     let houseName = options.houseName;
     let proNum = options.proNum;
     var data = {};
     app.loading(),this.showLoading(1);
    if (this.dataIsIllegal(cstCode) || this.dataIsIllegal(cstName) || this.dataIsIllegal(proNum)
    ||this.dataIsIllegal(houseId)|| this.dataIsIllegal(houseName)) {
      this.setData({
        'skeletonShow':false,
        'showConfirmHousePage':false,
        'isCHeckShow':false,
        'showErrMsg':true,
        'msg':'数据不合法'
      });
      this.showLoading(0);
      return;
    }
    // 登录获取wxOpenId
      wx.login({
        success:res=>{
          data['code'] = res.code;
          data['cstCode'] = cstCode;
          data['cstName'] = cstName;
          data['houseId'] = houseId;
          data['houseName'] = houseName;
          console.log('成功获取了code');
          app.req.postRequest(api.queryMutipUsr,data).then(res=>{
            if(res.data.respCode == '000'){
              this.showLoading(0);
              let wxOpenId = res.data.wxOpenId;
              let isCHeck = res.data.isCHeck;
              let proName = res.data.proName;
              let intoUserName = res.data.userName;
              let token = res.data.token;
              console.log("wxOpenId:" + wxOpenId);    
              app.storage.setWxOpenId(wxOpenId);
              app.storage.setCstCode(cstCode);
              app.storage.setToken(token);
              app.storage.setProNum(proNum);
              app.storage.setProName(proName);
              app.storage.setIntoUserName(intoUserName);
              app.storage.setHouseId(houseId);
              app.storage.setHouseName(houseName);
              this.setData({
                cstCode:cstCode,
                cstName:cstName,
                wxOpenId:wxOpenId,
                proNum:proNum,
                isCHeck:isCHeck,
                proName:proName,
                houseId:houseId,
                houseName:houseName,
                intoUserName:intoUserName
              })    
              if(this.data.isCHeck == 'Y'){
                this.setData({
                  'isCHeckShow':false,
                });
                wx.redirectTo({
                  url: '../../main/main?cstCode=' + this.data.cstCode + '&wxOpenId=' + this.data.wxOpenId + '&proNum=' + this.data.proNum
                });
              }
            }else{
              this.showErrDesc(res);
            }
          }).catch(error => {
            wx.showModal({
              title: '获取用户信息失败',
              content: error.message,
              duration:3000
            }) 
          });
        },
      });
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
    // 绑定成功后， 点击返回，重新自动跳入主页
    var back = this.data.back;
    var cstCode = this.data.cstCode;
    var wxOpenId = this.data.wxOpenId;
    if (back == 'Y') {
      wx.redirectTo({
        url: '../../main/main?cstCode=' + cstCode + '&wxOpenId=' + wxOpenId
      });
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
  onChange(event) {
    var disbaled = '';
    if (!event.detail) {
      disbaled = "none";
    }
    this.setData({
      checked: event.detail,
      disabled: disbaled
    });
  },
  confirmCheckIn:function() {
    var that = this;
    Dialog.confirm({
      title: '提示',
      message: '信息是否无误，确认入住？',
      confirmButtonColor: '#189AFE',
    }).then(() => {
      that.houseBind();
    }).catch(() => {
      
    });
  },


  /**
   * 房屋绑定请求
   */
  houseBind: function() {
    console.log("-------houseBind------");
    let cstCode = this.data.cstCode;
    let wxOpenId = this.data.wxOpenId;
    let userName = this.data.userName;
    let houseId = this.data.houseId;
    console.log("-------userName------" + userName);

    if(userName == '' || userName == null){
      this.showLoading(0);
      app.alert.alert('请填写您的姓名！');
      return;
    }
    
    if(userName.length == 1){
      this.showLoading(0);
      app.alert.alert('姓名必须大于两个字！');
      return;
    }

    var data = {}
    data['cstCode'] = cstCode;
    data['wxOpenId'] = wxOpenId;
    data['userName'] = userName;
    data['houseId'] = houseId;
    this.houseConfirmBind(data);
    return;
  },


  houseConfirmBind:function(data) {
    console.log("houseConfirmBind----"+data.cstCode+"--------------"+"----wxOpenId"+data.wxOpenId+"--------userName"+data.userName+"--------houseId"+data.houseId)
    var that = this;
    var header = {
      'content-type': 'application/json'
    }
    app.req.postRequest(
      apiUtil.houseBindTenant,
      data
    ).then(function (res) {
      console.log("res.data.respCode ==" + res.data.respCode);
      // 租户入住申请成功
      if (res.data.respCode == '000') {
        // wx.redirectTo({
        //   url: '../../main/main?cstCode=' + data.cstCode + '&wxOpenId=' + data.wxOpenId
        // });
        // that.setData({
        //   'back':'Y'
        // });
        that.setData({         
          'showErrMsg':true,
          'isCHeckShow':false,
          'msg':'入住申请成功'
        });
      } else { // 绑定失败
        that.setData({
          'skeletonShow':true,
          'showConfirmHousePage':false,
          'showSuccess':false,
          'showClaim':false,
          'showErrMsg':true,
          'isCHeckShow':false,
          'showOverLay':false,
          'msg':res.data.errDesc
        });
      }
    }).catch(error => {
      that.showLoading(0);
      that.setData({
        'skeletonShow':true,
        'showConfirmHousePage':false,
        'showSuccess':false,
        'showClaim':false,
        'showErrMsg':true,
        'showOverLay':false,
        'msg':'网络异常，请稍后再试'
      });
    });
  },

  dataIsIllegal: function(data) {
    if (data == null || data == '' || data == undefined) {
      return true;
    }
    return false;
  },

  inputChange(event) {
    this.setData({
      // 将input的值存入data中的inputVal
      userName: event.detail.value 
    })
  },

})
