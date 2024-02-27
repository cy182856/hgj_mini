var app = getApp(),
p = require('../const/path.js'),
u = require('../utils/util'),
api = require('../const/api'),
st = require('../const/storage'),
n = null,
a ={
  init: function() {
    n = (0, u.getCurrentPage)();
  },
  queryAcDevList:function(){
    n.showLoading(!0)
    app.req.postRequest(api.queryAcDevList, '').then(function (res) {
      console.log(res)
      if(res.data && res.data.RESPCODE == "000"){
        n.setData({
          cellGates: res.data.cellGates,
          gates:res.data.gates
        })
      }else{
        wx.showToast({
          title: '获取门禁设备信息失败',
          icon:'none',
          duration:2000,
          success:function(){
            setTimeout(function(){
              wx.navigateBack({
                delta: 0,
              })
            },3000)
          }
        })
      }
      n.showLoading(!1)
      n.setData({
        queryFinish:true
      })
    })
  },
  openDoor:function(params){
    n.showLoading(!0)
    app.req.postRequest(api.remoteOpenDoor, params).then(function (res) {
      if(res.data && res.data.RESPCODE == "000"){
        setTimeout(function(){
          wx.showToast({
            title: '开门成功',
            icon:'none',
            duration:2000
          })
          n.showLoading(!1)
        },4000)
      }else{
        setTimeout(function(){
          wx.showToast({
            title: '开门失败',
            icon:'none',
            duration:2000
          })
          n.showLoading(!1)
        },4000)
      }
    })
  }
}

module.exports = {
  acdevinfo: a
};