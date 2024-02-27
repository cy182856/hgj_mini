// subpages/filepub/filepub.js
const storage = require('../../const/storage'),
util = require('../../utils/util'),
p = require('../../const/path.js'),
u = require('../../utils/util'),
api = require('../../const/api');
var app = getApp(),
that = null;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // floadTitles:[{cataId:1,cataName:'第一层文件夹'}],
    floadTitles:[],
    iconClass:'jia-kapian2',
    // fileList:[
    //   {
    //     fileType:"C",
    //     cataId:2,
    //     cataName:"第二层文",
    //     fileDate:'2021-06-11'
    //   },
    //   {
    //     fileType:"F",
    //     fileName:"a.pdf",
    //     fileDate:'2021-06-11'
    //   }
    // ],
    fileList:[],
    fileLists:[
      {cataId:1,
        fileList:[
          {
            fileType:"C",
            cataId:2,
            cataName:"第二层文件夹",
            fileDate:'2021-06-11'
          },
          {
            fileType:"F",
            fileName:"a.pdf",
            fileDate:'2021-06-11'
          }
        ]
      },
      {cataId:2,
        fileList:[
          {
            fileType:"C",
            cataId:3,
            cataName:"第三层文件夹",
            fileDate:'2021-06-11'
          },
          {
            fileType:"F",
            fileName:"b1.pdf",
            fileDate:'2021-06-11'
          },
          {
            fileType:"F",
            fileName:"b2.pdf",
            fileDate:'2021-06-11'
          }
        ]
      },
      {cataId:3,
        fileList:[
          {
            fileType:"C",
            cataId:40,
            cataName:"第四层1文件夹",
            fileDate:'2021-06-11'
          },
          {
            fileType:"C",
            cataId:41,
            cataName:"第四层2文件夹",
            fileDate:'2021-06-11'
          },
          {
            fileType:"F",
            fileName:"c1.pdf",
            fileDate:'2021-06-11'
          },
          {
            fileType:"F",
            fileName:"c2.pdf",
            fileDate:'2021-06-11'
          }
        ]
      },
      {cataId:40,
        fileList:[
          {
            fileType:"C",
            cataId:5,
            cataName:"第五层文件夹",
            fileDate:'2021-06-11'
          },
          {
            fileType:"F",
            fileName:"d11.pdf",
            fileDate:'2021-06-11'
          },
          {
            fileType:"F",
            fileName:"d12.pdf",
            fileDate:'2021-06-11'
          }
        ]
      },
      {cataId:41,
        fileList:[
          {
            fileType:"F",
            fileName:"d21.pdf",
            fileDate:'2021-06-11'
          },
          {
            fileType:"F",
            fileName:"d22.pdf",
            fileDate:'2021-06-11'
          }
        ]
      },
      {cataId:5,
        fileList:[
          {
            fileType:"F",
            fileName:"e.pdf",
            fileDate:'2021-06-16'
          },
          {
            fileType:"F",
            fileName:"e.pdf",
            fileDate:'2021-06-16'
          }
        ]
      }
    ],
    navScrollLeft:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.loading(),that = this, that.showLoading(!1);
    that.setData({
      isIphone:app.globalData.isiPhone,
      windowWidth:app.globalData.windowW
    })
    that.queryFmFileList('000');
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
  bindClickFload:function(e){
    let fileInfo = e.currentTarget.dataset.item;
    let fileLists = that.data.fileLists;
    let floadTitles = that.data.floadTitles;
    let newFloadTitles = new Array();
    that.showLoading(!0);
    for(var i in floadTitles){
      if(floadTitles[i].cataId == fileInfo.cataId){
        break;
      }
      newFloadTitles.push({
        cataId:floadTitles[i].cataId,
        cataName:floadTitles[i].cataName
      })
    }
    that.setData({
      floadTitles:newFloadTitles
    })
    that.openCata(fileInfo)
  },
  bindOpenCata:function(e){
    that.showLoading(!0);
    let fileInfo = e.currentTarget.dataset.item;
    that.openCata(fileInfo)
  },
  openCata:function(fileInfo){
    // let fileLists = that.data.fileLists;
    var floadTitles = that.data.floadTitles;
    floadTitles.push({
      cataId:fileInfo.cataId,
      cataName:fileInfo.cataName
    })
    that.setData({
      floadTitles:floadTitles
    })
    that.scrollTitle(floadTitles.length);
    // for(var i in fileLists){
    //   if(fileLists[i].cataId == fileInfo.cataId){
    //     that.setData({
    //       fileList:fileLists[i].fileList
    //     })
    //     break;
    //   }
    // }
    that.queryFmFileList(fileInfo.cataId);
  },
  scrollTitle:function(length){
    var singleNavWidth = that.data.windowWidth * 0.75 / 5;
    that.setData({
      navScrollLeft: parseInt(length) * singleNavWidth
    }) 
  },
  backToHome:function(){
    that.queryFmFileList('000');
    that.setData({
      floadTitles:new Array()
    })
  },
  queryFmFileList :function(cataId){
    let custId = wx.getStorageSync(storage.STORAGE.CUST_ID);
    var params = {};
    params.custId = custId
    params.upCataId = cataId;
    console.log('获取文件列表信息请求参数',params)
    that.showLoading(!0);
    app.req.postRequest(api.queryFmFileList, params).then(function (res) {
      if(res.data.respCode == '000'){
        that.setData({
          fileList:res.data.data
        })
      }else{
        wx.showToast({
          title: '获取文件信息失败，请稍后重试',
          icon:'none',
          duration:2000
        })
        that.setData({
          fileList:new Array()
        })
      }
      that.showLoading(!1)
    })
  },
  switchShowStyle:function(){
    that.setData({
      iconClass:that.data.iconClass == 'jia-liebiao2' ? 'jia-kapian2' : 'jia-liebiao2'
    })
  },
  bindOpenFile:function(e){
    let url = e.currentTarget.dataset.item.fileUrl;
    if(that.data.isIphone){
      wx.navigateTo({
        url: '/subpages/filepub/checkpdf/checkpdf?url=' + url
      })
    }else{
      that.openFile(url);
    }
  },
  openFile(url) {
    wx.showLoading({
     title: '加载中',
     mask: true
    })
    wx.downloadFile({
     url: url,
     success: function(res) {
      wx.hideLoading()
      var filePath = res.tempFilePath;
      wx.showLoading({
       title: '正在打开',
       mask: true
      })
      wx.openDocument({
       filePath: filePath,
       fileType: 'pdf',
       success: function(res) {
        console.log(res)
        wx.hideLoading()
        console.log('打开文档成功');
       },
       fail: function(err) {
        wx.hideLoading()
        console.log('fail:' + JSON.stringify(err));
        wx.showToast({
          title: '打开文档失败，请稍后重试',
          icon:'none',
          duration:2000
        })
       }
      });
     },
     fail: function(err) {
      wx.hideLoading()
      console.log('fail:' + JSON.stringify(err));
      wx.showToast({
        title: '获取文档信息失败，请稍后重试',
        icon:'none',
        duration:2000
      })
     }
    });
   }
})