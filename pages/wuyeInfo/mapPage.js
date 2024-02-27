const setting = {
  skew: 0,
  rotate: 0,
  showLocation: false,
  showScale: false,
  subKey: '',
  layerStyle: 1,
  enableZoom: true,
  enableScroll: true,
  enableRotate: false,
  showCompass: false,
  enable3D: false,
  enableOverlooking: false,
  enableSatellite: false,
  enableTraffic: false,
};
const app = getApp();
Page({
  data: {
    iphoneX:false,
    latitude:31.230053,
    longitude: 121.472412,
    markers: [{
      id: 1,
      latitude:31.230053,
      longitude: 121.472412,
      name: 'T.I.T 创意园',
      iconPath: '/assets/icons/location.png',
      width:'60rpx',
      height:'60rpx'
    }],
    shopName:"",
    shopAddress:""
  },
  onLoad:function(e){
   this.setData({
    iphoneX: app.globalData.iphoneX ,
    shopName: e.name,
    shopAddress:e.addr
   })
  
  },
  onReady: function (e) {
    this.mapCtx = wx.createMapContext('myMap')
  },
})