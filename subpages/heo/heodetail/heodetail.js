const app = getApp(),
  api = require('../../../const/api'),
  heo = require('../../../model/heoinfo');
  import Dialog from '../../../miniprogram_npm/@vant/weapp/dialog/dialog';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    urls:[],
    checkImageUrl:api.checkImageUrl,
    showMsgInput:false,
    replySeqId:'',
    InputBottom: 0,
    heoPraiseListDtos:new Array(),
    pageNum:1,
    pageSize:10,
    lineHeight:0,
    lineCount:0,
    textArea:{ maxHeight: 200, minHeight: 30 },
    showFloat:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.loading(),heo.heoinfo.init(),this.showLoading(!1);
    if(!options.heoDate || !options.heoSeqId){
      wx.showToast({
        title: '系统异常，请重试。',
        icon:'none',
        duration:3000,
        success:function(){
          setTimeout(function(){
            wx.navigateBack({
              delta: 0,
            })
          },3000)
        }
      })
    }
    var huSeqId = app.storage.getHuSeqId();
    let loginData = app.storage.getLoginInfo();
    if(!loginData || !loginData.moduleBitmap 
      || !loginData.authBitMap
      || loginData.moduleBitmap.substr(2,1) != '1' 
      || loginData.authBitMap.substr(2,1) != '1'){
        wx.showToast({
          title: loginData && loginData.loginErrDesc ? loginData && loginData.loginErrDesc : '您暂无邻里圈权限，可联系物业人员配置。',
          icon:'none',
          duration:3000,
          success:function(){
            setTimeout(function(){
              wx.navigateBack({
                delta: 0,
              })
            },3000)
          }
        })
        return false;
    }
    this.setData({
      huSeqId:huSeqId,
      showMsgInput:false,
      heoDate:options.heoDate,
      heoSeqId:options.heoSeqId,
      queryType:options.queryType,
      huStat:loginData && loginData.huStat ? loginData.huStat : '',
      loginErrDesc : loginData && loginData.loginErrDesc ? loginData.loginErrDesc : '',
      InputViewHeight:140,
      marginBottom:app.globalData.isFullSucreen ? 42 : 10,
      isFullSucreen:app.globalData.isFullSucreen,
      windH:app.globalData.windowH,
      windowW : app.globalData.windowW
    })
    heo.heoinfo.initHeoDtlInfos(options.heoDate,options.heoSeqId);
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
    let pages = getCurrentPages(); 
    let prePage = pages[pages.length - 2]; 
    var heoInfo = this.data.heoInfo;
    if(prePage.route != 'pages/main/main'){
      prePage.refreshHeoInfos(heoInfo)
    }
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
  previewImage: function(e){
    wx.previewImage({
        current: e.currentTarget.dataset.id,
        urls:e.currentTarget.dataset.item
    })
  },
  bindShowMsgInput:function(e){
    this.setData({
      showFloat:true
    })
    if(!this.data.huStat || this.data.huStat != 'N'){
      wx.showToast({
        title: this.data.loginErrDesc ? this.data.loginErrDesc : '您当前房屋还未绑定，暂时不能留言。',
        icon:'none',
        duration:3000
      })
      return false;
    }
    var huSeqId = this.data.huSeqId,
    replyseqid = e.currentTarget.dataset.replyseqid,
    replyUsrName = e.currentTarget.dataset.replyusername;
    if(replyUsrName == '已销户'){
      wx.showToast({
        title: '对方已销户，无法留言。',
        icon:'none',
        duration:3000
      })
      return false;
    }
    if(huSeqId != replyseqid){
      this.setData({
        showMsgInput:true,
        replySeqId:replyseqid,
        replyUsrName:replyUsrName ? replyUsrName : '楼主',
        marginBottom:this.data.isFullSucreen ? 42 : 10
      })
      if(this.data.oldReplyUse != replyseqid){
        this.setData({
          inputMsg:'',
          oldReplyUse:replyseqid
        })
      }
    }else{
      this.setData({
        showDeleteOwnMsg:true,
        deleteHeoDtlItem:e.currentTarget.dataset.item,
        marginBottom:this.data.isFullSucreen ? 42 : 10
      })
    }
  },
  InputFocus(e) {
    var that = this;
    console.log(this.data.InputViewHeight)
    that.setData({
      showMsgInput:true,
      InputBottom: e.detail.height,
      marginBottom:0
    })
  },
  InputBlur(e) {
    this.setData({
      showMsgInput:false,
      InputBottom: 0,
      marginBottom:this.data.isFullSucreen ? 42 : 10
    })
  },
  hideMsgInput:function(){
    this.setData({
      showMsgInput:false,
      InputBottom: 0,
      marginBottom:app.globalData.isFullSucreen ? 42 : 10
    })
  },
  bindlinechange:function(e){
    if(e.detail.lineCount > 1){
      if(this.data.lineHeight != e.detail.height){
        var InputViewHeight = this.data.InputViewHeight ;
        if(parseInt(e.detail.lineCount) - parseInt(this.data.lineCount) == 1){
          InputViewHeight = this.data.InputViewHeight + (parseInt(e.detail.height - this.data.lineHeight)*1.8) ;
           if(InputViewHeight < 140){
            InputViewHeight = 140;
          }
        }else if(parseInt(this.data.lineCount) - parseInt(e.detail.lineCount) == 1){
          var heigh = e.detail.height > this.data.lineHeight ? parseInt(e.detail.height - this.data.lineHeight) 
          : parseInt(this.data.lineHeight - e.detail.height);
          InputViewHeight = this.data.InputViewHeight - (heigh * 1.8) ;
          if(InputViewHeight < 140){
           InputViewHeight = 140;
         }
        }
        this.setData({
          InputViewHeight:this.data.maxInputViewHeight  && InputViewHeight > this.data.maxInputViewHeight ? this.data.maxInputViewHeight : InputViewHeight,
          lineCount:e.detail.lineCount,
          lineHeight: e.detail.height
        })
      }
      if((e.detail.lineCount >= 5 && e.detail.lineCount < 9) || this.data.inputMsg.length > 70){
        this.setData({
          maxInputViewHeight:InputViewHeight 
        })
      }
    }else{
      this.setData({
        InputViewHeight:e.detail.lineCount == 1 ? 140 : this.data.InputViewHeight,
        lineCount:e.detail.lineCount,
        lineHeight: e.detail.height
      })
    }
  },
  bindInputMsg:function(e){
    let reg = /[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF][\u200D|\uFE0F]|[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF]|[0-9|*|#]\uFE0F\u20E3|[0-9|#]\u20E3|[\u203C-\u3299]\uFE0F\u200D|[\u203C-\u3299]\uFE0F|[\u2122-\u2B55]|\u303D|[\A9|\AE]\u3030|\uA9|\uAE|\u3030/ig;  
    var inputMsg = e.detail;
    var that = this;
    if(inputMsg.match(reg)){
      wx.showToast({
        title: '消息内容不能输入表情符',
        icon:'none',
        duration:3000,
        success:function(){
          inputMsg = inputMsg.replace(reg,"");
          that.setData({
            inputMsg:inputMsg
          })
        }
      });
    }else{
      if(inputMsg.length > 80){
        wx.showToast({
          title: '消息内容最多只能输入80个字',
          icon:'none',
          duration:2000,
          success:function(){
            inputMsg = inputMsg.substr(0,80);
            that.setData({
              inputMsg:inputMsg
            })
          }
        });
      }
      this.setData({
        inputMsg:inputMsg
      })
    }
  },
  sendMsg:function(e){
    if(!this.data.inputMsg || this.data.inputMsg == '' ){
      wx.showToast({
        title: '请输入您要回复的内容',
        icon:'none',
        duration:3000
      })
      return false;
    }
    this.showLoading(!0)
    heo.heoinfo.saveHeoDtlInfo()
  },
  delHeoDtl:function(e){
    if(!this.data.huStat || this.data.huStat != 'N'){
      wx.showToast({
        title: this.data.loginErrDesc ? this.data.loginErrDesc : '您当前房屋还未绑定，暂时不能删除留言。',
        icon:'none',
        duration:3000
      })
      return false;
    }
    var heoDtlInfo = e.currentTarget.dataset.item;
    var updHeoDtl = {};
    updHeoDtl.heoDate = heoDtlInfo.heoDate
    updHeoDtl.heoSeqId = heoDtlInfo.heoSeqId
    updHeoDtl.dtlId = heoDtlInfo.dtlId
    updHeoDtl.custId = heoDtlInfo.custId
    Dialog.confirm({
      title: '提示',
      message: '确定要删除该条评论么？',
    }).then(() => {
      updHeoDtl.stat = 'C'
      heo.heoinfo.updHeoDtlInfo(updHeoDtl,true)
      })
      .catch(() => {
        console.log('点击取消')
      });
  },
  updateHeoDtlReadStat:function(heoDate,heoSeqId){
    var heoDtlInfo = {};
    heoDtlInfo.heoDate = heoDate;
    heoDtlInfo.heoSeqId = heoSeqId;
    heoDtlInfo.readStat = 'R';
    heoDtlInfo.replySeqId = this.data.huSeqId
    heo.heoinfo.updHeoDtlInfo(heoDtlInfo,false);
  },
  closeHeoInfo:function(e){
    if(!this.data.huStat || this.data.huStat != 'N'){
      wx.showToast({
        title: this.data.loginErrDesc ? this.data.loginErrDesc : '您当前房屋还未绑定，暂时不能关闭帖子。',
        icon:'none',
        duration:3000
      })
      return false;
    }
    Dialog.confirm({
      title: '提示',
      message: '确定要关闭该帖子么？',
    }).then(() => {
      var heoInfo = e.currentTarget.dataset.heoinfo;
      var updHeoInfo = {};
      updHeoInfo.stat = 'C'
      updHeoInfo.heoDate = heoInfo.heoDate
      updHeoInfo.heoSeqId = heoInfo.heoSeqId
      heo.heoinfo.updateHeoInfo(updHeoInfo)
      })
      .catch(() => {
        console.log('点击取消')
      });
  },
  checkPraiseList:function(){
    let heoInfo = this.data.heoInfo
    wx.navigateTo({
      url: '/subpages/heo/heopraislist/heopraislist?heoDate=' + heoInfo.heoDate + "&heoSeqId=" + heoInfo.heoSeqId
      // url: '/subpages/heo/heopraislist/heopraislist?imageNames=' + JSON.stringify(heoInfo.imageNames )
    })
  },
  praiseHeoInfo:function(e){
    let that = this;
    let heoInfo = that.data.heoInfo;
    that.showLoading(!0)
    app.req.postRequest(api.doHeoPraise, {heoDate:heoInfo.heoDate,heoSeqId:heoInfo.heoSeqId,houseSeqId:heoInfo.houseSeqId}).then(function (res) {
      if(res.data && res.data.RESPCODE == '000'){
        heoInfo.takePartInPraise = heoInfo.takePartInPraise == 'Y' ? 'N' : 'Y';
        heoInfo.praiseCnt = heoInfo.takePartInPraise == 'Y' ? parseInt(heoInfo.praiseCnt) + 1 : parseInt(heoInfo.praiseCnt) - 1 
        that.setData({
          heoInfo:heoInfo
        })
      }else{
        wx.showToast({
          title: '网络异常，请稍后重试',
          icon:'none',
          duration:3000
        })
      }
      that.showLoading(!1)
    })
  },
  deleteOwnMsg:function(e){
    this.delHeoDtl(e)
  },
  hideDelete:function(){
    this.setData({
      showDeleteOwnMsg:false
    })
  },
  showMoreFlag:function(){
    this.setData({
      showFloat : !this.data.showFloat
    })
  }
})