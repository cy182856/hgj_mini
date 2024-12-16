import Toast from './../../miniprogram_npm/@vant/weapp/dialog/dialog';
var that = null;
const api = require('../../const/api'),
  app = getApp(),
  // life = require('../../template/home/life.js');
  life = require('../../template/life/home/home.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    homeDot:false,
    background: [''],
    indicatorDots: false,
    vertical: false,
    autoplay: false,
    interval: 2000,
    duration: 500,
    advertsShow:0,
    advertsImg:'',
    advertsUrl:'',
    active: 0,
    functionList: [],
    headImgUrl: '',
    nickName: '',
    commanyShortName: '',
    areaName: '',
    buildingName: '',
    eye: '1',
    houseStat: '',
    userAuthInfo: '',
    showUser: false,//用户切换
    userList: [],//用户列表

    houseKeepList:[],//管家信息列表

    userAvatarUrl: app.storage.getUserAvatarUrl(),// 用户头像
    userNickName: app.storage.getUserNickName(),// 用户昵称

    showTel: false,//电话选择
    telList: [],//电话列表

    showWechat: false,//企业微信联系

    obj: null //用户

    , gobj: null //公告对象
    , gonggaoList: null
    , notReadNum:''
    , showPost: false //控制公告是否展示
    , canShowMineRelease: false //是否显示我的发布

    , houseNum: 0 //小区房屋
    , showHouse: false //默认房屋选择弹窗不显示
    , tempToSpeUrl: ''//菜单进来时的默认需要跳转的功能ID
    , showCancel: false //首页默认不显示取消

    , onLoad: false //默认不走onLoad,走了onLoad则改为true

    , version: 'V 1.0.0'//发布版本号
    , ggBtn: '确定'
    // ,myTime:0 //记录进入我的的次数
    , bg: 0 //弹窗设置模糊度
    , showWechatImg: false //企业微信的图片指引

    , hgjModuleId: '' //带参数进来记录改值
    , custId: '' //带参数进来的custId
    , cstCode: ''
    , cstName:app.storage.getCstName()
    , wxOpenId: ''
    , proNum: ''
    , proName:''
    , intoUserName:app.storage.getIntoUserName()
    , houseId:''
    , houseName:''
    , qrCode:''

    , showLife: false //生活服务，默认不开启

    , menu: {
      //问题反馈
      showAdvice: false
      , curBit: '9999'
      , funList: null
      , title: ''
    }
    // , desc: 'Hi，欢迎来到智慧社区服务平台。\n' +
    //   '1）平台可提供以下业主日常所需服务：公告、通知、报修、投票、缴费、' + '文件公示、邻里圈、访客、场地预约、门禁、车辆、充电桩等；\n' +
    //   '2）服务仅对业主部分开放，您可向所属的物业公司人员咨询入驻流程；'
    // , timestamp: Date.parse(new Date()) / 1000
    , desc: 'Hi，欢迎来到智慧社区服务平台。\n' +
    '服务仅对业主部分开放，您可向所属的物业公司人员咨询入驻流程。'
  , timestamp: Date.parse(new Date()) / 1000
  },
  // tabbar切换
  onChange(event) {
    var loginInfo = app.storage.getLoginInfo();
    var loginNickName = loginInfo.nickName == '' ? '' : loginInfo.nickName
    this.setData({
      headImgUrl: loginInfo.headImgUrl == '' ? '' : loginInfo.headImgUrl + "?timestamp=" + that.data.timestamp,
      nickName: loginNickName,
      commanyShortName: loginInfo.commanyShortName,
      areaName: loginInfo.areaName,
      buildingName: loginInfo.buildingName,
      houseStat: loginInfo.houseStat
    })
    let active = event.detail;//当前处于哪个tabbar
    //切换tabbar,动态修改名称
    if(active == 0){
      this.setTitleName("智慧管家");
      wx.setNavigationBarColor({
        frontColor: '#FFFFFF',
        backgroundColor: '#81D8CF'    
      })
    }
    if(active == 1){
      this.setTitleName("我的");
      wx.setNavigationBarColor({
        frontColor: '#FFFFFF',
        backgroundColor: '#81D8CF'    
      })
    }
    // life.init(Toast,api,app,this);
    
    let index = false;//首页
    let isMineActive = false; //我的，默认当前不是点击我的
    let isLife = false;//生活服务
    //当前激活的页面
    switch (active) {
      case 0: index = true; break;//当前激活的是首页
      case 1: {
        let showLife = this.data.showLife;
        if (showLife) {
          isLife = true;
        } else {
          isMineActive = true;
        }
      }; break;
      case 2: isMineActive = true; break;
    }
    console.log('激活页面的结果', index, isLife, isMineActive);
    //初始化生活服务业务
    if (isLife) {
      //当前有生活服务板块
      life.init(Toast, api, app, this);
    }
    if (isMineActive) {
      // let myTime = this.data.myTime;
      // if(myTime == 0){
      //   this.setData({
      //     myTime:1
      //   })
      //this.initCanShowMyRelease();
      //this.queryMutipUsr();
      //this.queryMenuList();
      // }
    }
    // 修改昵称后，页面切换，nickName 不刷新
    var loginNickName = loginInfo.nickName == '' ? '' : loginInfo.nickName
    this.setData({
      active: active,
      showCancel: true
    })
  },
  //修改tabbar对应的小区名
  setTitleName(indexName) {
    //var indexName = '首页';
    // var name = loginInfo.commanyShortName;
    // if (name && name != '') {
    //   indexName = name;
    // }
    wx.setNavigationBarTitle({
      title: indexName
    })
  },

  initCanShowMyRelease() {
    var queryHeoTypeParam = {
      stat: 'N',
      openHuStat: 'N'
    };
    that.showLoading(!0)
  },

  // 获取用户信息
  getUserProfile() {   
    console.log("获取用户头像昵称")
    var userAvatarUrl = this.data.userAvatarUrl;
    var userNickName = this.data.userNickName;
    //if(userAvatarUrl == null || userAvatarUrl == '' || userNickName == null || userNickName == ''){
      console.log("获取用户头像昵称缓存为空")
      wx.getUserProfile({
        desc: '获取用户信息',
        success: (res) => {
          console.log("-------------------"+res.userInfo.avatarUrl+"-----------------")
          console.log("-------------------"+res.userInfo.nickName+"-----------------")
          userAvatarUrl = res.userInfo.avatarUrl;
          userNickName = res.userInfo.nickName;
            //放进缓存
            app.storage.setUserAvatarUrl(userAvatarUrl);
            app.storage.setUserNickName(userNickName);
          this.setData({
            userAvatarUrl: userAvatarUrl,
            userNickName: userNickName
          })
        },
        fail: () => {
          console.log('getUserProfile fail')
        }
      })
   // } 
  },
  
  bindchooseavatar(e) {
    console.log("avatarUrl",e.detail.avatarUrl)
    //放进缓存
    app.storage.setUserAvatarUrl(e.detail.avatarUrl);
    this.setData({
      userAvatarUrl: e.detail.avatarUrl
    })
  },
 

  // 公告
  gonggao(type) {
    //let flag = false;//默认不会弹窗公告
    //点击的时候，不区分是否滚动，直接弹窗
    // try {
    //   if (type && type.type === 'click') {
    //     flag = true;
    //   }
    // } catch (e) { }
    var data = {};
    data['cstCode'] = app.storage.getCstCode();
    data['wxOpenId'] = app.storage.getWxOpenId();
    data['proNum'] = app.storage.getProNum();   
    app.req.postRequest(api.queryGongGao,data).then(res=>{
      console.log('公告查询结果',res);
      var data = res.data;
      if(data.respCode == '000'){
        if(data.list != null && data.list.length > 0){
          // var gobj = data.gonggaoLIst[0];
          // var noticeDate = gobj.noticeDate.substring(0,4)+ '-' + gobj.noticeDate.substring(4,6)+'-'+gobj.noticeDate.substring(6,8);
          // gobj.noticeDate = noticeDate;
          // if(type == '1'){//初始化加载的时候，需要判断模式
          //   flag = (gobj.noticeType == 'P');
          // }
          that.setData({
            gonggaoList:data.list,
            notReadNum:data.notReadNum
            // gobj:gobj,
            // showPost: flag,
            // ggBtn:gobj.noticeUrl != '' ?'查看原文':'确定'
          })
        }else{
          console.log('没有公告');
          that.setData({
           // gobj:null
            gonggaoList:null
          })
        }
      }
    });
  },
  // 公告原文
  ggDetail(event) {
    let url = this.data.gobj.noticeUrl;
    url = encodeURIComponent(url);
    if (url != '' && url != undefined) {
      console.log('this.data.gobj===>', this.data.gobj.noticeTitle);
      wx.navigateTo({
        url: '/subpages/gonggao/web/ggDetail?url=' + url + '&titleName=' + this.data.gobj.noticeTitle
      })
    } else {
      this.onClickHide();
    }

  },
  // 隐藏公告弹窗
  onClickHide() {
    this.setData({
      showPost: false
    })
  },

  // eye
  eye(even) {
    console.log('eye');
    this.data.eye == '1' ? this.setData({ eye: 0 }) : this.setData({ eye: 1 })
  },
  house(event) {
    wx.navigateTo({
      url: '/subpages/family/memberDetail?PageType=S&canUnRegist=Y',
      events: {
        dataChangedEvent: function (data) {
          if (data.Changed == 'Y') {
            console.log("dataChangedEvent", data)
            that.sameUserDoLogin();
            that.setData({
              timestamp: Date.parse(new Date()) / 1000
            });
          }

        }
      },
    })
  },
  //功能菜单
  toFun(event) {
    console.log(event);
    let obj = app.storage.getLoginInfo();
    if (event.target.dataset.auth && obj.huStat == 'P') {
      let desc = obj.loginErrDesc;
      if (desc == '' || desc == undefined) {
        desc = '您还未开通该功能权限';
      }
      Toast.alert({ message: desc });
      return;
    } else {
      console.log('有权限，到达页面');
      wx.navigateTo({
        url: event.target.dataset.url,
      })
    }
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('0.login onload options', options);
    app.loading(), that = this;
     
    //初始化loading
    //针对iOS设备的适配
    that.initSysClass();
    // 登录
    that.loginBusiByDefault();
    //初始化custId,带参数的custId,
    let custId = options['custId'];
    let cstCode = options['cstCode'];
    let wxOpenId = options['wxOpenId'];
    let proNum = options['proNum'];
    //let corpId = options['corpId'];
    //let url = options['url'];

    //初始化onLoad,初始化参数
    that.setData({
      onLoad: true,
      custId: custId,
      cstCode: cstCode,
      wxOpenId: wxOpenId,
      proNum: proNum
    })
  },

  //初始化主页
  initMain() {
    var loginInfo = app.storage.getLoginInfo();
    var name = loginInfo.commanyShortName;
    if (name && name != '') {
      wx.setNavigationBarTitle({
        title: name,
      })
    }
    var imgNum = parseInt(loginInfo.imgNum);
    var custId = loginInfo.custId;
    var background = new Array();
    for (let i = 0; i < imgNum; i++) {
      // let imgurl = api.queryImageUrl+'fileName='+i+'.png&packName=main/'+custId+'main';
      let imgurl = api.queryImageUrl.replace('FILENAME', i + '.png').replace('PACKNAME', 'main/' + custId).replace('OTHER', 'main');
      background.push(imgurl);
    }

    // 获取管家电话，企业微信二维码
    this.getUserMobile();

    // 渲染页面的同时判断生活服务
    this.hasLife();

    // 获取广告
    this.getAdverts();

    this.setData({
      functionList: loginInfo.funList,
      homeDot: loginInfo.homeDot,
      commanyShortName: loginInfo.commanyShortName,
      headImgUrl: loginInfo.headImgUrl + "?timestamp=" + that.data.timestamp,
      nickName: loginInfo.nickName,
      areaName: loginInfo.areaName,
      buildingName: loginInfo.buildingName,
      background: background,
      obj: loginInfo,
      active: this.data.active,
      userList: app.storage.getUsrList(),
      isRefreshing:false
    });
    return true;
  },


  // 获取广告
  getAdverts(){
    var data = {};
    data['cstCode'] = app.storage.getCstCode();
    data['wxOpenId'] = app.storage.getWxOpenId();
    data['proNum'] = app.storage.getProNum();   
    var that = this;
    app.req.postRequest(api.queryAdverts,data).then(res=>{
        console.log("回调用",res);
        if(res.data.respCode == '000'){
          var adverts = res.data.adverts;              
          that.setData({
            advertsImg:adverts.imgPath,
            advertsUrl: adverts.advertsPath
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

  // 获取管家电话，企业微信二维码
  getUserMobile(){
     var data = {};
     data['cstCode'] = app.storage.getCstCode();
     data['wxOpenId'] = app.storage.getWxOpenId();
     data['proNum'] = app.storage.getProNum();   
     var that = this;
     app.req.postRequest(api.queryHouseKeepInfo,data).then(res=>{
         console.log("回调用",res);
         if(res.data.respCode == '000'){
           var qrCode = '';
           var houseKeepList = res.data.userList;
           if(houseKeepList.length > 0){
             var houseKeep = houseKeepList[0];       
             qrCode = houseKeep.qrCode;          
           }           
           that.setData({
             qrCode:qrCode,
             houseKeepList: houseKeepList
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
  //根据功能ID跳转到指定的页面
  getSpePage(hgjModuleId) {
    // var hgjModuleId = options['hgjModuleId'];
    if (hgjModuleId == '' || hgjModuleId == undefined) {
      return '';
    }
    let values = app.storage.getLoginInfo().moduleValues;
    if (values == undefined) {
      return '';
    }
    let pagePath = '';
    for (let i in values) {
      let obj = values[i];
      let id = obj.hgjModuleId;
      if (id == hgjModuleId) {
        pagePath = obj.pagePath;
        break;
      }
    }

    console.log('2.根据功能ID的校验页返回结果', hgjModuleId, pagePath);
    return pagePath;
  },

  //obj-->key=value&key=value
  convertObj2param: function (options) {
    let param = '';
    for (var key in options) {
      if (key != '') {
        param += key + '=' + options[key] + '&';
      }
    }
    return param.substring(0, param.length - 1);
  },

  //默认进入小程序的业务-正在使用的
  loginBusiByDefault() {
    that.showLoading(1);
    var data = {};
    wx.login({
      success: res => {
        let cstCode = that.data.cstCode;
        data['code'] = res.code;
        data['cstCode'] = cstCode;
        console.log('成功获取了code');
        app.req.postRequest(api.queryMutipUsr, data).then(res => {
          console.log('无缓存的多账户请求结果', res);
          if (res.data.respCode == '000') {
            that.showLoading(0);
            let wxOpenId = res.data.wxOpenId;
            console.log("wxOpenId:" + wxOpenId);
            let proNum = res.data.proNum;
            let cstCode = res.data.cstCode;
            let proName = res.data.proName;
            let cstName = res.data.cstName;
            let intoUserName = res.data.userName;
            let houseId = res.data.houseId;
            let houseName = res.data.houseName;
            let token = res.data.token;
            if(wxOpenId == null || wxOpenId == ""){
              app.alert.alert("wxOpenId为空!");
              return;
            };
            if(proNum == null || proNum == ""){
              app.alert.alert("项目号为空!");
              return;
            };
            if(cstCode == null || cstCode == ""){
              app.alert.alert("客户编号为空!");
              return;
            };
            app.storage.setWxOpenId(wxOpenId);
            app.storage.setCstCode(cstCode);
            app.storage.setProNum(proNum);
            app.storage.setProName(proName);
            app.storage.setCstName(cstName);
            app.storage.setIntoUserName(intoUserName);
            app.storage.setHouseId(houseId);
            app.storage.setHouseName(houseName);
            app.storage.setToken(token);
            that.setData({
              wxOpenId: wxOpenId,
              cstCode: cstCode,
              proNum: proNum,
              proName: proName,
              cstName: cstName,
              intoUserName:intoUserName,
              houseId:houseId,
              houseName:houseName
            })

            var loginSource = 5;
            app.req.doLogin(loginSource, '', '', '', '', this.data.cstCode, this.data.wxOpenId, this.data.proNum).
            then(res => {
              if (res.data.respCode == '000') {
                console.log('登录成功,开始进入指定的页面');
                that.initMain();
              } else {
                console.log('登录失败');
                that.showErrDesc(res);
              }
            })
          } else {
            that.showLoading(0);
            that.showErrDesc(res);
          }
        });
      },
    });
  },

  onClose(event) {
    console.log('触发close', event);
    if (event.detail != 'confirm' && !this.checkSession()) {
      console.log('未选择用户且当前的缓存不存在数据');
      this.sameUserDoLogin();
      this.queryMutipUsr();
    }
  },
  
  compareAuthBitmap(authMap) {
    let loginMap = app.storage.getLoginInfo().authBitMap
    let m_a = app.storage.getLoginInfo().moduleBitmap
    let retBitmap = ''
    for (let x = 0; x < m_a.length; x++) {
      if (x == authMap.length) {
        break
      }
      if (m_a.charAt(x) == '0') {
        retBitmap = retBitmap + m_a.charAt(x)
      } else {
        retBitmap = retBitmap + authMap.charAt(x)
      }
    }
    console.log("compareAuthBitmap retBitmap ", retBitmap);
    console.log("compareAuthBitmap loginMap  ", loginMap);
    if (loginMap != 'undefined' && loginMap != retBitmap) {
      let custId = app.storage.getLoginInfo().custId
      if (custId != '' && custId != undefined) {
        this.sameUserDoLogin();
        return
      }
    }
  },
  onTapHouse(event) {
    //需要p状态特判断
    let obj = app.storage.getLoginInfo();
    if (event.target.dataset.auth && obj.huStat == 'P') {
      let desc = obj.loginErrDesc;
      if (desc == '' || desc == undefined) {
        desc = '您还未开通该功能权限';
      }
      Toast.alert({ message: desc });
      return;
    }
    //根据用户房屋状态跳转页面
    var huRole = app.storage.getLoginInfo().huRole
    if (huRole != "O") {
      wx.showToast({
        title: '您无权限！',
      })

      return;
    }

    var url = '../../subpages/family/memberList'
    if (this.data.houseStat == "N") {
      url = '../../subpages/family/memberList'
    }
    wx.navigateTo({
      url: url,
      events: {
        dataChangedEvent: function (data) {
          if (data.Changed == 'Y') {
            console.log("dataChangedEvent", data)
            that.sameUserDoLogin();
          }
        },
      },
    })
  },

  // 用户切换
  changeUser(event) {
    let usrList = app.storage.getUsrList();
    let custId = app.storage.getCustId();
    let wxSeqId = app.storage.getWxSeqId();
    let hgjOpenId = app.storage.getHgjOpenId();
    if (usrList != null) {
      let length = usrList.length;
      console.log('usrList', usrList);
      for (var i = 0; i < length; i++) {
        let obj = usrList[i];
        if (obj.custId == custId && obj.wxSeqId == wxSeqId && obj.hgjOpenId == hgjOpenId) {
          console.log('当前选房的序号是', i, this.data.houseNum);
          this.setData({
            houseNum: i
          })
          break;
        }
      }
    } else {
      wx.showToast({
        title: '无其他账户',
        icon: 'none'
      })
      return;
    }

    this.setData({
      showHouse: true,
    })
  },

  //选择登录账户
  onChoseHouse(event) {
    console.log('整行点击', event);
    this.setData({
      houseNum: event.target.dataset.name
    })
  },

  //确认选中新用户登录
  sureChangeMan(event) {
    let obj = app.storage.getUsrList()[this.data.houseNum];
    this.setData({
      showHouse: false,
    })
    //重新登录
    app.req.doLogin(4, obj.custId, obj.hgjOpenId, obj.wxSeqId).then(value => {
      that.initMain();//已经登录了，且session正常，初始化主页
      let url = that.data.tempToSpeUrl;
      if (url != '' && url != undefined) {
        that.toSpePage(url)
        that.setData({
          tempToSpeUrl: ''
        })
      }
    })
  },

  //特殊机型样式
  initSysClass: function () {
    wx.getSystemInfo({
      success(res) {
        let sys = res.model;
        console.log("sys======>" + sys);
        if (sys == 'iPhone XR' || sys.indexOf('Plus') != -1 || sys.indexOf('Max') != -1) {
          that.setData({
            section: 'section-special'
          });
        }
      }
    });
  },

  //展示电话选择
  showTel() {
    this.getUserMobile();
    var houseKeepList = this.data.houseKeepList; 
    if(houseKeepList.length == 0){
      Toast.alert({ message: '请联系物业设置联系方式!' });
    }else{
      this.setData({
        showTel: true,
        bg: 15,
      })
    }
  },

  //电话
  call(event) {
    console.log('call', event);
    this.closeTel();
    let tel = '';
    if (this.data.houseKeepList.length > 0) {
      tel = event.currentTarget.dataset.tel;
    } else {
      tel = this.data.obj.urgentTel;
    }
    console.log('拨打的电话是', tel);
    if (tel == '' || tel == undefined) {
      Toast.alert({ message: '请联系物业设置联系方式!' });
      return;
    }
    wx.makePhoneCall({
      phoneNumber: tel
    })
  },

  closeTel(event) {
    console.log('关闭电话选择', event);
    this.setData({
      showTel: false,
      bg: 0
    })
  },
  //微信联系
  wechat(event) {
    if (this.data.qrCode != undefined && this.data.qrCode != '') {
      this.setData({ showWechat: true, bg: 0, showWechatImg:false});
    } else {
      Toast.alert({ message: "请联系物管人员进行设置！" });
      return;
    }


    // 跳转到企业微信客服聊天窗口
    //必须要触发点击事件才能唤起聊天窗口，所以多加了一个弹窗，否者会报错{errMsg: "openCustomerServiceChat:fail can only be invoked by user TAP gesture."}
    // var that = this;
    // wx.showModal({
    //     title: '提示',
    //     content: '即将跳转到企业微信客服聊天窗口',
    //     confirmText: '我知道了',
    //     showCancel: false,
    //     success(res) {
    //         if (res.confirm) {
    //             wx.openCustomerServiceChat({
    //                 corpId: that.data.corpId,//企业微信ID
    //                 extInfo: { url: that.data.url },//企业微信聊天接入链接
    //             })
    //           }
    //       }
    //   });
  

  },
  completemessage(res) {
    console.log('联系我返回', res);
    //this.closWechat();
    //this.setData({showWechat:false,bg:0});
    // this.setData({showWechat:false,bg:0,showWechatImg:true}); //图片版本
    Toast.alert({ message: '请去微信->服务通知,去添加管家微信' }); //文字版本
  },
  closWechat() {
    console.log('-------------closWechat-----------------');
    this.setData({
      showWechat: false,
      bg: 0,
      showWechatImg: false
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    console.log('onReady function.......');
    // console.log(app.globalData);
    // console.log("nickNameChange","nickNameChange")
    // this.getUsrAuthInfo()
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    console.log('主页onshow加载公告 ..........');
    this.gonggao();
    // if (this.data.onLoad) {
    //   console.log('已经走过了onLoad，无需再次走onshow处理其他业务');
    //   this.setData({
    //     onLoad: false
    //   })
    //   return;
    // }
    // if (!this.checkSession()) {
    //   this.sameUserDoLogin();
    //   return;
    // }
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
      loading:false,
      isRefreshing:true
    })
    // this.onLoad();
    // 登录
    this.loginBusiByDefault();
    this.onShow();
    wx.stopPullDownRefresh({
    })
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
  // 点击关闭切换
  , close(event) {
    this.setData({
      showUser: false
    })
  }

  //进入公司主页
  , toCompany(event) {
    wx.navigateTo({
      url: '../../pages/company/company',
    })
  }

  //问题反馈展示
  , advice(event) {
    let obj = app.storage.getLoginInfo();
    if (event.target.dataset.auth && obj.huStat == 'P') {
      let desc = obj.loginErrDesc;
      if (desc == '' || desc == undefined) {
        desc = '您还未开通该功能权限';
      }
      Toast.alert({ message: desc });
      return;
    }
    // console.log('advice',event);
    let bit = event.currentTarget.dataset.bit;
    let titleName = event.currentTarget.dataset.title;
    let curBit = 'menu.curBit';
    let title = 'menu.title';
    this.setData({
      [curBit]: bit,
      [title]: titleName
    })
    this.changePopMenuShow();
    this.setData({ bg: 15 })
  }
  // 投诉建议表扬
  , adviceJob(event) {
    let toPagePath = event.currentTarget.dataset.url;
    // console.log('当前处理的场景是',adviceType);
    // let toPagePath = '/subpages/advice/add/addAdvice?isLogin=Y&adviceType='+adviceType
    //关闭弹窗
    this.closeAdvice();
    wx.navigateTo({
      url: toPagePath,
    })
  },
  //关闭问题反馈
  closeAdvice() {
    this.changePopMenuShow();
    this.setData({
      bg: 0,
    })
  },
  //反馈记录
  adviceList() {
    let huSeqId = app.storage.getHuSeqId();
    let custId = app.storage.getCustId();
    wx.navigateTo({
      url: '/subpages/advice/query/queryAdvice?isLogin=Y&huSeqId=' + huSeqId + '&custId=' + custId,
    })
    this.closeAdvice();
  },
  // test(){
  //   this.changePopMenuShow();
  // },

  changePopMenuShow() {
    let showAdvice = 'menu.showAdvice';
    let funList = 'menu.funList';
    let bitmapList = app.storage.getLoginInfo().qpadBitmapList;
    this.setData({
      [showAdvice]: !this.data.menu.showAdvice
      , [funList]: bitmapList
    })
  },

  //是否有生活服务判断，true-有
  hasLife: function () {
    let loginInfo = app.storage.getLoginInfo();
    console.log('判断生活服务le', loginInfo);
    if (loginInfo != null && loginInfo != undefined) {
      let authBitMap = loginInfo.authBitMap;
      //let lifeBit = authBitMap.substring(10,11);
      // this.setData({
      //   showLife:lifeBit == '1'?true:false
      // })
    }
  },

  //生活服务的注册函数
  register: function (event) {
    life.center(event);
  },

  //点击隐藏弹窗
  cancelAd(){
    this.setData({
      advertsShow:'1'
    })
  },
   //点击跳转广告地址
  advertsUrl(){
    let advertsUrl = this.data.advertsUrl;
    wx.navigateTo({
      url: advertsUrl
    })
  }, 
  toWebPage: function (event) {
    //let {url} = event.data.detail;
    let url = event.currentTarget.dataset.url;
    url = encodeURIComponent(url);
    console.log('toWebPage==>', url);
    wx.navigateTo({
      url: '/subpages/gonggao/web/ggDetail?url=' + url
    })
  },

  getQueryString: function (url, name) {
    var reg = new RegExp('(^|&|/?)' + name + '=([^&|/?]*)(&|/?|$)', 'i')
    var r = url.substr(1).match(reg)
    if (r != null) {
      return r[2]
    }
    return null;
  },
  
  showErrDesc: function (res) {
    if (res.data.errCode == '01012012') {
      var errDesc = res.data.errDesc;
      if (errDesc.indexOf("账户未开通") != -1) {
        errDesc = that.data.desc
      }
      Toast.alert({
        messageAlign: 'left',
        message: errDesc
      }).then(() => {
        wx.reLaunch({
          url: '../noauth/noauth?errDesc=' + errDesc,
        })
      })
    } else {
      Toast.alert({ message: res.data.errDesc }).then(() => {
        wx.reLaunch({
          url: '../noauth/noauth?errDesc=' + res.data.errDesc,
        })
      })
    }
  }
})
