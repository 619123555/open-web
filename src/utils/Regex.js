//可能需要传入的参数 text:文本 min:最小长度(字符) max:最大长度(字符)
const Regex = {
  /**
   * 国内座机和传真号码
   * @param text
   * @returns {boolean}
   */
  reg_tel: (text) => {
    let rull = /^[+]{0,1}(\d){1,3}[ ]?([-]?((\d)|[ ]){1,12})+$/;
    return rull.test(text);
  },
  /**
   * 手机号码
   * @param text
   * @returns {boolean}
   */
  reg_mobil: (text) => {
    let rull = /0?(13|14|15|18|17)[0-9]{9}/;
    return rull.test(text);
  },
  /**
   * 非负整数
   * @param text
   * @returns {boolean}
   */
  reg_positiveInteger: (text) => {
    let positive = /^[1-9]\d*|0$/;
    let pInteger = /^[1-9]\d*\.\d*|0\.\d*[1-9]\d*$/;
    if (positive.test(text) && !pInteger.test(text)) {
      return true;
    } else {
      return false;
    }
  },
  /**
   * 银行卡号
   * @param text
   * @returns {boolean}
   */
  reg_card: (text) => {
    let rull = /^\d{16}|\d{19}$/;
    return rull.test(text);
  },
  /**
   * 身份证号
   * @param text
   * @returns {boolean}
   */
  reg_idCard: (text) => {
    let rull = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
    return rull.test(text);
  },
  /**
   * 金额
   * @param text
   * @returns {boolean}
   */
  reg_money: (text) => {
    let rull = /^\d+(?:\.\d{1,4})?$/;
    return rull.test(text);
  },
  /**
   * 百分比
   * @param text
   * @returns {boolean}
   */
  reg_persent: (text) => {
    let rull = /^(100|[1-9]?\d(\.\d\d?\d?)?)$/;
    return rull.test(text);
  },
  /**
   * 不能为空
   * @param text
   * @returns {boolean}
   */
  reg_nothing: (text) => {
    let rull = /^.{1,}$/;
    return rull.test(text);
  },
  /**
   * 匹配特殊字符
   * @param text
   * @returns {boolean}
   */
  reg_specialChars: (text) => {
    let rull = /((?=[\x21-\x7e]+)[^A-Za-z0-9])/;
    return rull.test(text);
  },
  /**
   * 长度
   * @param text
   * @param max
   * @returns {boolean}
   */
  reg_length: (text, max) => {
    let textLength = 0;
    let rull = /[\u4e00-\u9fa5]/;
    for (let codePoint of text) {
      if (rull.test(codePoint)) {
        textLength += 2;
      } else {
        textLength++;
      }
    }
    if (textLength <= max) {
      return true
    } else {
      return false
    }
  },
  /**
   * 范围
   * @param text
   * @param min
   * @param max
   * @returns {boolean}
   */
  reg_range: (text, min, max) => {
    let textLength = 0;
    let rull = /[\u4e00-\u9fa5]/;
    for (let codePoint of text) {
      if (rull.test(codePoint)) {
        textLength += 2;
      } else {
        textLength++;
      }
    }
    if (textLength >= min && textLength <= max) {
      return true
    } else {
      return false
    }
  },
  /**
   * 邮箱格式
   * @param text
   * @returns {boolean}
   */
  reg_email: (text) => {
    let rull = (/[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/);
    return rull.test(text);
  },

  /**
   * 字母数字下划线
   * @param text
   * @returns {boolean}
   */
  reg_email: (text) => {
    let rull = /^\w$/;
    return rull.test(text);
  },

  /**
   * 替换： 去除字符串中的空格所有的空格，包括两端的
   * @param str
   */
  trim_space_key: (str) => {
    let reg = /\s*/g;
    return str.replace(reg, "");
  },

  /**
   * 验证数字
   * @param text
   * @returns {boolean}
   */
  reg_cardNumber: (text) => {
    let rull = /^[0-9]*$/;
    return rull.test(text);
  },
  /**
   * 验证字母数字
   * @param text
   * @returns {boolean}
   */
  reg_numLetter: (text) => {
    let rull = /^[A-Za-z0-9]+$/;
    return rull.test(text);
  },
  /**
   * 对数字进行千分表示，小数点后数字不千分
   * 调用方法：formatNumToMicrometer(undefined, '-' , 123123.1231)  -> 123-123.1231
   * 调用方法：formatNumToMicrometer("$ ", '-' , 123123.1231)  -> $ 123-123.1231
   * prefixStr: 拼接的前缀, 如果不拼接 给 ""
   * delimiter：分隔符
   * add by zhl
   * */
  formatNumToMicrometer(prefixStr = "", delimiter, value) {
    let result = (value.toString()).indexOf(".");
    if (result != -1) {
      return prefixStr + value.toString().replace(
          /\B(?=((\d{3})+(?!\d))(?=\.))/g, delimiter);
    } else {
      return prefixStr + value.toString().replace(/\B(?=(\d{3})+(?!\d))/g,
          delimiter);
    }
  },
  /**
   * prefixStr: 需要剔除的字符
   * delimiter：需要剔除分隔符
   * */
  parserStrToNum: (prefixStr, delimiter, value) => {
    let reg = new RegExp(prefixStr + "\\s?|(" + delimiter + "*)", "g");
    return value.replace(reg, '')
  },
  /**
   * 还原格式化后的金额
   * resetMoney("1,812,548.010100") => 1812548.0101
   * @param s
   * @returns {Number}
   */
  resetMoney: (s = "0") => {
    return parseFloat(s.replace(/[^\d\.-]/g, ""));
  },

  /**
   * 将金额由分为单位转换为以元为单位，并以千分位表示
   * @param value 以分为单位的金额值
   * @param type 若传入的金额值为undefined或null，则type="s"时表示以0.00显示，type="h"表示不显示
   * @returns {String}
   */
  convertMoney: (value, type = "s") => {
    if (value == undefined || value == null) {
      if (type == "h") {
        return null;
      } else {
        return "0.00";
      }
    }
    let convert = (value / 100).toFixed(2);
    return convert.toString().replace(/\B(?=((\d{3})+(?!\d))(?=\.))/g, ",");
  }
}
export default Regex