const api = require('../../../const/api'),
app = getApp();
 
 Page({

  /**
   * 页面的初始数据
   */
  data: {

    identityCode:'',
    houseIds:[],
    cstIntoId:'',
    identityOptions: [
      // { code: '2', miniDesc: '业主'},
      // { code: '3', miniDesc: '租客' },
      // { code: '4', miniDesc: '亲属' },
    ],

    houseOptions: [
      // {id: '1', resName: '1-1-1001'},
      // {id: '2', resName: '1-1-1002'},
      // {id: '3', resName: '1-1-1003'},    
    ]
  },

  radioChange(e) {
    var checkValue = e.detail.value;
    this.setData({identityCode:checkValue});
    console.log("------identityCode--------" + this.data.identityCode);
    // 身份选择如果是员工、租客, 亲属，需查询房屋列表
    if(checkValue == 1 || checkValue == 3 || checkValue == 4){
      var data = {
        cstCode:app.storage.getCstCode(),
      }
      app.req.postRequest(api.houseListByCstCode,data).then(res=>{
        if(res.data.respCode == '000'){
          this.setData({
            houseOptions:res.data.houseList
          })
        }
      })
    }

    // const options = this.data.options.map(item => {
    //   if (item.value === e.detail.value) {
    //     return { ...item, checked: true };
    //   }
    //   return { ...item, checked: false };
    // });
    // this.setData({ options });
  },

  checkboxChange(e) {
    //console.log('checkbox发生change事件，携带value值为：', e.detail.value)
    this.setData({houseIds:e.detail.value});
    console.log("------houseIds--------" + this.data.houseIds);
    // const items = this.data.items
    // const values = e.detail.value
    // for (let i = 0, lenI = items.length; i < lenI; ++i) {
    //   items[i].checked = false

    //   for (let j = 0, lenJ = values.length; j < lenJ; ++j) {
    //     if (items[i].value === values[j]) {
    //       items[i].checked = true
    //       break
    //     }
    //   }
    // }

    // this.setData({
    //   items
    // })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    // 获取身份
    this.identityList();
  },

  
  //获取身份
  identityList(){
    var data = {
      proNum:app.storage.getProNum()
    }
    app.req.postRequest(api.identityList,data).then(res=>{
      if(res.data.respCode == '000'){
        this.setData({
          identityOptions:res.data.identityList
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {
    创建入住信息
    var cstCode = app.storage.getCstCode();
    var orgId = app.storage.getProNum();
    var cstName = app.storage.getCstName();
    var resId = this.data.houseIds;
    var intoType = this.data.identityCode;
    var data = {
      resId:resId,
      cstCode:cstCode,
      intoType:intoType,
      orgId:orgId
    }
    app.req.postRequest(api.createIntoInfo,data).then(res=>{
      if(res.data.respCode == '000'){
        var cstIntoId = res.data.cstIntoId;
        this.setData({
          cstIntoId:cstIntoId
        })
      }
    })
    var path = 'pages/hu/hubind/hubind?cstCode=' + cstCode + '&cstName=' + cstName + '&cstIntoId=' + this.data.cstIntoId + '&proNum=' + orgId;
    return {
        title:'房屋入住邀请',
        path: path
    }
  }
})