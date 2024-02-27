const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatDate = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()

  return [year, month, day].map(formatNumber).join('-')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

function dateFMT(number, format) {
  var formateArr = ['Y', 'M', 'D', 'h', 'm', 's'];
  var returnArr = [];
  var date = new Date(number);
  returnArr.push(date.getFullYear());
  returnArr.push(formatNumber(date.getMonth() + 1));
  returnArr.push(formatNumber(date.getDate()));

  returnArr.push(formatNumber(date.getHours()));
  returnArr.push(formatNumber(date.getMinutes()));
  returnArr.push(formatNumber(date.getSeconds()));

  for (var i in returnArr) {
    format = format.replace(formateArr[i], returnArr[i]);
  }
  return format;
}

const leftPad = (str,size,padChar) =>{
  if(str.toString().length == size){
    return str;
  }
  var leftPad = '';
  for(var i = 0;i<size-str.toString().length;i++){
    leftPad = leftPad + padChar;
  }
  return leftPad + str;
}

module.exports = {
  formatTime: formatTime,
  formatDate:formatDate,
  dateFMT: dateFMT,
  leftPad:leftPad,
  getCurrentPage: function () {
    var t = getCurrentPages();
    return t[t.length - 1];
  },
  getPrePage: function () {
    var t = getCurrentPages();
    return t[t.length - 2];
  }
}
