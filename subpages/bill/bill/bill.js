const api = require('../../../const/api'),
 app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
      refreshIfNeeded: false,
      billYearList:[],
      pageNum:1,
      pageSize:2,
      pages:1,
      totalNum:1,
      obj:null,
      cstCode:'',
      proNum:'',
      proName:app.storage.getProName(),
      wxOpenId:'',
      navList: ['未交清', '已交清'],
      nav_type: 0,
      payment_button_disabled:false,
      checkIds:[],
      totalAmount:0,

      jiantouShow:['jiantou_up'], 
      selectedFlag :[false],

      checkData:[],
      menuTree:[]
      // menuTree: [{
      //     "checked": false,
      //     "children": [{
      //         "checked": false,
      //         "children": [{
      //             "id": "10",
      //             "checked": false,
      //             "year":"2024",
      //             "itemName":"物业费",
      //             "repYears": "2024-03",
      //             "title": "2024年3月",
      //             "monthPriRev":"1000000.99"
      //         }, {
      //             "id": "11",
      //             "checked": false,
      //             "year":"2024",
      //             "itemName":"物业费",
      //             "repYears": "2024-04",
      //             "title": "2024年4月",
      //             "monthPriRev":"1000000.99"
      //         }],
      //         "id": "12",
      //         "year":"2024",
      //         "itemName": "物业费",
      //         "title": "物业费",
      //         "isHidden": false,
      //         "bindAll": false,
      //         "itemMonthPriRev":"1000000.99"
      //     }, {
      //         "checked": false,
      //         "children": [{
      //             "id": "13",
      //             "checked": false,
      //             "year":"2024",
      //             "itemName":"停车费",
      //             "repYears": "2024-03",
      //             "title": "2024年3月",
      //             "monthPriRev":"187600.99"
      //         }],
      //         "id": "14",
      //         "year":"2024",
      //         "itemName": "停车费",
      //         "title": "停车费",
      //         "isHidden": false,
      //         "itemMonthPriRev":"105600.99"
      //     }],
      //     "id": "1",
      //     "isHidden": true,
      //     "bindAll": false,
      //     "year":"2024",
      //     "title": "2024年"
      // }, {
      //     "checked": false,
      //     "children": [{
      //         "checked": false,
      //         "children": [{
      //             "id": "21",
      //             "checked": false,
      //             "year":"2023",
      //             "itemName":"物业费",
      //             "repYears": "2023-03",
      //             "title": "2023年3月",
      //             "monthPriRev":"105600.99"
      //         }],
      //         "id": "22",
      //         "year":"2023",
      //         "itemName": "物业费",
      //         "title": "物业费",
      //         "isHidden": false,
      //         "itemMonthPriRev":"105600.99"
      //     }, {
      //         "checked": false,
      //         "children": [{
      //             "id": "23",
      //             "checked": false,
      //             "year":"2023",
      //             "itemName":"停车费",
      //             "repYears": "2023-04",
      //             "title": "2023年4月",
      //             "monthPriRev":"105600.99"
      //         }],
      //         "id": "24",
      //         "year":"2023",
      //         "itemName": "物业费",
      //         "title": "停车费",
      //         "isHidden": false,
      //         "itemMonthPriRev":"105600.99"
      //     }],
      //     "bindAll": false,
      //     "isHidden": true,
      //     "year": "2023",
      //     "title": "2023年",
      //     "id": "2"
      // }]
 

  },

  payLogChange(){
    wx.navigateTo ({
      url: '../billMerge/billMerge',
    })       
  },

  billMonthDetailChange(e){
    var repYears = e.currentTarget.dataset.datavalue.repYears;
    var ipItemName = e.currentTarget.dataset.datavalue.ipItemName;
    wx.navigateTo ({
      url: '../billMonthDetail/billMonthDetail?repYears='+repYears+'&ipItemName='+ipItemName
    })  
  },

  changeType: function (e) {
    let {
      index
    } = e.currentTarget.dataset;
    if (this.data.nav_type=== index || index === undefined) {
      return false;
    } else {
      this.setData({
        nav_type: index
      })
    }
    this.setData({
      pageNum:1,
      checkIds:[],
      totalAmount:0
    });
    this.queryForPage();
  },

  loadMore(event){
    var pageNum = this.data.pageNum + 1;
    this.setData({
      pageNum:pageNum,
    });
    this.queryForPage('loadMore');
  },

  queryForPage(type){
    this.showLoading(1)
    var datas = this.data;
    var pageNum = datas.pageNum;
    var pageSize = datas.pageSize;
    var lockLogo = datas.nav_type;
    var data = {};
    data['pageNum'] = pageNum;
    data['pageSize'] = pageSize;
    data['cstCode'] = app.storage.getCstCode();
    data['wxOpenId'] = app.storage.getWxOpenId();
    data['proNum'] = app.storage.getProNum();   
    data['lockLogo'] = lockLogo;
    var that = this;
    app.req.postRequest(api.queryBill,data).then(res=>{
        console.log("回调用",res);
        if(res.data.respCode == '000'){
          that.showLoading(0)
          var menuTree = res.data.menuTree;         
          let totalNum = res.data.totalNum;
          var pages = parseInt(res.data.pages);
          that.data.menuTree.push.apply(that.data.menuTree,menuTree);
          that.setData({
            pages:pages,
            menuTree:type == 'loadMore'?that.data.menuTree:menuTree,
            totalNum:totalNum,
            isRefreshing:false
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

  mergeBill(e){
    //var checkIds = this.data.checkIds;
    var totalAmount = this.data.totalAmount;
    var checkData = this.data.checkData;
    var data = {};
    data['cstCode'] = app.storage.getCstCode();
    data['wxOpenId'] = app.storage.getWxOpenId();
    data['proNum'] = app.storage.getProNum();   
    data['checkData'] = checkData;
    //data['orderIds'] = checkIds;
    data['totalAmount'] = totalAmount;
      app.req.postRequest(api.mergeBill,data).then(res=>{
        console.log("合并账单返回",res);
        var code = res.data.errCode;
        var desc = res.data.errDesc;
        if(res.data.respCode == '000'){
          console.log("跳转到缴费中页面");
          wx.navigateTo ({
            url: '../billMerge/billMerge',
          })       
          // this.setData({
          //   totalAmount:0
          // });
          //this.queryForPage();      

        }else if(code == '01035015'){
          wx.showModal({
            title: '提示',
            content: '您有未支付订单，请前往处理！',
            success: function (res) {
              if (res.confirm) {
                console.log('用户点击确定');
                wx.navigateTo ({
                  url: '../billMerge/billMerge',
                })                 
              } else if (res.cancel) {
                console.log('用户点击取消');
              }
            }
          });     
        }else{
          // if(!desc){
          //   desc = '网络异常，请稍后再试';
          // }
          app.alert.alert(code + ":" + desc);
        }
      }); 
    
  },


  costDetail: function (event) {
   
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.loading(),this.showLoading(0);
    this.queryForPage();
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
    this.checkForChecked();
     // 获取当前页面栈
    //var pages = getCurrentPages();
    // 当前页面
    // var currentPage = pages[pages.length - 1]; 
    // if (currentPage.data.refreshIfNeeded) {
    //     currentPage.data.refreshIfNeeded = false;    
    //     this.setData({
    //       totalAmount:0,
    //       pageNum:1,
    //       pageSize:2
    //     });
    //     this.queryForPage(); 
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
    // console.log('onPullDownRefresh')
    // this.queryForPage();
	  // this.getReservation(this.resParams)
    // uni.stopPullDownRefresh()
    

    this.setData({
      pageNum:1,
      loading:false,
      isRefreshing:true,
      billYearList:new Array(),
      checkData:new Array(),
      totalAmount:0
    })
    this.queryForPage()
    wx.stopPullDownRefresh({
    })

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    let totalNum = this.data.totalNum;
    let pageNum = this.data.pageNum;
    let pageSize = this.data.pageSize;
    if(pageNum * pageSize < totalNum){
      this.loadMore();
    }else{
      wx.showToast({
        title: '已经到底了',
        icon:'none'
      })
    }
    
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },


  /**
    * 默认选中是否展开
  */
  checkForChecked() {
      var data = this.data.menuTree

      // 获取所有被选中的节点
      var checkedNodes = this.getDeep(data)
      // 获取所有选中节点的父节点
      checkedNodes.forEach(element => {
          var tmp = this.getParentsById(data, element.id)
          if (tmp != undefined && tmp.length > 0) {
              // 最后一级选中，默认展开和选中父级菜单
              tmp.forEach(element => {
                  element.isHidden = false
                  element.checked = true
              })
          }
      })

      this.setData({
          menuTree: data
      })
  },
  // 递归 - 根据id获取所有父节点
  getParentsById(list, id) {
      for (let i in list) {
          if (list[i].id == id) {
              return [list[i]]
          }
          if (list[i].children) {
              let node = this.getParentsById(list[i].children, id);
              if (node !== undefined) {
                  return node.concat(list[i])
              }
          }
      }
  },
  // 递归 - 根据id获取当前节点对象
  getNodeById(data, id, newNodes = []) {
      data.forEach(element => {
          // 匹配到节点
          if (element.id === id) {
              newNodes.push(element)
          }
          if (element.children) {
              this.getNodeById(element.children, id, newNodes)
          }
      })
      return newNodes;
  },

  // 递归 - 根据id获取所有子节点，（其实就是先获取当前id的节点对象，然后取当前对象,注意这里返回的是数组）
  getChildrenById(data, id, newNodes = []) {
      var list = data.children
      if (list != undefined) {
          list.forEach(element => {
              newNodes.push(element)
              if (element.children) {
                  this.getChildrenById(element, id, newNodes)
              }
          })
      }
      return newNodes;
  },

  // 递归 - 获取所有选中节点
  getDeep(data, newCheckedNodes = []) {
      data.forEach(element => {
          if (element.checked) {
              newCheckedNodes.push(element)
          }
          if (element.children) {
              this.getDeep(element.children, newCheckedNodes)
          }
      })
      return newCheckedNodes
  },

  // 递归 - 根据节点id获取兄弟所有节点
  getBrotherNodesById(list, id) {
      // 非顶级节点：获取节点父节点对象里的children
      var parentNodes = this.getParentsById(list, id)
      if (parentNodes && parentNodes.length >= 2) {
          return parentNodes[1].children
      }
      // 顶级节点：第一级是自己，从原始数组中遍历第一层即可
      return list

  },

  // 根据当前节点id，获取及所有的父级兄弟节点的所有父节点
  getParentBrotherAllNodesById(list, id) {
      var result = []
      // 1、获取当前节点id父节点的父节点
      var parentNodes = this.getParentsById(list, id)

      // 小于3表示当前父节点是顶级节点
      if (parentNodes.length < 3) {
          return parentNodes[parentNodes.length - 1]
      }
      var testNode = parentNodes[2];
      // 2、获取父节点的父节点所有兄弟节点
      var children = testNode.children
      children.forEach(element => {
          var parentNodesById = this.getParentsById(list, element.id)
          if (parentNodesById.length >= 2) {
              // js 数组中添加多个元素 简单的方法 push(...[])
              result.push(...(parentNodesById.slice(0, parentNodesById.length - 1)))
          }
      });
      return result;
  },

  /**
   * 点击事件 - 左侧绑定复选框事件
   */
  checkboxChangeBindAll(e) {
      var index = e.currentTarget.dataset.index;
      var index2 = e.currentTarget.dataset.index2;
      var list = this.data.menuTree
      if (index2 == undefined) {
          list[index].bindAll = !list[index].bindAll
      }
      if (index2 != undefined) {
          list[index].children[index2].bindAll = !list[index].children[index2].bindAll
      }

      console.log(this.data.menuTree);
  },

  /**
   * 点击事件 - 右侧复选框事件
   */
  checkboxChangeAll(e) {
      var id = e.currentTarget.dataset.id;
      var data = this.data.menuTree
      var node = this.getNodeById(data, id)
      var childrenNodes = this.getChildrenById(node[0], id)

      // 1、子节点点选中状态-跟随父节点移动
      node[0].checked = !node[0].checked
      // 节点下面的所有子节点跟随父节点的选中状态
      childrenNodes.forEach(element => {
          element.checked = node[0].checked
      })

      // 2、父节点选中状态,子节点都没选中，父节点默认不选中，子节点有一个选中，父节点也选中
      // 获取同级兄弟节点
      var bortherNodes = this.getBrotherNodesById(data, id)

      // 3、同级都选中
      var allChecked = false
      bortherNodes.forEach(element => {
          if (element.checked) {
              allChecked = true
          }
      })

      // 获取节点id所有父节点
      var parentNodes = this.getParentsById(data, id)
      if (parentNodes.length > 1) {
          if (allChecked) {
              // 下标index=0的节点是其本身，这里跳过
              for (let index = 1; index < parentNodes.length; index++) {
                  const element = parentNodes[index];
                  element.checked = true
              }
          }else{
              parentNodes[1].checked =false
          }
      }

      // 4、同级都未选中
      if (!allChecked) {
          var allNoChecked = false
          //  根据当前节点id，获取除去顶级节点的所有的父级兄弟节点的所有父节点
          var parentBother = this.getParentBrotherAllNodesById(data, id)
          console.log(parentBother);
          if (parentBother.length > 1) {
              parentBother.forEach(element => {
                  if (element.checked) {
                      allNoChecked = true
                  }
              });
          }
          console.log(allNoChecked);
          // console.log(parentBother);
          if(!allNoChecked){
              parentNodes.forEach(element => {
                  element.checked=false
              });
          }
      }

      // 已选中数据
      var totalAmount = 0;
      var checkData = [];
      for(let i = 0; i<data.length; i++){
        if(data[i].checked == true){
          var item = data[i].children;
          for(let j = 0; j<item.length; j++){
            if(item[j].checked == true){
              var bill = item[j].children;
              for(let k = 0; k<bill.length; k++){
                if(bill[k].checked == true && bill[k].priRev > 0){
                  checkData.push(bill[k]);
                  totalAmount =  parseFloat((totalAmount + bill[k].priRev).toFixed(2));
                }
              }
            }
          }
        }
      }

      this.setData({
          menuTree: data,
          checkData:checkData,
          totalAmount:totalAmount
      })
      console.log(this.data.menuTree);
  },
  /**
   * 点击事件 - 点击层级显示和折叠事件
   */
  openAndHide(e) {
      var id = e.currentTarget.dataset.id;
      var list = this.data.menuTree

      console.log(id);
      // 根据 id 获取选中节点的对象
      var node = this.getNodeById(list, id)
      // 根据 id 获取选中节点下的所有子节点,   node[0].children(只展开第二层)，node[0]会展开所有
      var res = this.getChildrenById(node[0].children, id)
      // 包含当前id节点本身
      res.push(node[0])

      // 遍历选中节点（及自己）是否展开
      res.forEach(element => {
        element.isHidden = !element.isHidden
      })

      this.setData({
          menuTree: list
      })

  }


})