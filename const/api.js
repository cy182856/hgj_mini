
//const ApiRootUrl = 'https://jia-tech.huiguan.com/jiasv/';//tech

//const ApiRootUrl = 'https://zhgj.shofw.com/wx/';//tech
//const ApiRootUrl = 'http://192.168.79.5:85/wx/';
const ApiRootUrl = 'http://192.168.23.108:85/wx/';//tech
//const ApiRootUrl = 'http://zhgjtest.shofw.com:85/wx/';
//const ApiRootUrl = 'https://zhgj.xhguanjia.cn/wx/';

// const ApiRootUrl = 'https://jia.huiguan.com/jiasv/';//prod
// const ApiRootUrl = 'http://dev.huiguan.com:60103/jiasv/';//local
module.exports = {
  /********************主页*************************/
  LOGIN:ApiRootUrl+'doLogin',//登录
  // TEST:ApiRootUrl+'test.do',
 
  huAuth : ApiRootUrl + "/hu/auth.do" ,//查询用户权限位图

  queryMutipUsr : ApiRootUrl + 'queryMutipUsr', //查询多账户
  queryManyCust : ApiRootUrl + 'queryManyCust', //查询公众号下的多账户信息
  queryGongGao : ApiRootUrl + 'gonggao/query.do',//公告查询-首页
  queryCurrNoticeNew : ApiRootUrl + 'notice/queryAllNotice.do',//公告
  queryPersonData : ApiRootUrl + 'queryPersonData', //查询个人资料
  updatePersonData: ApiRootUrl + 'updatePersonData',// 修改个人资料

   /**********************广告***************** */
   queryAdverts:ApiRootUrl + 'queryAdverts.do',//查询广告信息

   /**********************住户码***************** */
   addResQrCode : ApiRootUrl + "resQrCode/addResQrCode.do", //生成住户码


  /********************智能开门*************************/
  querySmartCodeInfo : ApiRootUrl + "/hu/querySmartCodeInfo.do" ,//查询条形码及二维码信息

  /********************报事报修*************************/
  repairApply:ApiRootUrl + 'repair.do',//报修申请
  repairQuery:ApiRootUrl + 'queryRepairLog.do',//报修查询
  repairCostDetailQuery:ApiRootUrl + 'queryRepairCostDetail.do',//报修费用明细查询
  repairDetailPage: ApiRootUrl + 'queryRepairMsg.do'//留言明细
  ,repairAward:ApiRootUrl + 'evaluateRepairOrder.do' //评价奖励
  ,cancelRepair: ApiRootUrl + 'cancelRepair.do'//取消报修
  ,updTime: ApiRootUrl + 'updTime.do' //修改预期到场时间
  ,sureTime: ApiRootUrl + 'sureTime.do' //确认预期到场时间
  ,evaluateRepairOrder: ApiRootUrl + 'evaluateRepairOrder.do'//立即评价
  ,queryDetail: ApiRootUrl + 'queryDetail.do' //报修处理中数据，最新一条
  ,surePay:ApiRootUrl + 'surePay.do'//确认维修完成
  ,sendMsg:ApiRootUrl + 'sendMsg.do'//消息推送（小程序的消息推送）
  ,anonymousRepair:ApiRootUrl + 'anonymousRepair' //匿名报修
  ,annonyQuery:ApiRootUrl+'queryRepairLog' //匿名保修查询/详情查询
  ,annonyEvaluateRepairOrder:ApiRootUrl+'evaluateRepairOrder' //匿名报修评价
  ,annonyCancelRepair: ApiRootUrl + 'cancelRepair'//匿名取消报修
  ,annonyQueryRepairMsg: ApiRootUrl + 'queryRepairMsg'//匿名留言明细
  ,queryPropObj:ApiRootUrl + 'queryPropObj' //查询标地
  ,repairCommonList:ApiRootUrl + 'repairCommonList' //查询报修快捷描述语
  ,updRepairCommon:ApiRootUrl + 'updRepairCommon' //快捷描述语使用频次
  ,repairAddMsgBody:ApiRootUrl + 'repair/addRepairMsg.do' //报修留言
  ,repairHouseList:ApiRootUrl + 'repairHouseList' //查询客户房屋列表

  /**********************房屋相关***************** */
  ,houseListByCstCode:ApiRootUrl + 'hu/houseListByCstCode' //根据客户编号查询房屋
  ,huOperate:ApiRootUrl + 'hu/operate'//房主对租户操作同意、驳回、移除
  ,huList:ApiRootUrl + 'hu/list' //我的房屋查询
  ,createIntoInfo:ApiRootUrl + 'hu/createIntoInfo' //创建入住信息
  ,queryIntoInfo:ApiRootUrl + 'hu/queryIntoInfo' //查询入住信息
  

  /**********************查询管家信息***************** */
  ,queryHouseKeepInfo:ApiRootUrl + 'houseKeepInfo.do'//查询管家信息


  /**********************我的账单********************* */
  ,queryPriRev:ApiRootUrl + 'queryPriRev.do'//查询客户欠费总金额
  ,queryBill:ApiRootUrl + 'queryBill.do'//账单查询
  ,queryBillMerge:ApiRootUrl + 'queryBillMerge.do'//合并账单查询
  ,placeOrder:ApiRootUrl + 'placeOrder.do'//下单
  ,mergeBill:ApiRootUrl + 'mergeBill.do'//合并账单
  ,cancelBill:ApiRootUrl + 'cancelBill.do'//取消订单
  ,queryBillDetail:ApiRootUrl + 'queryBillDetail.do'//查询订单详细
  ,queryBillMonthDetail:ApiRootUrl + 'queryBillMonthDetail.do'//查询月账单详细

  ,paymentCompleted:ApiRootUrl + 'paymentCompleted.do'//支付完成，修改支付状态为支付中

  /********************入住邀请*************************/
  ,identityList:ApiRootUrl + 'identity/list' //获取身份

  /********************问卷调查*************************/
  ,QueryQnQueList: ApiRootUrl + 'queryQnQueList.do',//查询问卷问题（及答案）列表
  QueryQnInfos: ApiRootUrl + 'queryQnInfos.do',//查询问卷记录列表
  AddQnHuAns: ApiRootUrl + 'addQnHuAns.do',//新增问卷答案
  queryExpQnInfos: ApiRootUrl + 'queryExpQnInfos.do',//查询已结束问卷记录列表
  queryOngoingQnInfos: ApiRootUrl + 'queryOngoingQnInfos.do',//查询进行中的问卷记录列表
  queryQnHouseSubmits: ApiRootUrl + 'queryQnHouseSubmits.do',//查询是否有其他人已提交问卷（问卷唯一类型为按房唯一时，若已有人提交，则不可进入问卷答题页面）

  queryQnGatewayUrl: ApiRootUrl + 'queryQnGatewayUrl.do', //查询金数据门户地址
  queryQns: ApiRootUrl + "qn/query.do", //问卷列表

  /********************预约****************************/
  queryApptObjInfo: ApiRootUrl +'appt/queryApptObjInfo.do',//预约标的查询
  queryApptTimeDtl: ApiRootUrl +'appt/queryApptTimeDtl.do',
  addApptOrdLog: ApiRootUrl +'appt/addApptOrdLog.do',
  queryApptOrdLog: ApiRootUrl +'appt/queryApptOrdLog.do',
  updApptOrdLog: ApiRootUrl + 'appt/updApptOrdLog.do',
  preApptOrdProcess: ApiRootUrl +'appt/prePayValid.do',

  /********************公告****************************/
  queryTypes: ApiRootUrl +'gonggao/queryType.do',
  queryTypeGonggaos: ApiRootUrl +'gonggao/queryTypeGonggao.do',
  queryGonggaoContent: ApiRootUrl +'gonggao/queryGonggaoContent.do',

  /********************邻里圈*************************/
  queryHeoTypeList: ApiRootUrl + "/heo/queryHeoTypeList.do", //查询邻里圈类型列表
  addHeoInfo:ApiRootUrl +"/heo/addHeoInfo.do", //新增邻里圈信息
  addHeoDtl:ApiRootUrl + "/heo/addHeoDtl.do", //新增邻里圈明细信息
  queryHeoInfos:ApiRootUrl +"/heo/queryHeoInfos.do", //查询邻里圈信息
  queryHeoDtlInfo: ApiRootUrl + "/heo/queryHeoDtls.do", //查询邻里圈评论信息
  updHeoInfo: ApiRootUrl + "/heo/updHeoInfo.do", //更新邻里圈信息
  updHeoDtlInfo : ApiRootUrl + "/heo/updHeoDtl.do",//更新邻里圈明细信息
  doHeoPraise: ApiRootUrl + "/heo/heoPraise.do"
  ,queryHeoPraiseList: ApiRootUrl + "/heo/queryHeoPraiseList.do",
  /********************便民服务*************************/


  /********************消息****************************/


  /********************我的发布*************************/


  /********************房屋管理*************************/
  // houseBind: ApiRootUrl + "hu/houseBind/owner", // 房主绑定
  houseBind: ApiRootUrl + "hu/houseBind", // 客户入住
  houseBindTenant: ApiRootUrl + "hu/houseBind/tenant", // 租户绑定
  queryHouseInfo: ApiRootUrl + "hu/getHouseInfo", // 获取房屋信息(区域、楼号、室号)
  queryAreaInfo: ApiRootUrl + 'hu/getAreaInfo',//查询区域信息
  getBuildingInfo: ApiRootUrl + '/hu/getBuildingInfo',//查询楼号信息
  queryHouseNoList: ApiRootUrl + '/hu/getHouseNoList', // 模糊查询室号集合
  getHouseInfo: ApiRootUrl + 'prop/getHouseInfo.do',//查询房号信息
  getHouseUsrInfo: ApiRootUrl + 'hu/getHouseUsrInfo.do',
  getHouseUsrInfoQrcode: ApiRootUrl + 'hu/getHouseUsrInfoQrcode.do',//生成绑定二维码
  updateHouseUsrInfo: ApiRootUrl + 'hu/updateHouseUsrInfo.do',//更新住户信息  昵称 权限 状态
  cancelHouseUsrInfo: ApiRootUrl + 'hu/cancelHouseUsrInfo.do',//注销账号
  getConvenientInfo: ApiRootUrl + 'prop/getPropPubRes.do',//便民信息
  transferHouseUsrInfo: ApiRootUrl + 'hu/transferHouseUsrInfo.do',//户主转让

  /********************物业缴费*************************/
  queryPfeeMonBill : ApiRootUrl + 'pfee/queryPfeeMonBill.do',//查询物业费缴费订单列表
  queryPfeeOrdLog : ApiRootUrl + 'pfee/queryPfeeOrdLog.do',//查询物业费缴费订单列表
  submitPfee : ApiRootUrl + 'pfee/submitPfee.do',//查询物业费缴费订单列表
  queryPfeeOrdDtl : ApiRootUrl + 'pfee/queryPfeeOrdDtl.do',//查询物业费缴费订单明细
  closePfeeOrdLog : ApiRootUrl + 'pfee/closePfeeOrdLog.do',//关闭物业费缴费订单明细
  closeInitPayPfeeOrdLog : ApiRootUrl + 'pfee/closeInitPayPfeeOrdLog.do',//关闭物业费缴费订单明细
  queryRanking : ApiRootUrl + 'queryRanking.do',//查询共建家园排名
  queryPfeeInfo : ApiRootUrl + 'pfeeBill/queryPfeeInfo.do',//查询物业费缴费信息(新)
  queryPfeeMonBillNew : ApiRootUrl + 'pfeeBill/queryPfeeMonBill.do',//查询物业费缴费订单列表(新)
  queryPfeeMonBillGBYear : ApiRootUrl + 'pfeeBill/queryPfeeMonBillGBYear.do',//查询物业费缴费订单列表


  /********************公共功能—文件上传,查阅*************************/
  // uploadImages : ApiRootUrl + "upload/image", //上传图片
  uploadImages : ApiRootUrl + "uploadFile",
  //图片文件查看：fileName：文件名，packName：文件路径名，customize：自定义的默认路径名，自定义需要后台开发
  // queryImageUrl:ApiRootUrl + 'image/query?fileName=FILENAME&packName=PACKNAME&customize=OTHER',
  queryImageUrl:ApiRootUrl + 'queryImgUrl?fileName=FILENAME&packName=PACKNAME&customize=OTHER',
  
  /**小程序支付下单接口 */
  minProgramPayUrl: ApiRootUrl +'pay/miniProgramPay.do',
  minProgramRefundUrl: ApiRootUrl +'/refund/refund.do',
  orderQueryUrl: ApiRootUrl + "pay/orderQuery.do",
  orderQueryDetailUrl:ApiRootUrl + "pay/orderDetailQuery.do",
  /********************访客管理*************************/
  addVisitQrCode : ApiRootUrl + "visitinfo/addVisitQrCode.do", //新增访客通行证-生成二维码
  addVisitRandomNum : ApiRootUrl + "visitinfo/addVisitRandomNum.do", //新增访客通行证-生成6位随机数
  queryVisitExplain:ApiRootUrl + 'visitinfo/queryVisitExplain.do', //查询访客通行码说明文字

 /********************扫码开门*************************/
  addOpenDoorQrCode : ApiRootUrl + "opendoor/addOpenDoorQrCode.do", //扫码开门-生成二维码
  queryOpenDoorLog: ApiRootUrl + "opendoor/queryOpenDoorLog.do", //查询访客通行码开门记录
  queryOpenDoorQuickCodeLog: ApiRootUrl + "opendoor/queryOpenDoorQuickCodeLog.do", //查询快速通行码记录

  queryOpenDoorLogByCardNo: ApiRootUrl + "opendoor/queryOpenDoorLogByCardNo.do", //根据卡号查询开门记录
  createQuickCode : ApiRootUrl + "opendoor/createQuickCode.do", //创建快速通行码
  queryWeekDate:ApiRootUrl + 'opendoor/queryWeekDate.do', //获取当前及一周后日期
  queryOpenDoorExplain:ApiRootUrl + 'opendoor/queryVisitExplain.do', //查询访客通行码说明文字
  queryQuickCodeInterTime:ApiRootUrl + 'opendoor/queryQuickCodeInterTime.do', //获取创建快速码的间隔时间


/********************健身中心*************************/
  addCouponQrCode : ApiRootUrl + "active/addCouponQrCode.do", //生成开门二维码
  openLogQuery: ApiRootUrl + "active/openLog/query.do", //开门记录查询
  couponQuery: ApiRootUrl + "active/coupon/query.do", //券查询

  queryCardSwim: ApiRootUrl + "card/queryCardSwim", //查询游泳卡信息
  createCardQrCode : ApiRootUrl + "card/createCardQrCode", //生成游泳卡开门二维码
  cardPerm:ApiRootUrl + 'card/cardPerm', //卡权限设置


  checkVisitLogDetail : ApiRootUrl + "/visitinfo/showVisitInfoDetail.do" //查看单个访客通行证信息
  ,queryVisitLogs: ApiRootUrl + "visitinfo/queryVisitInfos.do" //查询访客记录
  ,updateVisitLog: ApiRootUrl + "/visitinfo/updVisitLog.do" //更新访客通行码

  /********************停车缴费*************************/
  ,queryCarNum: ApiRootUrl + "carpay/queryCarNum" //查询车牌号
  ,carPayment:ApiRootUrl + 'carpay/carPayment.do'// 缴费
  ,parkPayOrderStatusUpdate:ApiRootUrl + 'parkPayOrderStatusUpdate.do'//支付完成，修改支付状态为支付中
  ,queryCardExpNum: ApiRootUrl + "carpay/queryCardExpNum" //查询停车卡时长

  /********************车辆续费*************************/
  ,queryCarInfoByCarNum: ApiRootUrl + "carrenew/queryCarInfoByCarNum" //车牌号查询月租车信息
  ,carRenew:ApiRootUrl + 'carrenew/carRenew.do'// 缴费
  ,carRenewOrderStatusUpdate:ApiRootUrl + 'carRenewOrderStatusUpdate.do'//支付完成，修改支付状态为支付中


  /********************问题反馈*************************/
  ,addAdvice: ApiRootUrl + 'advice/addAddvice' //新增投诉建议
  ,queryAdviceLog:ApiRootUrl + 'advice/queryAdviceLog' //查询投诉建议列表
  ,queryAdviceDetail: ApiRootUrl + 'advice/queryAdviceDetail' //查询投诉建议详情
  ,cancelAdvice:ApiRootUrl+'advice/cancelAdvice' //取消投诉建议
  ,finishAdvice:ApiRootUrl+'advice/finishAdvice' //确认反馈完成
  ,evaluateAdvice:ApiRootUrl+'advice/evaluateAdvice' //反馈评价
  ,addMsgBody:ApiRootUrl + 'advice/addMsgBody' //反馈留言

  ,feedback:ApiRootUrl + 'feedback.do' //问题反馈
  ,feedbackQuery:ApiRootUrl + 'feedbackQuery.do'//反馈查询


  /********************匿名登录*************************/
  ,noName:ApiRootUrl+'noName/noNameMain' //匿名登录
  ,isBind:ApiRootUrl +'noName/isBind' //判断用户是否已经认证绑定
  ,getWechatUrl:ApiRootUrl+'getWechatUrl' //获取微信网页授权URL

  /********************供应商*************************/
  ,queryShopItemInfo:ApiRootUrl+'shop/queryShopItemInfo.do'//店铺下商品信息查询
  ,updItemInfo:ApiRootUrl+'item/updItemInfo.do'//商品信息修改
  ,queryItemInfo:ApiRootUrl+'item/queryItemInfo.do'//商品信息查询
  ,queryPropSupLifeUrl:ApiRootUrl+'life/lifeShow.do' // 生活服务首页数据查询
  ,lifeItemShowUrl:ApiRootUrl+'life/lifeItemShow.do'// 根据类目查询商品列表

  /********************菜单地址*************************/
  , queryMenuList: ApiRootUrl + 'menu/queryMenuList.do' //查询菜单列表

  /******************** 文件公示 ***********************/
  ,queryFmFileList : ApiRootUrl + 'fmfile/queryFmFileList.do'


  /******************** 车辆缴费 ***********************/
  ,cfeePay : ApiRootUrl +  '/pay/cfee.do'
  ,queryCarInfos : ApiRootUrl + '/car/queryCarInfos.do'
  ,queryCarFeeLogs : ApiRootUrl + "/car/queryCarFeeLogs.do"
  
  /******************** 充电桩 ***********************/
  ,queryChargeList : ApiRootUrl + '/charge/queryChargeList.do'//充电桩列表查询接口
  ,queryChargeDatail : ApiRootUrl + '/charge/queryChargeDetail.do'//充电桩详情查询接口
  ,queryChargeDatailUnLogin : ApiRootUrl + 'noLogin/queryChargeDetail'//充电桩详情查询接口
  ,addChargeSubLog : ApiRootUrl + '/charge/addChargeSubLog.do'//充电桩空闲通知接口
  ,queryChargeSubLog : ApiRootUrl + '/charge/queryChargeSubLog.do'//查询充电桩空闲通知接口
  ,updateChargeSubLog: ApiRootUrl + '/charge/updateChargeSubLog.do'//取消充电桩空闲通知接口
  ,startCharge : ApiRootUrl + '/charge/chargeStart.do'//发起充电接口
  ,endCharge : ApiRootUrl + '/charge/chargeEnd.do'//结束充电接口
  ,queryChargeOrdLogs : ApiRootUrl + '/charge/queryChargeOrdLog.do'//充电记录列表查询接口
  ,queryChargeOrdDtl : ApiRootUrl + '/charge/queryChargeOrdDetail.do'//充电记录详情查询接口

   /******************** 账户 ***********************/
   ,queryAcctInfo : ApiRootUrl +  'acct/queryAcctInfo.do'
   ,recharge:ApiRootUrl+'pay/recharge.do'
   ,queryAcctLog: ApiRootUrl +  'acct/queryAcctLog.do'
   ,queryRefundDivAmt: ApiRootUrl +  'acct/queryRefundDivAmt.do'
   ,refund: ApiRootUrl +  'charge/refund.do'
   ,queryUsrOweFee: ApiRootUrl+ 'charge/queryUsrOweFee.do'

   /******************** 门禁 **********************/
   ,queryAcDevList:ApiRootUrl + '/door/queryAcDevList.do'
   ,remoteOpenDoor : ApiRootUrl + "/door/openDoor.do"

    /******************** 租客管理 **********************/
   ,tenantList:ApiRootUrl + 'tenant/list' // 租客管理查询
   ,tenantOperate:ApiRootUrl + 'tenant/operate' // 租客同意，拒绝，移除
}
