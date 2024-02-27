//文件上传，选择文件
let curthat = null; //page对象
let imgList = []; //最初上传，在小程序缓存中的图片信息
let drawList = []; //画布张数
let finalImgList = []; //经过画图压缩后的图片
let curNum = 0; //当前已经回显在前端的图片张数
let Toast = null; //弹窗对象
function afterRead(event){
    console.log('event=after=====>',event);
    const { file } = event.detail;
    console.log('file=====>',file);
    //上传图片回显
    addImgPre(file);
    //获取上传的图片路径

    // addImgPre(file);//图片预览
    //
    //
    // console.log('开始处理文件保存到缓存的业务',file);
    // 图片压缩算法
    // console.log('file=========>',file);
    // choseImage(file);

}

function addImgPre(file) {
    console.log('上传的图片信息',file);
    // 当设置 mutiple 为 true 时, file 为数组格式，否则为对象格式
    let failImage = 0;
    if(curthat.data.multiple){
        // imgList.length > 0 ?imgList.push.apply(imgList,file):imgList = file
        for(let i = 0;i<file.length;i++){
            let imgObj = file[i];
            let path = getImagePath(imgObj);
            if(path == undefined || path == ''){
                failImage += 1;
            }else{
                imgObj['url'] = path;
                imgList.push(imgObj);

            }
        }

    }else{
        var imagePath = getImagePath(file);
        if(imagePath == undefined || imagePath == ''){
            failImage += 1;
        }else{
            file['url'] = imagePath;
            imgList.push(file);
        }
    }
    if(failImage > 0){
        Toast.alert({message:'您当前网络不佳，共计'+failImage+'张图片上传失败，请重试！'});
    }

    //初始化画布
    drawList = imgList;
    curthat.setData({
        drawList:drawList
    })
    //开始处理画图压缩业务
    choseImage();
    // //当前已经上传的图片处理
    // changeCurNum(imgList.length);
    // //设置最新的图片渲染效果
    // curthat.setData({
    //     imgList:imgList
    // })
    // console.log('图片渲好了', imgList);
}

//获取图片的路径，生产发现小程序上传图片的时候，有时候路径获取不到，现采取图片所有路径遍历，直到获取图片地址
function getImagePath(imgObj){
    let path = imgObj.path;
    if(path == undefined || path == ''){
        path = imgObj.url;
        if(path == undefined || path == ''){
            path = imgObj.thumb;
        }
    }
    return path;
}

//删除数据
function deleteImage(event){
    console.log('删除图片操作',event);
    deleteFromImgList(event.detail.index);
    changeCurNum(-1);
    curthat.setData({
        imgList:imgList
    })
}
//删除图片数组中的图片
function deleteFromImgList(index) {
    imgList.splice(index,1);
}
//动态修改当前上传的图片张数信息
function changeCurNum(length){
    curNum = length;
    changeShowCurNum();
}
function changeShowCurNum() {
    let openShowNum = curthat.data.openShowNum;
    let maxCount = curthat.data.maxCount;
    let uploadText = '';
    if(openShowNum){
        uploadText = curNum + '/'+maxCount;
    }
    curthat.setData({
        uploadText:uploadText
    })
}

//===================压缩算法S==============================
//获取图片信息
function choseImage() {
    if(imgList.length > 0){
        // for (let i = curNum; i < imgList.length; i++) {
        //     drawImage(imgList[i],i);
        // }
        drawImage(imgList[curNum],curNum,imgList.length);
    }else{
        console.log('当前图片暂存库中没有图片信息，无法制图');
    }
}
//画图压缩图片
function drawImage(imgObj,index,totalImageNum){
    if(index > totalImageNum){
        console.log('已经画图完成')
        return;
    }
    wx.showToast({
        title: '处理中...',
        icon:'loading'
    })
    let newImgObj = {};//保存压缩后的图片
    let size = imgObj.size;//当前图片的大小
    let path = imgObj.url;//当前图片的地址
    let cid = 'canvas'+curNum;
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
            console.log('图片初始压缩率',ratio);
            var canvasWidth = imgRes.width //图片原始长宽
            var canvasHeight = imgRes.height
            while (zip || canvasWidth > 2016 || canvasHeight > 2016){// 保证宽高在400以内
                canvasWidth = Math.trunc(imgRes.width / ratio)
                canvasHeight = Math.trunc(imgRes.height / ratio)
                ratio++;
                zip = false;
            }
            console.log('压缩率最终值',(ratio-1));
            let drawObj = drawList[index];//画布对象
            drawObj['width'] = canvasWidth;
            drawObj['height'] = canvasHeight;
            //画布对象更新宽高
            curthat.setData({
                drawList:drawList
            })
            console.log('画布'+index,canvasWidth,canvasHeight,imgObj);
            //---------对于本身就比较小的图片，无需进行压缩处理---------------
            if(canvasWidth == imgRes.width && canvasHeight == imgRes.height){
                console.log('图片已经很小，无需进行压缩处理',path);
                newImgObj['url'] = path;
                addFinalImgList(newImgObj);
                index+=1;
                if(index<totalImageNum){
                    drawImage(imgList[index],index,totalImageNum);
                }
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
                            console.log('大功告成,最终的图片信息',res);
                            newImgObj['url'] = res.tempFilePath;
                            // imgObj['thumb'] = res.tempFilePath;
                            console.log('压缩后结果：', newImgObj,size);
                            addFinalImgList(newImgObj);
                        },fail: function (res) {
                            console.log(res)
                            Toast.alert({message:'图片上传失败，请重试'});
                            deleteFromImgList(index);
                        },complete:res=>{
                            wx.hideLoading();
                            index+=1;
                            if(index<totalImageNum){
                                drawImage(imgList[index],index,totalImageNum);
                            }
                        }
                    })
                },1000));
            }

            //----------绘制图形并取出图片路径--------------
        },fail:imgRes=>{
            console.log('获取到的图片信息失败',imgRes);
            wx.hideLoading();
            deleteFromImgList(index);
        }
    })
}

function addFinalImgList(imgObj){
    finalImgList.push(imgObj);
    curthat.setData({
        finalImgList: finalImgList,
        curNum: changeCurNum(finalImgList.length)
    })
}

//===================压缩算法E==============================

//初始化方法,具体参数值，参考vant文件上传中的定义
function initImage(that,toast,initObj){
    // console.log('开始初始化', initObj);
    // let accept = "image";
    let sizeType = ['original','compressed'];
    let previewSize = "80px";
    let previewImage = true;
    let previewFullImage = true;
    let multiple = true;
    let disabled = false;
    let showUpload = true;
    let deletable = true;
    let capture = ['album', 'camera'];
    let maxSize = "52428800";//默认控制最大50M
    let maxCount = 3;//默认3张R
    let uploadText = '请上传图片';
    let imageFit = 'aspectFill';
    let uploadIcon = 'plus';
    let openShowNum = true;
    if(initObj != null){
        if (initObj.sizeType != undefined) {
            sizeType = initObj.sizeType;
        }
        if (initObj.sourceType != undefined) {
            capture = initObj.sourceType
        }
        if (initObj.previewSize != undefined) {
            previewSize = initObj.previewSize
        }
        if (initObj.previewImage != undefined) {
            previewImage = initObj.previewImage
        }
        if (initObj.previewFullImage != undefined) {
            previewFullImage = initObj.previewFullImage
        }
        if (initObj.multiple != undefined) {
            multiple = initObj.multiple
        }
        if (initObj.disabled != undefined) {
            disabled = initObj.disabled
        }
        if (initObj.showUpload != undefined) {
            showUpload = initObj.showUpload
        }
        if (initObj.previewSize != undefined) {
            deletable = initObj.deletable
        }
        if (initObj.maxSize != undefined) {
            maxSize = initObj.maxSize
        }
        if (initObj.maxCount != undefined) {
            maxCount = initObj.maxCount
        }
        if (initObj.uploadText != undefined) {
            uploadText = initObj.uploadText;
        }
        if (initObj.imageFit != undefined) {
            imageFit = initObj.imageFit
        }
        if (initObj.uploadIcon != undefined) {
            uploadIcon = initObj.uploadIcon
        }
        if (initObj.openShowNum != undefined) {
            openShowNum = initObj.openShowNum
        }
    }

    curthat = that;
    Toast = toast;
    that.setData({
        sizeType:sizeType,
        sourceType:capture,
        previewSize:previewSize,
        previewImage:previewImage,
        previewFullImage:previewFullImage,
        multiple:multiple,
        disabled:disabled,
        showUpload:showUpload,
        deletable:deletable,
        maxSize:maxSize,
        maxCount:maxCount,
        uploadText:uploadText,
        imageFit:imageFit,
        uploadIcon:uploadIcon,
        openShowNum:openShowNum,
        finalImgList:[],
    })
    changeCurNum(0);
    console.log('当前的数据信息',that.data);
}

function imgCenter(event){
    if(event != null){
        let type = event.type;
        switch (type){
            case 'delete' :deleteImage(event);break;
            case 'after-read':afterRead(event);break;
            case 'oversize':Toast.alert({message:'图片过大，上传受限'});break;

        }
    }

}

module.exports = {
    initImage:initImage,
    imgCenter:imgCenter,
}