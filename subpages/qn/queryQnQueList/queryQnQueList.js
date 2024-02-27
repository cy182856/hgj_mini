//queryQnQueList.js
var app = getApp();
const apiConstant = require('../../../const/api.js');
import Dialog from '../../../miniprogram_npm/@vant/weapp/dialog/dialog';

Page({
  data:{
		qnDate:"",
    qnSeqId:"",
    custId:"",
    huSeqId:"",
		qnQueListDtoList:[],
		optIdArray: [
          {id: '01', desc: 'A'},
          {id: '02', desc: 'B'},
          {id: '03', desc: 'C'},
          {id: '04', desc: 'D'},
          {id: '05', desc: 'E'},
          {id: '06', desc: 'F'},
          {id: '07', desc: 'G'},
          {id: '08', desc: 'H'},
          {id: '09', desc: 'I'},
          {id: '10', desc: 'J'},
        ],
    disabled:false,//选项是否禁止操作
    // submitRespCode:'',
    qnName:'',
    qnDesc:'',
    autosize:{maxHeight: 49, minHeight: 49},
    prev_index:-1,//上一个点击的问题（单选、多选、填空）索引
    prev_index2:-1,//上一个点击的问题的选项（或选项的填空）的索引

    signed: false,//是否已经签名
    signImage: '',
    qnRemark: '',
	},
	
  //生命周期函数--监听页面加载
  onLoad: function (options) {
	app.loading();
	this.showLoading(true);
    this.qnDate = options.qnDate;
    this.qnSeqId = options.qnSeqId;
    var loginInfo = app.storage.getLoginInfo();
    this.custId = loginInfo.custId;
    this.huSeqId = loginInfo.huSeqId;
    console.log('options.qnDate='+options.qnDate+'，options.qnSeqId='+options.qnSeqId
                +'，loginInfo.custId='+this.custId+'，loginInfo.huSeqId='+this.huSeqId);
    
    this.setData({
      qnDate:this.qnDate,
      qnSeqId:this.qnSeqId,
      custId:this.custId,
      huSeqId:this.huSeqId,
		});
		
		this.queryQnQueList();
  },
	
	queryQnQueList:function(e){
    console.log('开始查询问卷问题列表，URL='+apiConstant.QueryQnQueList);
    let qnDate_temp = this.data.qnDate;
    let qnSeqId_temp = this.data.qnSeqId;
    let huSeqId_temp = this.data.huSeqId;
    if (qnDate_temp == "" || qnSeqId_temp == "" || huSeqId_temp == "") {
        wx.showToast({
          title: "网络异常，获取关键信息失败",
          icon: "none"
        })
        return;
		}
    let filterCondition = {'qnDate':qnDate_temp, 'qnSeqId':qnSeqId_temp, 'huSeqId':huSeqId_temp};
    console.log(filterCondition);
    let that = this;
    app.req.postRequest(apiConstant.QueryQnQueList,filterCondition).then(resp=>{
      console.log(resp);
      this.showLoading(0);
      let resp_data = resp.data;
      if(resp_data.respCode != "000"){
        wx.showToast({
          icon:'none',
          title: resp_data.errDesc
        });
      } else {
        that.setData({
          qnQueListDtoList: resp_data.qnQueListDtoList,
          qnName: resp_data.qnName,
          qnDesc: resp_data.qnDesc,
          isNeedSign: resp_data.isNeedSign,
          qnRemark: resp_data.qnRemark,
        });
        let submitHuSeqId = resp_data.submitHuSeqId;
        let qnUniqueType = resp_data.qnUniqueType;
        console.log('submitHuSeqId = ' + submitHuSeqId+'，qnUniqueType = ' + qnUniqueType+'，that.data.huSeqId = '+huSeqId_temp)
        if (submitHuSeqId != null && submitHuSeqId != huSeqId_temp && qnUniqueType != null && qnUniqueType == 'H') {
          that.setData({
            disabled:true
          });
          wx.showModal({
            content: '该问卷一个住房中只能一人提交，点击确定查看已提交人的问卷答题详情？',
            showCancel: true,
            cancelText: '返回',
            success: function (res) {
              if (res.confirm) {
                console.log('用户点击确定')
                that.redirectToQueryQnQueAns(qnDate_temp, qnSeqId_temp, submitHuSeqId);
                return false;
              } else if (res.cancel) {
                console.log('用户点击取消')
                wx.navigateBack({
                  url: '/subpages/qn/queryQnInfo/queryQnInfo'
                })
                return false;
              }
            }
          });
        }
      }
    });
    // wx.request({
    //   url : apiConstant.QueryQnQueList,
    //   data : filterCondition,
    //   method : "POST",
    //   // header : {'content-type' : 'application/x-www-form-urlencoded'},
    //   header : {'content-type' : 'application/json'},
    //   dataType : "json",
    //   success : function(resp){
    //     console.log(resp);
    //     let resp_data = resp.data;
    //     if(resp_data.respCode != "000"){
    //       wx.showToast({
    //         icon:'none',
    //         title: resp_data.errDesc
    //       });
    //     } else {
    //       that.setData({
    //     	  qnQueListDtoList: resp_data.qnQueListDtoList,
    //         qnName: resp_data.qnName,
    //         qnDesc: resp_data.qnDesc,
    //         isNeedSign: resp_data.isNeedSign,
    //         qnRemark: resp_data.qnRemark,
    //       });
    //       let submitHuSeqId = resp_data.submitHuSeqId;
    //       let qnUniqueType = resp_data.qnUniqueType;
    //       console.log('submitHuSeqId = ' + submitHuSeqId+'，qnUniqueType = ' + qnUniqueType+'，that.data.huSeqId = '+huSeqId_temp)
    //       if (submitHuSeqId != null && submitHuSeqId != huSeqId_temp && qnUniqueType != null && qnUniqueType == 'H') {
    //         that.setData({
    //           disabled:true
    //         });
    //         wx.showModal({
    //           content: '该问卷一个住房中只能一人提交，点击确定查看已提交人的问卷答题详情？',
    //           showCancel: true,
    //           cancelText: '返回',
    //           success: function (res) {
    //             if (res.confirm) {
    //               console.log('用户点击确定')
    //               that.redirectToQueryQnQueAns(qnDate_temp, qnSeqId_temp, submitHuSeqId);
    //               return false;
    //             } else if (res.cancel) {
    //               console.log('用户点击取消')
    //               wx.navigateBack({
    //                 url: '/subpages/qn/queryQnInfo/queryQnInfo'
    //               })
    //               return false;
    //             }
    //           }
    //         });
    //       }
    //     }
    //   },
    //   fail:function(resp){
    //     console.log(resp);
    //     var cur_title;
    //     if (resp.errMsg != null || resp.errMsg != "") {
    //     	cur_title = resp.errMsg;
    //     } else {
    //       	cur_title = resp.data.errDesc;
    //     }
    //     wx.showToast({
    //       title: cur_title,
    //       icon: "none"
    //     })
    //   },
    //   complete:function(){
		//     that.showLoading(false);
    //   }
    // });
	},
  
  redirectToQueryQnQueAns:function(qnDate, qnSeqId, huSeqId){
    console.log("onTapWatchDetail2-qnDate:" + qnDate + "，qnSeqId=" + qnSeqId + "，isQueryAns=Y" + "，huSeqId=" + huSeqId);
    wx.redirectTo({
      url: '/subpages/qn/queryQnQueAns/queryQnQueAns?isQueryAns=Y&qnDate='+qnDate+'&qnSeqId='+qnSeqId+'&huSeqId='+huSeqId,
    });
  },

  onChangeS(event) {
		// console.log(event);
    var index = event.currentTarget.dataset.index;
    console.log(index);
    console.log(event.detail);
    let qnQueLists = this.data.qnQueListDtoList;
    console.log(qnQueLists[index].queAnsOptIds);
    qnQueLists[index].queAnsOptIds[0] = event.detail;
    console.log(qnQueLists[index].queAnsOptIds);
    this.setData({
      qnQueListDtoList: qnQueLists
    });
  },

  onChangeS2(event) {
		// console.log(event);
    let index = event.currentTarget.dataset.index;
    let index2 = event.currentTarget.dataset.index2;
    let optId = event.currentTarget.dataset.optid;
    console.log(index, index2, optId);
    let qnQueLists = this.data.qnQueListDtoList;
    let queAnsOptIds_old = qnQueLists[index].queAnsOptIds;
    console.log(queAnsOptIds_old);
    let qnQueOptDtoList_old = qnQueLists[index].qnQueOptDtoList;
    console.log(qnQueOptDtoList_old[index2].queAnsOptAns);
    if (queAnsOptIds_old.length == 0) {
      qnQueLists[index].queAnsOptIds[0] = optId;
    } else {
      if (queAnsOptIds_old[0] != optId) {
        let optId_old = queAnsOptIds_old[0];
        console.log(optId_old);
        let index2_old = (qnQueOptDtoList_old || []).findIndex((item) => item.optId === optId_old);
        console.log(index2_old);
        if (qnQueOptDtoList_old[index2_old].choseFill == 'Y') {
          qnQueLists[index].qnQueOptDtoList[index2_old].queAnsOptAns = '';
          qnQueLists[index].qnQueOptDtoList[index2_old].focus = false;
        }
        qnQueLists[index].queAnsOptIds[0] = optId;
      }
    }
    //上一个点击的选项（不一定是本题）若有填空，则失去焦点。
    let prev_index = this.data.prev_index;
    let prev_index2 = this.data.prev_index2;
    console.log(prev_index, prev_index2)
    if (prev_index >= 0) {
      if (prev_index2 >= 0) {//单选题或多选题
        let prev_choseFill = qnQueLists[prev_index].qnQueOptDtoList[prev_index2].choseFill;
        console.log(prev_choseFill)
        if (prev_choseFill == 'Y' && (prev_index != index || (prev_index == index && prev_index2 != index2))) {
          console.log('S or M focus set false')
          qnQueLists[prev_index].qnQueOptDtoList[prev_index2].focus = false;
        }
      } else {//填空题
        console.log('F focus set false')
        qnQueLists[prev_index].focus = false;
      }
    }
    //当前点击的选项若有填空，则获取焦点。
    if (qnQueOptDtoList_old[index2].choseFill == 'Y') {
      qnQueLists[index].qnQueOptDtoList[index2].isShow = 'Y';
      qnQueLists[index].qnQueOptDtoList[index2].focus = true;
    }
    this.setData({
      qnQueListDtoList: qnQueLists,
      prev_index:index,
      prev_index2:index2,
    });
  },

  onChangeMn(event) {
    // console.log(event);
    var index = event.currentTarget.dataset.index;
    console.log(index);
    console.log(event.detail);
    let qnQueLists = this.data.qnQueListDtoList;
    console.log(qnQueLists[index].queAnsOptIds);
    qnQueLists[index].queAnsOptIds = event.detail;
    console.log(qnQueLists[index].queAnsOptIds);
    this.setData({
      qnQueListDtoList: qnQueLists
    });
  },

  onChangeMn2(event) {
    console.log(event);
    let index = event.currentTarget.dataset.index;
    let index2 = event.currentTarget.dataset.index2;
    let optId = event.currentTarget.dataset.optid;
    console.log(index, index2, optId);
    let qnQueLists = this.data.qnQueListDtoList;
    let queAnsOptIds_old = qnQueLists[index].queAnsOptIds;
    console.log(queAnsOptIds_old);
    let qnQueOptDtoList_old = qnQueLists[index].qnQueOptDtoList;
    if (queAnsOptIds_old.length == 0) {
      qnQueLists[index].queAnsOptIds.push(optId);
      if (qnQueOptDtoList_old[index2].choseFill == 'Y') {
        qnQueLists[index].qnQueOptDtoList[index2].isShow = 'Y';
        qnQueLists[index].qnQueOptDtoList[index2].focus = true;
      }
    } else {
      let index2_exist = (queAnsOptIds_old || []).findIndex((item) => item === optId);
      console.log(index2_exist);
      if (index2_exist == -1) {//不存在
        let maxOptCnt = qnQueLists[index].maxOptCnt;
        console.log(maxOptCnt);
        if (maxOptCnt == 0 || (maxOptCnt > 0 && maxOptCnt > queAnsOptIds_old.length)) {
          qnQueLists[index].queAnsOptIds.push(optId);
          if (qnQueOptDtoList_old[index2].choseFill == 'Y') {
            qnQueLists[index].qnQueOptDtoList[index2].isShow = 'Y';
            qnQueLists[index].qnQueOptDtoList[index2].focus = true;
          }
        }
      } else {
        qnQueLists[index].queAnsOptIds.splice(index2_exist, 1);//删除数组中该下标的这一个元素。
        if (qnQueOptDtoList_old[index2].choseFill == 'Y') {
          qnQueLists[index].qnQueOptDtoList[index2].queAnsOptAns = '';
          qnQueLists[index].qnQueOptDtoList[index2].focus = false;
        }
      }
    }
    //上一个点击的选项（不一定是本题）若有填空，则失去焦点。
    let prev_index = this.data.prev_index;
    let prev_index2 = this.data.prev_index2;
    console.log(prev_index, prev_index2)
    if (prev_index >= 0) {
      if (prev_index2 >= 0) {//单选题或多选题
        let prev_choseFill = qnQueLists[prev_index].qnQueOptDtoList[prev_index2].choseFill;
        console.log(prev_choseFill)
        if (prev_choseFill == 'Y' && (prev_index != index || (prev_index == index && prev_index2 != index2))) {
          console.log('S or M focus set false')
          qnQueLists[prev_index].qnQueOptDtoList[prev_index2].focus = false;
        }
      } else {//填空题
        console.log('F focus set false')
        qnQueLists[prev_index].focus = false;
      }
    }
    this.setData({
      qnQueListDtoList: qnQueLists,
      prev_index:index,
      prev_index2:index2,
    });
  },

  onChangeF(event) {
	  // console.log(event);
    var index = event.currentTarget.dataset.index;
    console.log(index);
    console.log(event.detail);
    let qnQueLists = this.data.qnQueListDtoList;
    console.log(qnQueLists[index].queAnsOptIds);
    if (event.detail == '') {
      qnQueLists[index].queAnsOptIds = [];
    } else {
      qnQueLists[index].queAnsOptIds[0] = event.detail;
    }
    console.log(qnQueLists[index].queAnsOptIds);
    this.setData({
      qnQueListDtoList: qnQueLists
    });
  },

  onClickF(event) {
	  // console.log(event);
    var index = event.currentTarget.dataset.index;
    console.log(index, event.detail);
    let qnQueLists = this.data.qnQueListDtoList;
    //上一个点击的选项（不一定是本题）若有填空，则失去焦点。
    let prev_index = this.data.prev_index;
    let prev_index2 = this.data.prev_index2;
    console.log(prev_index, prev_index2)
    if (prev_index >= 0) {
      if (prev_index2 >= 0) {//单选题或多选题
        let prev_choseFill = qnQueLists[prev_index].qnQueOptDtoList[prev_index2].choseFill;
        console.log(prev_choseFill)
        if (prev_choseFill == 'Y' && (prev_index != index || (prev_index == index && prev_index2 != index2))) {
          console.log('S or M focus set false')
          qnQueLists[prev_index].qnQueOptDtoList[prev_index2].focus = false;
        }
      } else {//填空题
        console.log('F focus set false')
        qnQueLists[prev_index].focus = false;
      }
    }
    //当前填空题获取焦点
    qnQueLists[index].focus = true;
    this.setData({
      qnQueListDtoList: qnQueLists,
      prev_index:index,
      prev_index2:-1,
    });
  },
  
  onChangeOptChoseFillY(event) {
	  // console.log(event);
    let index = event.currentTarget.dataset.index;
    let index2 = event.currentTarget.dataset.index2;
    let event_detail = event.detail;
    console.log(index, index2, event_detail);
    let qnQueLists = this.data.qnQueListDtoList;
    //上一个点击的选项（不一定是本题）若有填空，则失去焦点。
    let prev_index = this.data.prev_index;
    let prev_index2 = this.data.prev_index2;
    console.log(prev_index, prev_index2)
    if (prev_index >= 0) {
      if (prev_index2 >= 0) {//单选题或多选题
        let prev_choseFill = qnQueLists[prev_index].qnQueOptDtoList[prev_index2].choseFill;
        console.log(prev_choseFill)
        if (prev_choseFill == 'Y' && (prev_index != index || (prev_index == index && prev_index2 != index2))) {
          console.log('S or M focus set false')
          qnQueLists[prev_index].qnQueOptDtoList[prev_index2].focus = false;
        }
      } else {//填空题
        console.log('F focus set false')
        qnQueLists[prev_index].focus = false;
      }
    }

    let qnQueListDto = qnQueLists[index];
    let queAnsOptIds = qnQueListDto.queAnsOptIds;
    console.log(queAnsOptIds);
    let queAnsOptIds_length = queAnsOptIds.length;
    let optId = qnQueListDto.qnQueOptDtoList[index2].optId;
    console.log(optId);
    let i = (queAnsOptIds || []).findIndex((item) => item === optId);
    console.log("indexOfOptId ===> "+i);
    //校验
    let queType = qnQueListDto.queType;
    let maxOptCnt = qnQueListDto.maxOptCnt;
    if (queType == 'S') {
      maxOptCnt = 1;
      if (maxOptCnt <= queAnsOptIds_length && queAnsOptIds[0] != optId) {
        qnQueLists[index].qnQueOptDtoList[index2].queAnsOptAns = '';
        qnQueLists[index].qnQueOptDtoList[index2].focus = false;
        this.setData({
          qnQueListDtoList: qnQueLists,
          prev_index:index,
          prev_index2:index2,
        });
        if (event_detail != '') {
          wx.showToast({
            title: "单选题最多选1个",
            icon: "none"
          });
        }
        return;
      }
    } else if (queType == 'M') {
      if (maxOptCnt > 0) {
        if (maxOptCnt <= queAnsOptIds_length && i == -1) {
          qnQueLists[index].qnQueOptDtoList[index2].queAnsOptAns = '';
          qnQueLists[index].qnQueOptDtoList[index2].focus = false;
          this.setData({
            qnQueListDtoList: qnQueLists,
            prev_index:index,
            prev_index2:index2,
          });
          if (event_detail != '') {
            wx.showToast({
              title: "该多选题最多选"+maxOptCnt+"个",
              icon: "none"
            });
          }
          return;
        }
      }
    }
    //重新赋值
    qnQueLists[index].qnQueOptDtoList[index2].queAnsOptAns = event_detail;
    qnQueLists[index].qnQueOptDtoList[index2].focus = true;
    if (event_detail != null && event_detail != "") {
      if (queAnsOptIds_length == 0) {
        console.log("event.detail !='' && queAnsOptIds.length == 0");
        qnQueLists[index].queAnsOptIds.push(optId);
      } else {
        console.log("event.detail !='' && queAnsOptIds.length > 0");
        if (i == -1) {
          qnQueLists[index].queAnsOptIds.push(optId);
        }
      }
    }
    console.log(qnQueLists[index]);
    this.setData({
      qnQueListDtoList: qnQueLists,
      prev_index:index,
      prev_index2:index2,
    });
  },

  onSubmit(event) {
    this.setData({
      disabled:true
    });

    let qnQueLists = this.data.qnQueListDtoList;
    if (!checkSubmit(qnQueLists)) {
      console.log("checkSubmit(qnQueLists) return false");
      return false;
    }
    if (this.data.qnDate == "" || this.data.qnSeqId == "" 
        || qnQueLists== "" || qnQueLists.length == 0
        || this.data.custId== "" || this.data.huSeqId== "") {
        wx.showToast({
          title: "网络异常，获取关键信息失败",
          icon: "none"
        })
        return;
    }
    
    Dialog.confirm({
      message: '确认提交问卷？',
      confirmButtonColor: '#189AFE',
    })
    .then(() => {
      // on confirm
      this.doSubmitAddQnHuAns();
    })
    .catch(() => {
      // on cancel
      console.log('用户取消了提交');
      this.setData({
        disabled:false
      });
    });
    
  },

  doSubmitAddQnHuAns:function(){
    let isNeedSign = this.data.isNeedSign;
    if(isNeedSign == 'Y' && !this.data.signed){
      wx.showToast({
        title: '请签名后提交问卷',
        icon: "none"
      })
      this.setData({
        disabled:false
      });
      return false;
    }

    let signStat = this.data.signed?'S':'N';
    let filterCondition = {'qnDate':this.data.qnDate, 'qnSeqId':this.data.qnSeqId, 'qnQueListDtoList':this.data.qnQueListDtoList, 
                            'custId':this.data.custId, 'huSeqId':this.data.huSeqId, 'signStat': signStat};
    console.log(filterCondition);
    console.log('开始提交问卷答案，URL='+apiConstant.AddQnHuAns);
    let that = this;
    that.showLoading(true);
    app.req.postRequest(apiConstant.AddQnHuAns,filterCondition).then(resp => {
      let resp_data = resp.data;
      console.log(resp);
      that.showLoading(false);
      if(resp_data.respCode != "000"){
        that.setData({
          disabled:false
        });
        //错误提示信息
        wx.showToast({
          title: resp_data.errDesc,
          icon: "none"
        })
      } else {
        // that.setData({
        //   qnQueListDtoList: resp_data.qnQueListDtoList,
        //   submitRespCode: resp_data.submitRespCode,
        // });
        Dialog.alert({
          message: '问卷已提交，感谢您的反馈！',
        })
        .then(() => {
          // on close
          wx.navigateBack({
            url: '/subpages/qn/queryQnInfo/queryQnInfo'
          })
        });
      }
    });
    // wx.request({
    //   url : apiConstant.AddQnHuAns,
    //   data : JSON.stringify(filterCondition),
    //   method : "POST",
    //   header : {'content-type' : 'application/json'},
    //   dataType : "json",
    //   success : function(resp){
    //     let resp_data = resp.data;
    //     console.log(resp);
    //     if(resp_data.respCode != "000"){
    //       that.setData({
    //         disabled:false
    //       });
    //       //错误提示信息
    //       wx.showToast({
    //         title: resp_data.errDesc,
    //         icon: "none"
    //       })
    //     } else {
    //       // that.setData({
    //     	//   qnQueListDtoList: resp_data.qnQueListDtoList,
    //       //   submitRespCode: resp_data.submitRespCode,
    //       // });
    //       Dialog.alert({
    //         message: '问卷已提交，感谢您的反馈！',
    //       })
    //       .then(() => {
    //         // on close
    //         wx.navigateBack({
    //           url: '/subpages/qn/queryQnInfo/queryQnInfo'
    //         })
    //       });
    //     }
    //   },
    //   fail:function(resp){
    //     console.log(resp);
    //     that.setData({
    //       disabled:false
    //     });
    //     var cur_title;
    //     if (resp.errMsg != null || resp.errMsg != "") {
    //     	cur_title = resp.errMsg;
    //     } else {
    //       cur_title = resp.data.errDesc;
    //     }
    //     //错误提示信息
    //     wx.showToast({
    //       title: cur_title,
    //       icon: "none"
    //     })
    //   },
    //   complete:function(){
		//     that.showLoading(false);
    //   }
    // });
  },

  onUnload: function (options) {
    let pages = getCurrentPages(); 
    let prePage = pages[pages.length - 2]; 
    console.log(prePage);
    prePage.onLoad();
  },


  goSign: function(e){
    let qnDate = this.data.qnDate;
    let qnSeqId = this.data.qnSeqId;
    let sign_page = "/subpages/qn/signboard/signboard?qnDate="+qnDate+'&qnSeqId='+qnSeqId;
    wx.navigateTo({
      url: sign_page,
    })
  },

});

function checkSubmit(qnQueLists){
  return true;
}