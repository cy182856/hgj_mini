// pages/family/memberList.js
import Dialog from '../../miniprogram_npm/@vant/weapp/dialog/dialog';

const api = require('../../const/api'),
  app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    houseUsrInfo: [],
    commanyShortName: '',
    areaName: "",
    custId: "",
    huSeqId: "",
    houseSeqId: "",
    funcType: 'N',
    houseOwerId: "",
    checkecIndex: 0,
    propType:'R',
    
    canClosed:'Y',
    canUnRegist:'N',
    dataChanged:'N',
    iphoneX:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    var loginInfo = app.storage.getLoginInfo()
    console.log("loginInfo  ", loginInfo);
    //  console.log("getHouseUsrInfo  ",app.globalData.userInfo);   

    this.setData({
      commanyShortName: loginInfo.commanyShortName,
      propType:loginInfo.propType,
      areaName: loginInfo.completeAddr,
      custId: loginInfo.custId,
      huSeqId: loginInfo.huSeqId,
      houseSeqId: loginInfo.houseSeqId,
      iphoneX:app.globalData.iphoneX
    })

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  getHouseUsrInfo(){
    var that = this
    var data = {
      custId: that.data.custId,
      houseSeqId: that.data.houseSeqId
    }
    app.req.postRequest(api.getHouseUsrInfo, data).then(function (value) {
      console.log("queryUsrInfo S ", value);
      if (value.data.houseUsrInfo && value.data.houseUsrInfo.length > 0) {
        for (let x = 0; x < value.data.houseUsrInfo.length; x++) {
          if (value.data.houseUsrInfo[x].huRole == 'O') {
            that.data.houseOwerId = value.data.houseUsrInfo[x].huSeqId
            value.data.houseUsrInfo[x].Checked = true
            that.data. checkecIndex =x
          } else {
            value.data.houseUsrInfo[x].Checked = false
            if( value.data.houseUsrInfo[x].stat== 'N'){
              that.data.canClosed = 'N'
            }
          }
        }
      }
    that.setData({
        houseUsrInfo: value.data.houseUsrInfo,
        houseOwerId: that.data.houseOwerId,
        checkecIndex:that.data. checkecIndex
      })
    }, function (value) {
      console.log("queryAreaInfo F ", value);
    });
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this. getHouseUsrInfo()
  },

  onTaAddMembers: function () {
    wx.navigateTo({
      url: './members/addMembers',
    })
  },
  onTapTransfer: function () {
    this.setData({
      funcType: 'C'
    })
  },

  onMemberChange(e) {
    console.log("onMemberChange", e)
    let index = e.currentTarget.dataset.index
    var usrInfoItem = 'houseUsrInfo[' + index + '].Checked';
    var usrInfoLastItem = 'houseUsrInfo[' + this.data.checkecIndex + '].Checked';
    this.setData({
      [usrInfoLastItem]: false,
      [usrInfoItem]: e.detail

    })
    this.data.checkecIndex = index

  },

  onTapCancle() {
    this.setData({
      funcType: 'N'
    })
  },
  onTapConfirmChange() {
    var selMember = this.data.houseUsrInfo[0]
    var that = this
    this.data.houseUsrInfo.forEach(item => {
      if (item.Checked) {
        selMember = item
      }
    })

    console.log("onTapConfirmChange", selMember)
    if (selMember.huRole == 'O') {
      wx.showToast({
        title: '不可转让',
      })
      return
    }
    Dialog.confirm({
      title: '提示',
      message: '您确定要将户主转让给'+selMember.nickName+"?",
    })
      .then(() => {
        let data = {
          custId: that.data.custId,
          houseSeqId: that.data.houseSeqId,
          huSeqId:that.data.huSeqId,
          transferHuSeqId:selMember.huSeqId
        }
      
        app.req.postRequest(api.transferHouseUsrInfo, data).then(function (value) {
          console.log("transferHouseUsrInfo S ", value);
          wx.showToast({
            title: '转让成功',
          })
          that.setData({
            funcType: 'N'
          })
        // app.storage.setStorageSync("hasChangeNickName",true)
          // app.storage.setStorageSync("hasChangeRole",true)
          that.data.dataChanged="Y"
          that. getHouseUsrInfo()
    
        }, function (value) {
          console.log("transferHouseUsrInfo F ", value);
          wx.showToast({
            title: '转让失败',
          })
        });

      })
      .catch(() => {
       
      });

   
    
  },
  onTapMemberDetail(e) {
    var selMember = e.currentTarget.dataset.bitem;
    console.log("onTapMemberDetail S ", selMember);
    // let type = "S" // “S” 查看自己  "O " 产看其他人
    // if (this.data.huSeqId == selMember.huSeqId) {
    //   type = "S"
    // } else {
    //   type = "O"
    // }
    // if (type == 'O' && this.data.houseOwerId != this.data.huSeqId) {
    //   wx.showToast({
    //     title: '只能查看自己',
    //   })
    //   return
    // }
    if(this.data.houseUsrInfo.length>1){
      this.data.canUnRegist = 'N'
    }else{
      this.data.canUnRegist = 'Y'
    }
var that = this
    wx.navigateTo({
      url: './memberDetail?PageType=O&canUnRegist='+ this.data.canUnRegist,
      events: {
        dataChangedEvent: function(data) {
          that.data.dataChanged = data.Changed
        }
      },
      success: function (res) {
        res.eventChannel.emit('MemberDetailEvent', {
          data: selMember
        })
      }
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
    console.log("onUnload")
    const eventChannel = this.getOpenerEventChannel();

    eventChannel.emit('dataChangedEvent', {Changed: this.data.dataChanged});
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