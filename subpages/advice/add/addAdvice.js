// subpages/advice/add/addAdvice.js
import Toast from '../../../miniprogram_npm/@vant/weapp/dialog/dialog';
const app = getApp();
const api = require('../../../const/api.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    textArea:{ maxHeight: 110, minHeight: 110 } //文本域

    ,isLogin:'N'    //默认就是匿名报修 
    ,adviceType:'A' //默认就是建议
    ,custId:''  //匿名报修传过来的
    ,wxOpenId:'' //匿名报修传过来的
    ,adviceDesc:''
    ,objId:'' //标地

    ,disabled:true //属性禁用

    ,imgUse:3 //最多可上传的图片张数
    ,imgCnt:0 //当前上传的图片数
    ,fileList: [] //上传的图片列表
    ,sizeType:['compressed']//缩略图
    ,cWidth: 0 //画布的宽度，图片压缩后大小
    ,cHeight : 0 //画布的高度，图片压缩后大小

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //初始化加载开始
    app.loading(),this.showLoading(1);
    //初始化参数
    this.initParam(options);
    //投诉建议类型
    this.setTitle();
    //初始化加载结束
    this.showLoading(0);
  },

  //初始化传来的参数
  initParam(options){
    console.log('onload param',options);
    let adviceType = options['adviceType'];
    let isLogin = options['isLogin'];
    let custId = options['custId'];
    let wxOpenId = options['wxOpenId'];
    let objId = options['objId'];
    if(isLogin == 'Y'){
      custId = app.storage.getCustId();
    }
    if(!objId){
      objId = '';
    }
    this.setData({
      adviceType:adviceType,
      isLogin:isLogin,
      custId:custId,
      wxOpenId:wxOpenId,
      objId:objId,
    })
  },



  //设置标题
  setTitle(){
    let title = '建议';
    let adviceType = this.data.adviceType;
    switch (adviceType){
      case 'C': title = '投诉' ;break;
      case 'A': title = '建议' ;break;
      case 'P': title = '表扬' ;break;
      default: title = '建议';
    }
    wx.setNavigationBarTitle({
      title: title,
    })
  },

  //提交建议
  submitInfo(){
    this.setData({disabled:true});
    this.showLoading(1);
    var param = this.getParam();
    console.log('param===>',param);
    let that = this;
    let custId = param['custId'];
    let adviceType = param['adviceType'];
    app.req.postRequest(api.addAdvice,param).then(res => {
        console.log('res===>',res);
        this.showLoading(0);
        let data = res.data;
        if(data.respCode == '000'){
          let adviceDate = data.adviceDate;
          let adviceSeqId = data.adviceSeqId;
          var fileList = that.data.fileList;
          var result = 0;
          var le = fileList.length;
          let imgCnt = that.data.imgCnt;
          if(imgCnt > 0){
            console.log('申请成功，维护上传的临时图片,共计：',fileList.length);
            for(var i =0;i< le;i++){
              result = result + that.upload(fileList[i].url,api.uploadImages,
              {imgId:i,fileType:'LOG',busiId:'06',busiDate:adviceDate,busiSeqId:adviceSeqId,custId:custId});
              console.log('当前处理完成的是：',i);
            }
            Toast.alert({
              message:adviceType=='A'?'感谢您的建议，我们将为您提供更优质的服务！':(adviceType=='C'?'您的投诉已经成功，等待受理！':'感谢您的认可，我们将竭诚为您提供优质服务！'),
            }).then(()=>{
              if(result == le){
                console.log('图片已经全部上传完成')
                that.toDetailPage(adviceDate,adviceSeqId);
              }else{
                console.log('图片已经上传中....');
                that.showLoading(1);
                setTimeout(function(){
                  that.showLoading(0);
                  that.toDetailPage(adviceDate,adviceSeqId);
                },500);
              }
            })
          }else{
            Toast.alert({
              message:adviceType=='A'?'感谢您的建议，我们将为您提供更优质的服务！':(adviceType=='C'?'您的投诉已经成功，等待受理！':'感谢您的认可，我们将竭诚为您提供优质服务！'),
            }).then(()=>{
                that.toDetailPage(adviceDate,adviceSeqId);
            })
          }
        }else{
          Toast.alert({message:data.errDesc});
        }
    })
  },


  //获取发送到后台的参数
  getParam(){
    let param = {};
    let data = this.data;
    param['adviceType'] = data.adviceType;
    param['isLogin'] = data.isLogin;
    param['custId'] = data.custId;
    param['wxOpenId'] = data.wxOpenId;
    param['adviceDesc'] = data.adviceDesc;
    param['imgCnt'] = data.fileList.length;
    if(data.isLogin == 'Y'){
      let obj = app.storage.getLoginInfo();
      param['huSeqId'] = obj.huSeqId;
      param['houseSeqId'] = obj.houseSeqId;
      param['buildingId'] = obj.buildingId;
      param['areaId'] = obj.areaId;
      param['custId'] = obj.custId;
    }
    return param;
  },
  //插入信息描述
  insertDesc(event){
    console.log(event);
    console.log(event.detail);
    let adviceDesc = event.detail;

    
    let reg = /[^\u0020-\u007E\u00A0-\u00BE\u2E80-\uA4CF\uF900-\uFAFF\uFE30-\uFE4F\uFF00-\uFFEF\u0080-\u009F\u2000-\u201f\u2026\u2022\u20ac\r\n]/g;
    if(adviceDesc.match(reg)) {
      this.setData({adviceDesc:this.data.adviceDesc});
      return;
    }else{
      this.setData({adviceDesc:adviceDesc});
      if(this.data.adviceDesc.length > 1){
        this.setData({disabled:false})
      }else{
        this.setData({disabled:true})
      }
    }
  },

  //提交成功，进入详情页面
  toDetailPage(adviceDate,adviceSeqId){
     let custId = this.data.custId;
     let adviceType = this.data.adviceType;
     let isLogin = this.data.isLogin;
     wx.redirectTo({
       url: '../detail/addviceDetail?adviceDate='+adviceDate+'&adviceSeqId='+adviceSeqId+'&isLogin='+isLogin+'&custId='+custId+'&adviceType='+adviceType,
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



//画布压缩图片
choseImage(file){
  var that = this;
  var temp = this.data.fileList;

  // file.forEach(element => {
  for(var numP = 0;numP < file.length;numP++){ 
    console.log('当前处理的是第'+numP+'张图片业务'); 
    var element = file[numP];      
    var path = element.path;
    var size = element.size;
    console.log('uploadFile',element);
      if(path == '' || path == undefined){
        path = element.url;
        console.log('取首先路径失败，未获取到图片信息，取次要路径',path);
          if(path == '' || path == undefined){
            path = element.thumb;
          }
      }
      try {
        //-----返回选定照片的本地文件路径列表，获取照片信息-----------
        console.log('开始获取图片信息',path);
        that.drawImage(path,numP,temp,size);          
      } catch (error) {
        console.log('图片压缩发生了异常',error);
        if(timer != null){
          clearTimeout(timer);
          timer = null;
        }
      }
    };
},

//图片压缩处理
drawImage(path,curNum,temp,size){
  wx.showToast({
    title: '处理中...',
    icon:'loading'
  })
  var cid = 'canvas'+curNum;
  var that = this;
  wx.getImageInfo({
    src: path,
    success:imgRes=>{
      console.log('成功获取到的图片信息',imgRes);
      //---------利用canvas压缩图片--------------
      var tempSize = 1048576;//1M的大小
      var ratio = 2;
      var zip = false;
      if(size != undefined && size != 0 && size > tempSize){
        console.log('图片太大，不管大小，必须进行一定的压缩');
        zip = true;
      }
      console.log('图片压缩率',ratio);
      var canvasWidth = imgRes.width //图片原始长宽
      var canvasHeight = imgRes.height
      while (zip || canvasWidth > 2016 || canvasHeight > 2016){// 保证宽高在400以内
          canvasWidth = Math.trunc(imgRes.width / ratio)
          canvasHeight = Math.trunc(imgRes.height / ratio)
          ratio++;
          zip = false;
      }
      console.log('压缩率最终值',(ratio-1));
      if(curNum == 0){
        that.setData({
          cWidth: canvasWidth,
          cHeight: canvasHeight
        })
      }else if(curNum == 1){
        that.setData({
          cWidth1: canvasWidth,
          cHeight1: canvasHeight
        })
      }else{
        that.setData({
          cWidth2: canvasWidth,
          cHeight2: canvasHeight
        })
      }
      //---------对于本身就比较小的图片，无需进行压缩处理---------------
      if(canvasWidth == imgRes.width && canvasHeight == imgRes.height){
        console.log('图片已经很小，无需进行压缩处理',path);
        var img = {};
        img['url'] = path;
        temp.push(img);
        var imgCnt = that.data.imgCnt+1;
        that.setData({
          fileList:temp,
          imgCnt:imgCnt,
        })
        wx.hideLoading();
      }else{
        path = imgRes.path;
        console.log('开始进行压缩处理',path);
        var ctx = wx.createCanvasContext(cid)
            ctx.drawImage(path, 0, 0, canvasWidth, canvasHeight)
            ctx.draw(false,setTimeout(function(){
              console.log('图片生成了，开始导出图片....');
              wx.canvasToTempFilePath({
                canvasId: cid,
                destWidth: canvasWidth,
                destHeight: canvasHeight,
                fileType:'jpg',
                quality: 0.4,
                success: function (res) {
                  console.log('最终的图片信息',res);
                  console.log(res.tempFilePath)//最终图片路径
                  var img = {};
                  img['url'] = res.tempFilePath;
                  temp.push(img);
                  var imgCnt = that.data.imgCnt+1;
                  that.setData({
                    fileList:temp,
                    imgCnt:imgCnt,
                  })
                  wx.hideToast({success: (res) => {},});
                  console.log('大功告成了');
                },fail: function (res) {
                  timer = null;
                    wx.showToast({
                      title: '图片上传失败，请重试！',
                      icon:'none'
                    })
                    console.log(res.errMsg)
                }
              })
            },1000));
      }

      //----------绘制图形并取出图片路径--------------
    
    },fail:imgRes=>{
      console.log('获取到的图片信息失败',imgRes);
    }
  })
},

//文件上传开始
afterRead(event) {
  const { file } = event.detail;
  // 当设置 mutiple 为 true 时, file 为数组格式，否则为对象格式
  console.log('开始处理文件保存到缓存的业务',file);
  //图片压缩算法
  this.choseImage(file);
  
},

delete(event){
  console.log('删除图片操作',event.detail);
  var path = this.data.fileList[event.detail.index].url;
  wx.getSavedFileList({
    success (res) {
      if (res.fileList.length > 0){
        wx.removeSavedFile({
          filePath: path,
          complete (res) {
            console.log(res)
          }
        })
      }
    }
   })
  this.data.fileList.splice(event.detail.index,1);
  var imgCnt = this.data.imgCnt -1;
  this.setData({
    fileList:this.data.fileList,
    imgCnt:imgCnt
  })
},
overSize(event){
  app.alert.alert('文件太大，请重新上传');
},

upload(filePath,uploadUrl,data){
  console.log('文件开始上传',filePath,uploadUrl,data);
  wx.uploadFile({
    url: uploadUrl, // 仅为示例，非真实的接口地址
    filePath: filePath,
    name: 'file',
    header: {
      "Content-Type": "multipart/form-data",
      'accept': 'application/json'
    },
    formData: data,
    success(res) {
      // 上传完成需要更新 fileList
      console.log('图片上传成功',res);
    },
    complete:res=>{
      console.log('图片上传完成',res);
      return 1;
    }
  });
},

//文件上传结束


})