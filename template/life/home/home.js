let Toast = null;
let apiUtil = null;
let app = null;
let that = null;

function center(event){
  console.log(event.currentTarget.dataset);
  let fun = event.currentTarget.dataset.fun;
  console.log('event==========>',event);
  switch (fun){
      case 'lifeicon':lifeicon(event.currentTarget.dataset);break;
      case 'hotItem':itemshow(event.currentTarget.dataset);break;
      case 'recShop':recShop(event.currentTarget.dataset);break;
      case 'lifeItemshow':itemshow(event.currentTarget.dataset);break;
      default : ;
  }
}

function init(toast,apis,apps,curObj){
  console.log("-----------------");
  Toast = toast;
  apiUtil = apis;
  app = apps;
  that = curObj;
  that.setData({
    'showErrMsg':false,
    'showLifeMsg':false
  });
  queryPropSupLife();
  if (wx.pageScrollTo) {
    wx.pageScrollTo({
      scrollTop: 0
    })
  } 
  console.log("-----------------");
}

function recShop(dataset) {
  var supSeqId = dataset.supseqid;
  var shopId = dataset.shopid;
  var shopName = dataset.shopname;
  wx.navigateTo({
      url: '/subpages/shop/shopItemInfo?supSeqId=' + supSeqId + "&shopId=" + shopId + "&shopName=" + shopName,
  })
}

function itemshow(dataset) {
  var itemId = dataset.itemid;
  var itemName = dataset.itemname;
  var shopId = dataset.shopid;
  var supSeqId = dataset.supseqid;
  wx.navigateTo({
      url: '/subpages/item/itemInfoDetail?itemId=' + itemId + "&itemName=" + itemName + "&shopId=" + shopId + "&supSeqId=" + supSeqId,
  })
}

function lifeicon(dataset) {
    var lifeid = dataset.lifeid;
    var lifedesc = dataset.lifedesc;
    wx.navigateTo({
       url: '/subpages/item/lifeitem/lifeitem?lifeid=' + lifeid + "&lifedesc=" + lifedesc,
    })
}

/**
   * 查询首页数据
   */
  function queryPropSupLife(){
    let data = {
      
    };
    console.log("-----------------")
    console.log(app.globalData.windowH);
    app.req.postRequest(
      apiUtil.queryPropSupLifeUrl,
      data
    ).then(function (res) {
      console.log(res);
      that.showLoading(0);
      if (res.data.RESPCODE == 'EEE') {
        that.setData({
          'msg':'网络异常，请稍后再试',
          'showErrMsg':true,
          hotItemShowDtos:[],
          propLifeListDtos:[],
          recShopShowDtos:[],
          lifeItemShowDtos:[]
        });
        return
      } else if (res.data.RESPCODE != '000') {
        that.setData({
          'msg':res.data.ERRDESC,
          'showErrMsg':true,
          hotItemShowDtos:[],
          propLifeListDtos:[],
          recShopShowDtos:[],
          lifeItemShowDtos:[]
        });
        return
      }
      
      that.setData({
        hasHotShow:res.data.lifeData.hasHotShow,
        hotItemShowDtos:res.data.lifeData.hotItemShowDtos,
        propLifeListDtos:res.data.lifeData.propLifeListDtos,
        recShopShowDtos:res.data.lifeData.recShopShowDtos,
        lifeItemShowDtos:res.data.lifeData.lifeItemShowDtos,
        contentHeight:app.globalData.windowH - app.globalData.statusBarHeight
      });
      
    }).catch(error => {
      that.showLoading(0);
      that.setData({
        'msg':'网络异常，请稍后再试',
        'showErrMsg':true,
        hotItemShowDtos:[],
        propLifeListDtos:[],
        recShopShowDtos:[],
        lifeItemShowDtos:[]
      });
    });
  }

module.exports = {
  init:init,
  center:center
}

