let Toast = null;
let api = null;
let app = null;
let that = null;

function quanjia() {
    Toast.alert({message: '全家.........'}).then(()=>{
        wx.showToast({
            title:'quanjia',
            icon:'none'
        })
    })
    that.setData({name:'quanjia'});
    // wx.navigateTo({
    //   url: '/subpages/repair/pages/repairApply/repairApply',
    // })

}

function wuye(){
    Toast.alert({message: '物业.........'});

    app.req.postRequest(api.annonyQuery,{custId:'3048000060'}).then(res=>{
        console.log('物业。。。。=》',res);
    })
    that.setData({name:'wuye'});
}

function shunfeng(){
    // Toast.alert({message: '顺风.........'});
    wx.showToast({
        title:'顺风',
        icon:'none'
    })
    that.setData({name:'shunfeng'});
}

function error(){
    console.log('当前未定义正确的函数');
    Toast.alert({message: 'error.........'});
}

function center(event){
    let fun = event.currentTarget.dataset.fun;
    console.log('event==========>',event);
    switch (fun){
        case 'quanjia':quanjia();break;
        case 'wuye':wuye();break;
        case 'shunfeng':shunfeng();break;
        default : error();
    }
}
function init(toast,apis,apps,curObj){
    Toast = toast;
    api = apis;
    app = apps;
    that = curObj;
}

module.exports = {
    init:init,
    center:center
}