// pages/family/memberDetail.js
const api = require('../../const/api'),
  app = getApp();
var that = null;
import Dialog from '../../miniprogram_npm/@vant/weapp/dialog/dialog'
import Toast from '../../miniprogram_npm/@vant/weapp/toast/toast';
Page({

  /**
   * 页面的初始数据
   * 第1位，预约；第2位，缴费；第3位，邻里圈；第4位，问卷调查；第5位，水电煤抄表；第6位，店铺收款；第7位，访客管理；第8位，天气订阅；第9位，业主拜访；{
      name: "天气接收",
      hasAuth: 0,
      loading:false
    }
   */
  data: {
    pageType: 'O',
    moduleBitmap: '',
    authBitmap: '',
    notifyBitmap: '',
    authName: ["预约", "缴费", "邻里圈", "问卷调查", "水电煤抄表", "店铺收款", "访客管理", "天气订阅","打招呼","建议和投诉","生活服务" ,"车辆缴费", "文件公示","业主码","报事报修","支持自定义菜单","便民信息"],
    authList: [],
    notifyAuth: [{
      name: "日常通知",
      hasAuth: 1,
      loading:false
    }, {
      name: "问卷通知",
      hasAuth: 0,
      loading:false
    }],
    memberInfo: '',
    commanyShortName: "",
    areaName: '',
    custId: '',
    huSeqId: '',
    houseSeqId: '',
    headImgUrl: '',
    nickNameShow: false,
    newNickName: '',
    mNickName: '',
    btnText: '关闭用户',
    isLoading: false,
    propType:"R",

    canClosed:'Y',
    canUnRegist:'N',
    dataChanged:'N',
    isShowInfo:false,
    isQueryOther:'Y',
    switchLoading:false,
    iphoneX:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.loading(),that = this;

    var loginInfo = app.storage.getLoginInfo()
    var timestamp = Date.parse(new Date())/1000
    that.setData({
    
      canUnRegist:options.canUnRegist,
      pageType: options.PageType,
      commanyShortName: loginInfo.commanyShortName,
      propType:loginInfo.propType,
      areaName: loginInfo.completeAddr,
      custId: loginInfo.custId,
      huSeqId: loginInfo.huSeqId,
      houseSeqId: loginInfo.houseSeqId,
      moduleBitmap: loginInfo.moduleBitmap,
      headImgUrl: loginInfo.headImgUrl + '?timestamp=' + timestamp,
      iphoneX:app.globalData.iphoneX

    })
    if(this.data.pageType=='O'){
      const eventChannel = this.getOpenerEventChannel()
      eventChannel.on('MemberDetailEvent', function (data) {
        console.log(data.data)
        that.setData({
          memberInfo: data.data,
          authBitmap: data.data.authBitmap.replace(/2/g, '1'),
          notifyBitmap: data.data.notifyBitmap,
          mNickName: data.data.nickName,
          isQueryOther:data.data.isQueryOther
        })
        that.setUsrAuth()
        that.setBtnText()
  
      })
      wx.setNavigationBarTitle({
        title: '详细信息',
      })
    }else{
      wx.setNavigationBarTitle({
        title: '个人资料',
      })
      this.getUsrAuthInfo();
    }
  },

  setUsrAuth() {
    let len = this.data.authName.length

    let tempAuth = Array()
    for (let x = 0; x < len; x++) {
      if (x >= this.data.moduleBitmap.length || x >= this.data.authBitmap.length) {
        break
      }
      let m_A = this.data.moduleBitmap.charAt(x)
      let u_A = this.data.authBitmap.charAt(x)
      let a_name = this.data.authName[x]
      // if(x==8||x==7){
      //   m_A ='0'
      // }
      if (m_A == '1'||m_A == '2') {
        tempAuth.push({
          name: a_name,
          hasAuth: parseInt(u_A)
        })
      }
      // if (m_A == '2') {
      //   tempAuth.push({
      //     name: a_name,
      //     hasAuth: 1
      //   })
      // }
    }
    let tempNotifyAuth = Array()
    let len2 = this.data.notifyAuth.length
    for (let x = 0; x < len2; x++) {
      if (x > this.data.notifyBitmap.length) {
        break
      }
      let n_A = this.data.notifyBitmap.charAt(x)
      this.data.notifyAuth[x].hasAuth = parseInt(n_A)
    }
    console.log("notifyBitmap",this.data.notifyBitmap)

    console.log("notifyAuth",this.data.notifyAuth)

    this.setData({
      authList: tempAuth,
      notifyAuth: this.data.notifyAuth
    })
  },
  tapModify() {
    // if (this.data.memberInfo.stat != 'N') {
    //   wx.showToast({
    //     title: '此住户已关闭',
    //   })
    //   return
    // }
    if(this.data.pageType !='S'){
      return false;
    }
    this.setData({
      nickNameShow: true
    })
  },
  onTapCancleModify() {
    console.log("onTapCancleModify")
    this.setData({
      nickNameShow: false,
      newNickName: ""
    })
  },
  onConfirm() {
    //去掉开头结尾空格
    let str1 = that.data.newNickName.replace(/\s+$/, '')
    // 返回str2
    let str2 = str1.replace(/^\s+/, '')
    if (str2 == '') {
      Toast("请先填写要修改的昵称")
      return;
    }

    var updataParam = {
      custId: that.data.custId,
      huSeqId: that.data.memberInfo.huSeqId,
      nickName: str2,

      authBitmap: that.data.authBitmap,
      notifyBitmap: that.data.notifyBitmap,
    }

    app.req.postRequest(api.updateHouseUsrInfo, updataParam).then(function (value) {
      console.log("updateHouseUsrInfo S ", value);
      if (value.data.RESPCODE == "000") {
        that.setData({
          mNickName: that.data.newNickName
        })
        that.data.dataChanged="Y"
      // app.storage.setStorageSync("hasChangeNickName",true)
      } else {
        Toast(value.data.ERRDESC)
      }


    }, function (value) {
      console.log("updateHouseUsrInfo F ", value);
      wx.showToast({
        icon: 'none',
        title: '修改失败',
      })
    });


  },
  onNKNChange(event) {
    console.log("onNKNChange", event);
    this.setData({
      newNickName : this.filterEmoji(event.detail).replace(/\s+/g,"")
    })
   
  },
  setBtnText() {
    var text = '关闭账号'
    if (this.data.memberInfo.stat == "C") {
      text = "打开账号"
    }
    this.setData({
      btnText: text
    })
  },
  onTapClosedMembers(e) {
    // canClosed:true,
    // canUnRegist:false
    //pageType
    // console.log("onTapClosedMembers  ", that.data.pageType);
    // console.log("onTapClosedMembers  ", that.data.memberInfo.huRole);

    if(that.data.pageType=='O'&&that.data.memberInfo.huRole=='O'){
      Toast("您无法关闭自己的账号！")
      return
    }
  
    let text = '确定要' + that.data.btnText + "?"
    Dialog.confirm({
      title: '提示',
      message: text,
    }).then(() => {
      let c_stat = that.data.memberInfo.stat == "C" ? 'N' : 'C'
      //户主关闭住户
      var updataParam = {
        custId: that.data.custId,
        huSeqId: that.data.memberInfo.huSeqId,
        stat: c_stat,
        nickName: that.data.mNickName,

        authBitmap: that.data.authBitmap,
        notifyBitmap: that.data.notifyBitmap,
      }
      that.setData({
        isLoading: true
      });
      app.req.postRequest(api.updateHouseUsrInfo, updataParam).then(function (value) {
        console.log("updateHouseUsrInfo S ", value);
        let tempM = that.data.memberInfo
        tempM.stat = c_stat
        that.setData({
          memberInfo: tempM,
          isLoading: false
        });
        that.setBtnText()
      }, function (value) {
        console.log("updateHouseUsrInfo F ", value);
        wx.showToast({
          icon: 'none',
          title: '关闭失败',
        })
      });

    }) .catch(() => {
      // on cancel
    });
  
  },
  unregist(){
    let text = '确定要注销?'
    Dialog.confirm({
        title: '提示',
        message: text,
      })
      .then(() => {
        var cancleParam = {
          custId: that.data.custId,
          huSeqId: that.data.memberInfo.huSeqId,
          houseSeqId: that.data.memberInfo.houseSeqId,
          usrSeqId: that.data.huSeqId
        }
        that.setData({
          isLoading: true
        });
        app.req.postRequest(api.cancelHouseUsrInfo, cancleParam).then(function (value) {
          console.log("cancelHouseUsrInfo S ", value);
          if (value.data.RESPCODE == "000") {
            let tempM = that.data.memberInfo
            tempM.stat = "D"
            that.setData({
              memberInfo: tempM,
              isLoading: false
            });

            wx.showToast({
              icon: 'none',
              title: '注销成功',
            })
            that.data.dataChanged="Y"
            app.storage.clearAll();
            // const eventChannel = this.getOpenerEventChannel();
            // eventChannel.emit('dataChangedEvent', {Changed: "Y"});
            wx.navigateBack({
              delta:10
            })
          } else {
            Toast(value.data.ERRDESC);
          }
        }, function (value) {
          console.log("cancelHouseUsrInfo F ", value);
          wx.showToast({
            icon: 'none',
            title: '注销失败',
          })
        });

      })
      .catch(() => {

      });
  },
  /**
   * 关闭 /注销用户
   */
  onTapUnRegist(e) {
  
   this.unregist();
   
    // if(app.storage.getLoginInfo().huRole!='O'){
    //   this.unregist()
      
    // }else{
    //   if(this.data.pageType=='O'){
    //       if(this.data.canUnRegist=='Y'){
    //         this.unregist()
    //       }else{
    //         Toast("房屋有其他成员，不能注销！")
    //       }
    //   }else{
    //     this.unregist()
    //   }
    // }
    // if(this.data.pageType=='O'&&that.data.memberInfo.huRole=='O'&&that.data.canUnRegist=='Y'){
    //   unregist()
    // }else{
    //   Toast("房屋有其他成员，不能注销！")
    // }
  },

  onAuthChange(e) {
    if (that.data.memberInfo.stat == 'C') {
      wx.showToast({
        title: '此住户已关闭',
        icon:"error"
      })
      return
    }
    if (that.data.memberInfo.stat == 'P') {
      wx.showToast({
        title: '认证后方可操作',
        icon:"error"
      })
      return
    }
    console.log("onAuthChange", e)
    let index = e.currentTarget.dataset.index
    let selItem = e.currentTarget.dataset.bitem.name
    let orcIndex = that.data.authName.indexOf(selItem)
    var authItem = 'authList[' + index + ']';
    let newBitmap = that.modifyBitmap(orcIndex, that.data.authBitmap)
    that.setData({
      [authItem + '.loading']: true
    })
    var updataParam = {
      custId: that.data.custId,
      huSeqId: that.data.memberInfo.huSeqId,
      nickName: that.data.mNickName,

      authBitmap: newBitmap,
      notifyBitmap: that.data.notifyBitmap,
    }

    app.req.postRequest(api.updateHouseUsrInfo, updataParam).then(function (value) {
      console.log("updateHouseUsrInfo S ", value);
     if( app.storage.getLoginInfo().huSeqId==that.data.memberInfo.huSeqId){
        that.data.dataChanged="Y"
       }
  

      that.setData({
        [authItem + '.hasAuth']: e.detail ? 1 : 0,
        [authItem + '.loading']: false,
        authBitmap: newBitmap
      });
    }, function (value) {
      console.log("updateHouseUsrInfo F ", value);
      wx.showToast({
        icon: 'none',
        title: '修改失败',
      })
    });

  },
  modifyBitmap(index, bitmap) {
    let c = bitmap.charAt(index) == 0 ? 1 : 0
    return bitmap.substr(0, index) + c + bitmap.substr(index + 1, bitmap.length - 1 - index);
  },
  onNotifyChange(e) {
    // if (that.data.memberInfo.stat != 'N') {
    //   wx.showToast({
    //     title: '此住户已关闭',
    //   })
    //   return
    // }
    console.log("onAuthChange", e)
    let index = e.currentTarget.dataset.index
    var notifyItem = 'notifyAuth[' + index + ']';
    let newBitmap = that.modifyBitmap(index, that.data.notifyBitmap)
    that.setData({
      [notifyItem + '.loading']: true
    })
    var updataParam = {
      custId: that.data.custId,
      huSeqId: that.data.memberInfo.huSeqId,
      nickName: that.data.mNickName,
      authBitmap: that.data.authBitmap,
      notifyBitmap: newBitmap,
    }

    app.req.postRequest(api.updateHouseUsrInfo, updataParam).then(function (value) {
      console.log("updateHouseUsrInfo S ", value);
      // app.storage.setStorageSync("hasChangeNickName",true)
      // that.data.dataChanged="Y"
      that.setData({
        [notifyItem + '.hasAuth']: e.detail ? 1 : 0,
        [notifyItem + '.loading']: false,
        notifyBitmap: newBitmap
      });
    }, function (value) {
      console.log("updateHouseUsrInfo F ", value);
      wx.showToast({
        icon: 'none',
        title: '修改失败',
      })
    });


  },
  showInfo(){
    this.setData({
      isShowInfo:!this.data.isShowInfo
    })

  },
  onShareChange(e){
    console.log("onShareChange  ", e);
    this.setData({
      switchLoading:true
    })
    var updataParam = {
      huSeqId: this.data.memberInfo.huSeqId,
      isQueryOther:e.detail?"Y":"N",
    }
    app.req.postRequest(api.updateHouseUsrInfo, updataParam).then(function (value) {
      console.log("updateHouseUsrInfo S ", value);
      that.setData({
        switchLoading:false,
        isQueryOther:e.detail?"Y":"N",
      })
    }, function (value) {
      console.log("updateHouseUsrInfo F ", value);
      that.setData({
        switchLoading:false
      })
      wx.showToast({
        icon: 'none',
        title: '修改失败',
      })
    });

  },  
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },
   filterEmoji(name){
    var str = name.replace(/[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF][\u200D|\uFE0F]|[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF]|[0-9|*|#]\uFE0F\u20E3|[0-9|#]\u20E3|[\u203C-\u3299]\uFE0F\u200D|[\u203C-\u3299]\uFE0F|[\u2122-\u2B55]|\u303D|[\A9|\AE]\u3030|\uA9|\uAE|\u3030/ig, '');
     return str;
    },

    regStrFn: function (str) {
      // 转换一下编码
    　　let reg = /([^\u0020-\u007E\u00A0-\u00BE\u2E80-\uA4CF\uF900-\uFAFF\uFE30-\uFE4F\uFF00-\uFFEF\u0080-\u009F\u2000-\u201f\u2026\u2022\u20ac\r\n])|(\s)/g,
      　　indexArr = reg.exec(str);
    if (str.match(reg)) {
      　　str = str.replace(reg, '');
    }
    let obj = { val: str, index: indexArr }
    return obj
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // app.storage.setStorageSync("hasChangeNickName",true)

  },

  getUsrAuthInfo(){
    this.showLoading(1);
    var data = {
      houseSeqId: app.storage.getLoginInfo().houseSeqId,
      huSeqId:app.storage.getLoginInfo().huSeqId
    }
    app.req.postRequest(api.getHouseUsrInfo, data).then(function (value) {
      console.log("queryUserInfo  ", value);
      console.log("getLoginInfo  ", app.storage.getLoginInfo());
      that.showLoading(0);
      if (value.data.houseUsrInfo && value.data.houseUsrInfo.length > 0) {

       
        that.setData({
          memberInfo: value.data.houseUsrInfo[0],
          mNickName:value.data.houseUsrInfo[0].nickName,
       
          authBitmap: value.data.houseUsrInfo[0].authBitmap.replace(/2/g, '1'),
          notifyBitmap:value.data.houseUsrInfo[0].notifyBitmap,
        })
        if(value.data.houseUsrInfo[0].huRole!=app.storage.getLoginInfo().huRole){
          let custId = app.storage.getLoginInfo().custId
          if(custId != '' && custId != undefined){
           that.data.dataChanged="Y"
           
          }
         }
         if(value.data.houseUsrInfo[0].stat!=app.storage.getLoginInfo().huStat){
          let custId = app.storage.getLoginInfo().custId
          if(custId != '' && custId != undefined){
           that.data.dataChanged="Y"
            
          }
         }
         that.compareAuthBitmap(value.data.houseUsrInfo[0].authBitmap)
         that.setUsrAuth()
         that.setBtnText()

      }
    }, function (value) {
      console.log("queryAuthInfo F ", value);
    });
  },
  compareAuthBitmap(authMap){ // 
    let loginMap = app.storage.getLoginInfo().authBitMap
    let m_a = app.storage.getLoginInfo().moduleBitmap
    let retBitmap=''
    for(let x=0;x<m_a.length;x++){
      if(x==authMap.length){
        break
      }
      if(m_a.charAt(x)=='0'|| (m_a.charAt(x)=='2' && authMap.charAt(x) != '0')){
        retBitmap=retBitmap+m_a.charAt(x)
      }else{
        retBitmap=retBitmap+authMap.charAt(x)
      }
    }
    console.log("compareAuthBitmap retBitmap ", retBitmap);
    console.log("compareAuthBitmap loginMap  ", loginMap);
    if(loginMap!='undefined'&&loginMap!=retBitmap){
      let custId = app.storage.getLoginInfo().custId
      if(custId != '' && custId != undefined){
        this.data.dataChanged="Y"
        return
      }
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
    console.log("onUnload")
    app.globalData.needCleanSession == 'Y'
    const eventChannel = this.getOpenerEventChannel();
    eventChannel.emit('dataChangedEvent',  {Changed: this.data.dataChanged});
  },
  uploadHeadImg:function(){
    let headImgUrl = that.data.headImgUrl ? that.data.headImgUrl.split('?')[0] : '';
    wx.navigateTo({
      url: '/subpages/family/chooseImg/chooseImg?headImgUrl=' + headImgUrl
    })
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

  }
})