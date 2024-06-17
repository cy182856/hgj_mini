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
    'cstIntoId':'',
     houseList: [],
    'cstName':'',
    'proNum':'',
    'proName':'',
    'custid':'',
    'huSeqId':'',
    'wxOpenId':'',
    'userName':'',
    'phone':'',
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
    // console.log("住户房屋绑定跳转接收....")
    // console.log(options);
     //let that=this;
     let cstCode = options.cstCode;
     let cstName = options.cstName;
     let proNum = options.proNum;
     let cstIntoId = options.cstIntoId;
     //let isCHeck = options.isCHeck;
     let sign = options.sign;
     var data = {};
     app.loading(),this.showLoading(1);
    if (this.dataIsIllegal(cstCode) || this.dataIsIllegal(cstName) || this.dataIsIllegal(proNum) || this.dataIsIllegal(cstIntoId)) {
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
          data['cstIntoId'] = cstIntoId;
          console.log('成功获取了code');
          app.req.postRequest(api.queryMutipUsr,data).then(res=>{
            if(res.data.respCode == '000'){
              this.showLoading(0);
              let wxOpenId = res.data.wxOpenId;
              let isCHeck = res.data.isCHeck;
              let proName = res.data.proName;
              let intoUserName = res.data.userName;
              let houseList = res.data.houseList;
              console.log("wxOpenId:" + wxOpenId);    
              app.storage.setWxOpenId(wxOpenId);
              app.storage.setCstCode(cstCode);
              app.storage.setProNum(proNum);
              app.storage.setProName(proName);
              app.storage.setIntoUserName(intoUserName);
              this.setData({
                cstCode:cstCode,
                cstName:cstName,
                wxOpenId:wxOpenId,
                proNum:proNum,
                isCHeck:isCHeck,
                proName:proName,
                intoUserName:intoUserName,
                cstIntoId:cstIntoId,
                houseList:houseList
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

     //let houseinfo = options.houseinfo;
    // app.loading(),this.showLoading(1);
    
    // if (this.dataIsIllegal(houseinfo)) {
    //   houseinfo = ''; // 防止传入后台是undefine字符串串
    // }
 
    
    // 已入住直接跳转到主页


    // // 扫物业码需要确认页面
    // if (houseinfo == '') {
    //   // 房屋信息为空，直接调用houseBind
    //   wx.setNavigationBarTitle({
    //     title: '入住申请' 
    //   })
    //   //this.houseBind();
    // } else {
    //    // 房屋信息存在，页面展示
    //    this.getHouseInfo();
    // }
  },

  // huCheckIn:function()  {
  //   let cstCode = this.data.cstCode;
  //   let wxopenid = this.data.wxopenid;
  //   console.log('按钮被点击了' + cstCode+"---"+wxopenid+"----");
  // },

 
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
    var custId = this.data.custid;
    var huSeqId = this.data.huSeqId;
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
      //that.showLoading(1);
      // that.setData({
      //   'showOverLay':true
      // });
      that.houseBind();
    }).catch(() => {
      
    });
  },
  protocolDetail:function() {
    let shortName = this.data.commanyShortName;
    let miniProgramName = this.data.miniProgramName;
    var pathurl = '../protocol/protocol?shortName=' + shortName + '&miniProgramName=' + miniProgramName;
    wx.navigateTo({
      url: pathurl
    });
  },

  getHouseInfo:function() {
    let custid = this.data.custid;
    let wxOpenId = this.data.wxOpenId;
    let sign = this.data.sign;
    let houseinfo = this.data.houseinfo;
    var that = this;
    wx.login({
      success(login_res){
        if (login_res.code) {
          var data = {
            custId:custid,
            wxOpenId:wxOpenId,
            sign:sign,
            code:login_res.code,
            houseInfo:houseinfo
          };
          app.req.postRequest(
            apiUtil.queryHouseInfo,
            data
          ).then(function (res) {
              that.showLoading(0);
              console.log(res.data)
              if (res.data.RESPCODE == '342') { // 未认领
                wx.setNavigationBarTitle({
                  title: '入住确认' 
                })
                that.setData({
                  'skeletonShow':true,
                  'showSuccess':false,
                  'showConfirmHousePage':true,
                  'showErrMsg':false,
                  'showClaim':false,
                  'commanyShortName':res.data.SHORTNAME,
                  'areaName':res.data.AREANAME,
                  'buildingName':res.data.BUILDINGNAME,
                  'houseNo':res.data.HOUSENO,
                  'huRoleDesc':res.data.HUROLEDESC,
                  'RES_SIGN':res.data.SIGN,
                  'miniProgramName':res.data.MINIPROGRAMNAME,
                   hgjOpenid:res.data.HGJOPENID,
                });
              } else if (res.data.RESPCODE == '000') { // 该房屋重复认领
                that.setData({
                  huSeqId:res.data.HUSEQID,
                  'skeletonShow':true,
                  showSuccess:true,
                  'showConfirmHousePage':false,
                  'showClaim':false,
                });
              } else { // 失败
                that.setData({
                  'skeletonShow':true,
                  'showConfirmHousePage':false,
                  'showSuccess':false,
                  'showClaim':false,
                  'showErrMsg':true,
                  'msg':res.data.ERRDESC
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
              'msg':'网络异常，请稍后再试'
            });
          });


        } else {
          that.showLoading(0);
          that.setData({
            'skeletonShow':true,
            'showConfirmHousePage':false,
            'showSuccess':false,
            'showClaim':false,
            'showErrMsg':true,
            'showOverLay':false,
            'msg':login_res.errMsg
          });
        }
      }
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
    let phone = this.data.phone;
    let cstIntoId = this.data.cstIntoId;
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
    if(phone == '' || phone == null){
      this.showLoading(0);
      app.alert.alert('请填写您的手机号！');
      return;
    }
    if(phone != null && phone != ''){
      if (!/^1[3456789]\d{9}$/.test(phone)) {
        app.alert.alert('请输入正确的手机号！');
        return;
      }
    }
  
    //let sign = this.data.sign;
    //let houseinfo = this.data.houseinfo;
    //let hgjOpenid = this.data.hgjOpenid;
    //var that = this;
    //if (hgjOpenid != '') {
    //if (wxopenid != '') {
      
      var data = {}
      data['cstCode'] = cstCode;
      data['wxOpenId'] = wxOpenId;
      data['userName'] = userName;
      data['phone'] = phone;
      data['cstIntoId'] = cstIntoId;
      this.houseConfirmBind(data);
      return;
    //}
    // wx.login({
    //   success(login_res){
    //     if (login_res.code) {
    //       // 调用内部接口begin
    //       var data = {
    //         cstCode:cstCode,
    //         wxOpenId:wxOpenId,
    //         sign:sign,
    //         code:login_res.code,
    //         hgjOpenid:hgjOpenid,
    //         houseInfo:houseinfo
    //       };
    //       that.houseConfirmBind(data);
    //       // 调用内部接口end
    //     } else {
    //       that.showLoading(0);
    //       that.setData({
    //         'skeletonShow':true,
    //         'showConfirmHousePage':false,
    //         'showClaim':false,
    //         'showSuccess':false,
    //         'showErrMsg':true,
    //         'showOverLay':false,
    //         'msg':login_res.errMsg
    //       });
    //     }
    //   }
    // });
  },

  redirectMainPage:function() {
    let custid = this.data.custid;
    let huSeqId = this.data.huSeqId;
    wx.redirectTo({
      url: '../../main/main?custId=' + custid + '&huSeqId=' + huSeqId
    });
  },

  houseConfirmBind:function(data) {
    console.log("houseConfirmBind----"+data.cstCode+"--------------"+"----wxOpenId"+data.wxOpenId+"--------userName"+data.userName+"-----------------" + data.cstIntoId)
    var that = this;
    var header = {
      'content-type': 'application/json'
    }
    app.req.postRequest(
      apiUtil.houseBind,
      data
    )
    // app.req.requestAll(apiUtil.houseBind, 
    //   data, header, "POST")
      .then(function (res) {
      //that.showLoading(0);
      console.log("res.data.respCode ==" + res.data.respCode);
      if (res.data.respCode == '000') { // 绑定成功或重复绑定成功
        wx.redirectTo({
          url: '../../main/main?cstCode=' + data.cstCode + '&wxOpenId=' + data.wxOpenId
        });
        that.setData({
          'back':'Y'
          //'huSeqId':res.data.HUSEQID
        });
      }else if (res.data.respCode == '103') { // 跳转住户认领页面
        console.log(res);
        that.setData({
          'showClaim':true,
          'skeletonShow':true,
          'false':false,
          'showConfirmHousePage':false,
          'showSuccess':false,
          'commanyShortName':res.data.SHORTNAME,
          'nickName':res.data.NICKNAME,
          'bindMode':res.data.BINDMODE,
          'hgjOpenid':res.data.HGJOPENID,
          'RES_SIGN':res.data.SIGN,
          'isPackCode':res.data.ISPACKCODE,
          'packPageTip':res.data.PACKPAGETIP,
          'miniProgramName':res.data.MINIPROGRAMNAME,
          'propType':res.data.PROPTYPE,
        });
        that.getAreaInfo();
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

  bindKeyInputClaimCode:function(e) {
    this.setData({
      packCode: e.detail.value
    })
  },
  inputChange(event) {
    this.setData({
      userName: event.detail.value // 将input的值存入data中的inputVal
    })
  },
  inputChangePhone(event) {
    this.setData({
      phone: event.detail.value // 将input的值存入data中的inputVal
    })
  },
  bindKeyInputHouseNo:function(e) {
    this.setData({
      houseNo: e.detail.value,
      searchText:e.detail.value
    })
    this.queryHouseNos();
  },
  queryHouseNos:function() {
    var houseNo = this.data.houseNo;
    if (houseNo.length >= 2) {
      var that = this;
      // 根据buildingId, areaId 查询室号
      var data = {
        custId:this.data.custid,
        areaId:this.data.areaId,
        buildingId:this.data.buildingId,
        wxOpenId:this.data.wxOpenId,
        hgjOpenid:this.data.hgjOpenid,
        huRole:'O',
        bindMode:this.data.bindMode,
        sign:this.data.RES_SIGN,
        houseNo: houseNo
      }
      that.showLoading(1);
      app.req.postRequest(
        apiUtil.queryHouseNoList,
        data
      ).then(function (res) {
          that.showLoading(0);
          if (res.data.RESPCODE == '000' && res.data.houseNos.length != 0) { // 成功
            that.setData({
              showQueryHouseNo:true,
              searchHouseNoList:res.data.houseNos
            });
          } else { // 获取室号信息失败
            that.setData({
              searchHouseNoList:[],
              showQueryHouseNo:false
            });
          }
      }).catch(error => {
          that.showLoading(0);
          that.setData({
            searchHouseNoList:[],
            showQueryHouseNo:false
          });
      });
    } else {
      this.setData({
        showQueryHouseNo:false
      });
    }
  },
  chooseQueryHouseNo:function(e) {
    console.log(e);
    this.setData({
      houseNo: e.currentTarget.dataset.houseno
      ,showQueryHouseNo:false
    })
  },
  bindKeyInputNickName:function(e) {
    
    let nickName = filterEmoji(e.detail.value);
    console.log(nickName);
    this.setData({
      nickName: nickName
    })
  },

  getAreaInfo: function() {
      
    var data = {
      custId:this.data.custid,
      wxOpenId:this.data.wxOpenId,
      hgjOpenid:this.data.hgjOpenid,
      huRole:'O',
      bindMode:this.data.bindMode,
      sign:this.data.RES_SIGN
    };
    var that = this;
    // 获取区域信息
    app.req.postRequest(
      apiUtil.queryAreaInfo,
      data
    ).then(function (res) {
        if (res.data.RESPCODE == '000') { // 成功
          if (res.data.propAreaInfoDtos == null || res.data.propAreaInfoDtos.length == 0) {
            that.setData({
              areaId:'000',
              buildingList:  res.data.propBuildingInfoDtos
            });
          } else {
            that.setData({
              areaList:res.data.propAreaInfoDtos
            });
          }
        } else { // 获取区域信息失败
          that.showLoading(0);
          that.setData({
            'skeletonShow':true,
            'showConfirmHousePage':false,
            'showSuccess':false,
            'showClaim':false,
            'showErrMsg':true,
            'showOverLay':false,
            'msg':res.data.ERRDESC
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

  onAreaChange: function(e) {
    console.log(e);
    let index = e.currentTarget.dataset.index;
    console.log("area: " + index)
    this.selectComponent('#area').toggle();
    
    this.setData({
      selectArea: this.data.areaList[index],
      buildingList: [],
      areaId:this.data.areaList[index].areaId,
      buildingId:'0',
      selectBuilding: {buildingId:'0', buildingName: '选择楼号'},
      showHouseNo:false,
      showQueryHouseNo:false,
      houseNo:'',
    })
    this.onRequestBuilding()
  },

  onRequestBuilding:function() {
    var data = {
      custId:this.data.custid,
      areaId:this.data.areaId,
      wxOpenId:this.data.wxOpenId,
      hgjOpenid:this.data.hgjOpenid,
      huRole:'O',
      bindMode:this.data.bindMode,
      sign:this.data.RES_SIGN
    }
    var that = this;
    that.showLoading(1);
    // 获取区域信息
    app.req.postRequest(
      apiUtil.getBuildingInfo,
      data
    ).then(function (res) {
      that.showLoading(0);
        if (res.data.RESPCODE == '000') { // 成功
          that.setData({
            buildingList:  res.data.propBuildingInfoDtos
          })
        } else { 
          
        }
    }).catch(error => {
      that.showLoading(0);
    });
  },

  onBuildingChange: function(e) {
    let index = e.currentTarget.dataset.index;
    this.selectComponent('#building').toggle();
    console.log(this.data.buildingList[index].buildingId);
    this.setData({
      selectBuilding: this.data.buildingList[index],
      buildingId:this.data.buildingList[index].buildingId,
      showHouseNo:true,
    })
    this.queryHouseNos();
  },

  /**申请入住 */
  applyConfirmCheckIn:function() {
    let areaId = this.data.areaId;
    let buildingId = this.data.buildingId;
    let houseNo = this.data.houseNo;
    let nickName = this.data.nickName;
    let packCode = this.data.packCode;
    if (areaId == '0' || this.dataIsIllegal(areaId)) {
      Toast("请选择区域");
      return;
    }
    if (buildingId == '0' || this.dataIsIllegal(buildingId)) {
      Toast("请选择楼号");
      return;
    }
    if (this.dataIsIllegal(houseNo)) {
      Toast("请输入室号");
      return;
    }
    if (this.dataIsIllegal(nickName)) {
      Toast("请输入昵称");
      return;
    }
    if(this.data.isPackCode == 'Y') {
      if (this.dataIsIllegal(packCode)) {
        Toast("请输入认领码");
        return;
      }
    }    
    var that = this;
    Dialog.confirm({
      title: '提示',
      message: '信息是否无误，确认申请入住？',
      confirmButtonColor: '#189AFE',
    }).then(() => {
      that.showLoading(1);
      var data = {
        custId:this.data.custid,
        wxOpenId:this.data.wxOpenId,
        sign:this.data.RES_SIGN,
        hgjOpenid:this.data.hgjOpenid,
        houseInfo:'',
        huRole:'O',
        bindMode:this.data.bindMode,
        version:'10',
        nickName:this.data.nickName,
        areaId:areaId,
        buildingId:buildingId,
        nickName:nickName,
        houseNo:houseNo,
        packCode:packCode,
      };
      app.req.postRequest(
        apiUtil.houseBind,
        data
      ).then(function (res) {
        that.showLoading(0);
        if (res.data.RESPCODE == '000') { // 成功
          wx.redirectTo({
            url: '../../main/main?custId=' + res.data.CUSTID + '&huSeqId=' + res.data.HUSEQID
          });
          that.setData({
            'back':'Y'
            ,'huSeqId':res.data.HUSEQID
          });
        } else { 
            Dialog.alert({
              message: res.data.ERRDESC,
              confirmButtonColor: '#189AFE',
            }).then(() => {
              // on close
            });
        }
      }).catch(error => {
        that.showLoading(0);
        Dialog.alert({
          message: '网络异常，请稍后再试',
          confirmButtonColor: '#189AFE',
        }).then(() => {
          // on close
        });
      });
    }).catch(() => {
      that.showLoading(0);
    });
  },

  onDropMenuOpen() {
    // console.log("onDropMenuOpen")
  },
  onDropMenuClose() {
    // console.log("onDropMenuClose")
  },
})

function filterEmoji(name){
    var str = name.replace(/[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF][\u200D|\uFE0F]|[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF]|[0-9|*|#]\uFE0F\u20E3|[0-9|#]\u20E3|[\u203C-\u3299]\uFE0F\u200D|[\u203C-\u3299]\uFE0F|[\u2122-\u2B55]|\u303D|[\A9|\AE]\u3030|\uA9|\uAE|\u3030/ig, "");
    return filterSpace(str);
}
/** 替换空格键2 */

function filterSpace(name){
    var str = name.replace(/\s+/g, '');
    return str;
}