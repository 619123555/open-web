import Fetch from './fetch.js';
import {message} from "antd";
/**
 * 下拉列表的存取
 */
export default class SelectItem {
    static instance;

    static getInstance() {
        if (!SelectItem.instance) {
            SelectItem.instance = new SelectItem();
        }
        return SelectItem.instance;
    }


    /**
     * 入口方法
     * @param name
     */
    async init(module, paras, url) {
        return await this.callInterface1(module, paras, url);
    }

    callInterface1(module, paras, url) {
        return new Promise((resolve, reject)=> {
            new Fetch(module).postWithRequestData(url, {requestData: paras}).then((data)=> {
                if (data.code == 200) {
                    let dictionaryData = data.data.data;
                    if (JSON.stringify(dictionaryData) == "{}") {
                        reject(dictionaryData);
                    } else {
                        resolve(dictionaryData);
                    }
                }
            }).catch((error)=> {
                console.log(error)
            })
        })
    }


}