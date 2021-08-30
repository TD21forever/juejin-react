"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getYMDHMS = exports.ch2en = void 0;

var ch2en = function ch2en(chineseName) {
  var res = '';

  switch (chineseName) {
    case "前端":
      res = "frontend";
      break;

    case "后端":
      res = "backend";
      break;

    case "Android":
      res = "Android";
      break;

    case "iOS":
      res = "iOS";
      break;

    case "推荐":
      res = "recommend";
      break;

    default:
      res = "tags";
      break;
  }

  return res;
};

exports.ch2en = ch2en;

var getYMDHMS = function getYMDHMS(timestamp) {
  var time = new Date(timestamp);
  var year = time.getFullYear();
  var month = time.getMonth() + 1;
  var date = time.getDate();
  var hours = time.getHours();
  var minute = time.getMinutes();
  var second = time.getSeconds();

  if (month < 10) {
    month = '0' + month;
  }

  if (date < 10) {
    date = '0' + date;
  }

  return year + '年' + month + '月' + date + '日';
};

exports.getYMDHMS = getYMDHMS;