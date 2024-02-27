// subpages/family/chooseImg/chooseImg.js
const util = require('../../../utils/util');
const stringUtil = require('../../../utils/stringUtil'),
api = require('../../../const/api');
var that = null, app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    updImg:'',
    checkImgInfo:'',
    imgDomain:'https://jiaimginfo.huiguan.com/',
    active:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.loading(),that = this;
    var loginInfo = app.storage.getLoginInfo();
    var imgList = new Array();
    var imgUrl = that.data.imgDomain + 'default_head_image/';
    var child = new Array();
    for(var i = 1; i <= 4 ; i++){
      child.push({id: i, src: imgUrl + util.leftPad(i+'', 3, '0') + '.jpg', check:false});
    }
    imgList.push(child);
    child = new Array();
    for(var i = 5; i <= 8 ; i++){
      child.push({id: i, src: imgUrl + util.leftPad(i+'', 3, '0') + '.jpg', check:false});
    }
    imgList.push(child);
    child = new Array();
    for(var i = 9; i <= 12 ; i++){
      child.push({id: i, src: imgUrl + util.leftPad(i+'', 3, '0') + '.jpg', check:false});
    }
    imgList.push(child);
    child = new Array();
    for(var i = 13; i <= 16 ; i++){
      child.push({id: i, src: imgUrl + util.leftPad(i+'', 3, '0') + '.jpg', check:false});
    }
    imgList.push(child);
    child = new Array();
    for(var i = 17; i <= 20 ; i++){
      child.push({id: i, src: imgUrl + util.leftPad(i+'', 3, '0') + '.jpg', check:false});
    }
    imgList.push(child);
    let headImgUrl = options.headImgUrl;
    if(headImgUrl && headImgUrl != ''){
      for(var i in imgList){
        for(var j in imgList[i]){
          if(headImgUrl == imgList[i][j].src){
            imgList[i][j].check = true;
            that.setData({
              checkImgInfo:imgList[i][j]
            })
            break;
          }
        }
      }
    }
    let timestamp = Date.parse(new Date())/1000
    that.setData({
      imgList:imgList,
      imgHeight:(app.globalData.windowW - 30) * 0.23 ,
      huSeqId: loginInfo.huSeqId,
      custId:loginInfo.custId,
      headImgUrl:headImgUrl + "?timestamp=" + timestamp
    })
  },

  checkImg:function(e){
    var img = e.currentTarget.dataset.item;
    var imgList = that.data.imgList;
    for(var i in imgList){
      for(var j in imgList[i]){
        imgList[i][j].check = false;
        if(img.id == imgList[i][j].id){
          imgList[i][j].check = true;
        }
      }
    }
    that.setData({
      imgList:imgList,
      checkImgInfo : img
    })
  },
  onTabChange:function(e){
    that.setData({
      active:e.detail.name
    })
  },
  chooseHeadImg:function(){
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success (res) {  
        //计算需要裁减的宽度，具体处理，根据样式设计的值来
        that.showLoading(!0)
        let width = app.globalData.windowW - 20
        let height = app.globalData.windowH - 140
        console.log(res.tempFiles[0])
        let data={
          'img':res.tempFilePaths[0],
          width : width,
          height : width,
          y:(height-width)/2
        }
        that.setData({
          imgSize : res.tempFiles[0].size
        })
        wx.navigateTo({
          url: '../../../components/cropper/cropper?data='+JSON.stringify(data)
        })
      },
      complete(res){
        that.showLoading(!1)
        if(res.errMsg.indexOf('fail') >= 0 && res.errMsg.indexOf('cancel') < 0){
          wx.showToast({
            title: '选择图片失败，请稍后再试',
            icon:'none',
            duration:2000
          })
        }
      }
    })
  },
  initUpImg:function(src){
    that.compressImage(src);
  },
    //图片压缩处理
  drawImage(path){
    var cid = 'canvas0';
    var size = that.data.imgSize;
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
        that.setData({
          cWidth: canvasWidth,
          cHeight: canvasHeight
        })
        //---------对于本身就比较小的图片，无需进行压缩处理---------------
        if(canvasWidth == imgRes.width && canvasHeight == imgRes.height){
          console.log('图片已经很小，无需进行压缩处理',path);
          wx.hideLoading();
          that.setData({
            updImg:path
          });
          that.checkUpdImg();
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
                    that.setData({
                      updImg:res.tempFilePath
                    });
                    that.checkUpdImg();
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
        wx.showToast({
          title: '获取上传图片信息失败，请更换图片重试。',
          icon:'none',
          duration:3000
        })
      },complete:function(){
        that.showLoading(!1)
      }
    })
  },
  bindCommitHeadImg(){
    if(that.data.active == 1){
      if(!that.data.updImg || that.data.updImg == ''){
        wx.showToast({
          title: '头像设置成功',
          icon:'none',
          duration:3000
        })
        return false;
      }
      that.doUploadImg();
    }else{
      if(!that.data.checkImgInfo || that.data.checkImgInfo == null){
        wx.showToast({
          title: '请选择一个头像',
          icon:'none',
          duration:3000
        })
        return false;
      }
      let headImgUrl = that.data.checkImgInfo.src
      that.doCommitHeadImg(headImgUrl)
    }
  },
  doCommitHeadImg(headImgUrl){
    that.showLoading(!0);
    var updataParam = {
      custId: that.data.custId,
      huSeqId: that.data.huSeqId,
      headImgUrl: headImgUrl
    }

    app.req.postRequest(api.updateHouseUsrInfo, updataParam).then(function (value) {
      console.log("updateHouseUsrInfo S ", value);
      if (value.data.RESPCODE == "000") {
        wx.showToast({
          icon: 'none',
          title: '头像设置成功',
          duration:3000
        })
        var prePage = util.getPrePage();
        let timestamp = Date.parse(new Date())/1000;
        prePage.setData({
          headImgUrl:headImgUrl + '?timestamp=' + timestamp,
          dataChanged:'Y'
        })
      } else {
        wx.showToast({
          icon: 'none',
          title: '头像设置失败，'+ value.data.ERRDESC,
          duration:3000
        })
      }
      that.showLoading(!1);

    }, function (value) {
      console.log("updateHouseUsrInfo F ", value);
      wx.showToast({
        icon: 'none',
        title: '头像设置失败，请稍后重试',
        duration:3000
      })
    });
  },
  doUploadImg:()=>{
    that.showLoading(!0)
    wx.uploadFile({
      url: api.uploadImages, 
      filePath: that.data.updImg,
      name: 'file',
      header: {
        "Content-Type": "multipart/form-data",
        'accept': 'application/json'
      },
      formData: {fileType:'INFO', custId:that.data.custId, busiId :'04',imgId:that.data.huSeqId},
      success(res) {
        // 上传完成需要更新 fileList
        console.log('图片上传成功',res);
        let respData = JSON.parse(res.data)
        that.doCommitHeadImg(that.data.imgDomain.concat(respData.imgFilePath[0]))
      },
      fail(res){
        wx.showToast({
          title: '头像上传失败，请重试。',
          icon:'none',
          duration:3000
        })
      },
      complete:res=>{
        console.log('图片上传完成',res);
        that.showLoading(!1)
      }
    });
  },
  checkUpdImg:function(){
    var imgList = that.data.imgList;
    for(var i in imgList){
      for(var j in imgList[i]){
        imgList[i][j].check = false;
      }
    }
    that.setData({
      imgList:imgList,
      checkImgInfo:''
    })
  },
  compressImage:function(src){
    var imgSize = that.data.imgSize;
    if(imgSize < 1048576 / 5){
      console.log("小于200k，不需要压缩");
      that.setData({
        updImg:src
      });
      that.checkUpdImg();
    }else{
      var quality = 50;
      if(imgSize > 1048576 * 2){
        quality = 5;
      }else if(imgSize > 1048576){
        quality  = 10;
      }else if(imgSize > 1048576 / 2){
        quality  = 30;
      }
      wx.compressImage({
        src: src,
        quality:quality,
        success(res){
          console.log("压缩成功");
          that.setData({
            updImg:res.tempFilePath
          });
          that.checkUpdImg();
        }
      })
    }
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

  }
})