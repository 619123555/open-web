
//自动进行全局的ES6 Promise的Polyfill
require('es6-promise').polyfill();
import 'isomorphic-fetch';
import Path from 'src/pathConfig'

/**
 * @function 基础的模型类,包含了基本的URL定义
 */
export default class Fetch {
    // 默认的请求头
    static headers = {
        "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"  //要改json/app
    };
    // 实例
    static instance;
    static module;

    /**
     * @function 默认构造函数
     */
    constructor(module) {
      this._checkStatus = this._checkStatus.bind(this);
      this._parseJSON = this._parseJSON.bind(this);
      this._parseText = this._parseText.bind(this);
      this._fetchWithCORS = this._fetchWithCORS.bind(this);
      if (Path.DEV && module == Path.MODULE) {
        this.BASE_URL = Path.BASE_URL;
      } else if (module) {
        this.module = module;
        this.BASE_URL = this.BASE_URL + module + "/";
      }
    }
    static getInstance(){
        if(!Fetch.instance){
            Fetch.instance = new Fetch();
        }
        return Fetch.instance;
    }
    getBaseURL(upload){
        if(upload && (!Path.DEV || this.module != Path.MODULE)){
            var parseUrl = /((?:([A-Za-z]+):)?(\/{0,3})([0-9.\-A-Za-z]+)(?::(\d+))?)(?:\/([^?#]*))?/;
            var result = parseUrl.exec(this.BASE_URL);
            return result[1] + "/zuul" + this.BASE_URL.substr(result[1].length)
        }
        return this.BASE_URL
    }
    /**
     * @function 检测返回值的状态
     * @param response
     * @returns {*}
     */
    _checkStatus(response) {
        if (response.status >= 200 && response.status < 300) {
            return response
        }else {
            let error = new Error(response.statusText);
            error.response = response;
            throw error
        }
    }
    /**
     * @function 解析返回值中的Response为JSON形式
     * @param response
     * @returns {*}
     */
    _parseJSON(response) {
        if (!!response) {
            return response.json();
        }else {
            return undefined;
        }
    }
    /**
     * @function 解析TEXT性质的返回
     * @param response
     * @returns {*}
     */
    _parseText(response) {
        if (!!response) {
            return response.text();
        }else {
            return undefined;
        }
    }
    /**
     * @function 跨域请求的方法
     * @param packagedRequestURL
     * @returns {*|Promise.<TResult>}
     * @private
     */
    _fetchWithCORS(packagedRequestURL, contentType,method,requestData,headers) {
        let timeoutId = setTimeout(()=>{
            $(".main-loading").show();
        },1000)
        return fetch(packagedRequestURL, {
            mode: "cors",
            method: method,
            credentials:"include",  //带cookie
            headers: headers || Fetch.headers,
            body:requestData
        })
            .then(this._checkStatus, (error)=> {
                return error;
            })
            .then(contentType === "json" ? this._parseJSON : this._parseText, (error)=> {
                return error;
            })
            .then((value)=>{
                $(".main-loading").hide()
                clearTimeout(timeoutId)
                if(value.status==505){
                    location.reload(true)
                }
                return value
            });
    }
    /**
     * @function 利用get方法发起请求
     * @param path 请求的路径(包括路径参数)
     * @param requestData 请求的参数
     * @param action 请求的类型
     * @param contentType 返回的类型
     * @returns {Promise.<TResult>|*} Promise.then((data)=>{},(error)=>{});
     */
    get({path="/", action="GET", contentType="json"}) {
        //封装最终待请求的字符串
        const packagedRequestURL = `${this.BASE_URL}${(path)}?action=${action}`;
        //以CORS方式发起请求
        return this._fetchWithCORS(packagedRequestURL, contentType);
    }
    /**
     * @function 利用get方法与封装好的QueryParams形式发起请求
     * @param path 请求的路径(包括路径参数)
     * @param requestData 请求的参数
     * @param action 请求的类型
     * @returns {Promise.<TResult>|*} Promise.then((data)=>{},(error)=>{});
     */
    getWithQueryParams({path="/", queryParams={}, contentType="json"}) {
        //初始化查询字符串
        let queryString = "";
        //根据queryParams构造查询字符串
        for (let key in queryParams) {
            //注意,请求参数必须进行URI格式编码,如果是JSON等特殊格式需要在服务端进行解码
            queryString += `${key}=${encodeURIComponent(queryParams[key])}&`;
        }
        //将查询字符串进行编码
        let encodedQueryString = (queryString);
        //封装最终待请求的字符串
        const packagedRequestURL = `${this.BASE_URL}${path}?${encodedQueryString}action=${action}`;
        //以CORS方式发起请求
        return this._fetchWithCORS(packagedRequestURL, contentType,"get");
    }

    isJSON(str) {
        if (typeof str == 'string') {
            try {
                if(str.indexOf('{')>-1 && str.indexOf('}')>-1){
                    return true;
                }else{
                    return false;
                }

            } catch(e) {
                console.log(e);
                return false;
            }
        }
        return false;
    }
    /**
     * @function 考虑到未来post会有不同的请求方式,因此做区分处理
     * @param path
     * @param requestData
     * @param action
     * @returns {Promise.<TResult>|*}
     */
    postWithRequestData(path,{requestData={},contentType="json",method="post"}={}) {
        let packagedRequestURL = `${this.BASE_URL}${path}`;
        let params = "";
        if(path.indexOf("http:")>-1) packagedRequestURL = `${path}`;
        if(typeof requestData=="string"&&requestData.indexOf("&")>-1&&requestData.indexOf("=")>-1){
            params = requestData
        }else if(this.isJSON(requestData)){
            params = requestData;
            let heads = {"Content-Type": "application/json;charset=utf-8"};
            return  this._fetchWithCORS(packagedRequestURL,contentType,method,params,heads);
            // return this._fetchWithCORS(packagedRequestURL,contentType,method,params)
        }
        else {
            params = this.urlEncode(requestData)
        }
        /*if(typeof requestData == "object" && JSON.stringify(requestData) != "{}"){
         if(!(requestData instanceof Map)){
         requestData = this.objToStrMap(requestData);
         }
         for (let item of requestData.entries()) {
         params+=item[0]+"="+item[1]+"&"
         }
         }*/
        return this._fetchWithCORS(packagedRequestURL,contentType,method,params);
    }
    /**
     * 上传文件
     * @param path
     * @param requestData
     * @param contentType
     * @param method
     * @param urlType
     */
    fileUpload(path,requestData,{contentType="json",method="post",headers={}}={}){
        let packagedRequestURL = `${this.BASE_URL}${path}`;
        if(path.indexOf("http:")>-1) packagedRequestURL = `${path}`;
        return this._fetchWithCORS(packagedRequestURL,contentType,method,requestData,headers);
    }
    put(path, {requestData={}, action="put", contentType="json"}) {
    }
    delete(path, {requestData={}, action="DELETE", contentType="json"}) {
    }
    urlEncode (param, key, encode) {
        if(param==null) return '';
        let paramStr = '';
        let t = typeof (param);
        if (t == 'string' || t == 'number' || t == 'boolean') {
            paramStr += '&' + key + '=' + ((encode==null||encode) ? encodeURIComponent(param) : param);
        } else {
            for (let i in param) {
                let k = key == null ? i : key + (param instanceof Array ? '[' + i + ']' : '.' + i);
                paramStr += this.urlEncode(param[i], k, encode);
            }
        }
        return paramStr;
    };
    /**
     * 对象转Map
     * @param obj
     * @returns {Map}
     */
    objToStrMap(obj) {
        let strMap = new Map();
        for (let k of Object.keys(obj)) {
            strMap.set(k, obj[k]);
        }
        return strMap;
    }
}
//默认的基本URL路径
Fetch.prototype.BASE_URL = Path.BASE_URL;
