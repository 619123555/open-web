import Fetch from './fetch.js';

/**
 * 字典项的存取
 * 注：每一次session域内只请求一次
 */
export default class Dictionary {
    static instance;

    static getInstance() {
        if (!Dictionary.instance) {
            Dictionary.instance = new Dictionary();
        }
        return Dictionary.instance;
    }

    /**
     * 入口方法
     * @param name
     */
    async init(name) {
        let dictionaryObj = {};
        //1.处理请求的字典项名字 转换成数组格式
        let dictionName = []
        if (typeof name == "string") {
            if (name.indexOf(",") > -1) {
                dictionName = name.split(",")
            } else {
                dictionName.push(name)
            }
        } else {
            dictionName = name
        }

        let dicObj, dicName = [], version = [];
        dictionName.map((item)=> {
            dicName.push(item)
            version.push(0)
        })
        dicObj = {
            value: dicName.join(),
            version: version.join()
        }


        /*//2. 判断字典项是否需要请求后台(session)
         let notStored=[]
         if(dictionName!=undefined&&dictionName.length>0){
         notStored = this.getSessionStorage(dictionName)
         }else return dictionaryObj

         //3. 根据notStored，在local中查找对应的版本号，然后请求后台
         //   如果根据notStored为空，就是已经读取过接口 则直接在local中获取
         let dicObj={};
         if(notStored.length>0){
         dicObj = this.getDictionaryVer(notStored)
         }else{
         dictionaryObj = this.getDictionary(dictionName)
         return dictionaryObj
         }*/
        //4. fetch 获取字典项内容
        if (dicObj["value"]) {
            dictionaryObj = await this.callInterface1(dicObj, dictionName)
            return dictionaryObj
        }
    }

    callInterface1(dicObj, dictionName) {
        return new Promise((resolve, reject)=> {
            Fetch.getInstance().postWithRequestData("system/dict/showDictByTypeData", {requestData: dicObj}).then((data)=> {
                let dicValueObj = {}
              if (data.code == 200) {
                    let dictionaryData = data.data;
                    //把值和版本号存到local
                    dictionaryData.map((item)=> {
                        if (item.list != null && item.list != undefined) {
                            localStorage.setItem(item.value, JSON.stringify(item.list))
                            localStorage.setItem(`${item.value}_version`, item.version)
                        }
                    })
                    dicValueObj = this.getDictionary(dictionName)
                    if (JSON.stringify(dicValueObj) == "{}") {
                        reject(dicValueObj);
                    } else {
                        resolve(dicValueObj);
                    }
                }
            }).catch((error)=> {
                console.log(error)
            })
        })
    }

    /**
     * 根据字典项名字从local中获取值，并组装到一起
     * 根据status的值显示字典项值(1是显示，0是不显示)
     * @param dictionName
     * @returns {{}}
     */
    getDictionary(dictionName) {
        let obj = {}
        dictionName.map((item)=> {
            let dicLocalValue = localStorage.getItem(item)
            if (dicLocalValue != null && dicLocalValue != undefined) {
                let dicLocal = JSON.parse(dicLocalValue)
                let dictionary = []
                dicLocal.map((i)=> {
                    if (i.status == 1) {
                        dictionary.push(i)
                    }
                })
                obj[item] = dictionary
            } else {
                console.log("字典项本地读取出错：" + item)
            }
        })
        return obj
    }

    /**
     * 查看字典项是否在该session域内调用过
     * @param dictionName 请求的字典项名字
     * @returns {Array} 没有调用过的字典项名字
     */
    getSessionStorage(dictionName) {
        let notStored = []
        let dictionary = sessionStorage.getItem("Dictionary")
        if (dictionary != null && dictionary != undefined) {
            dictionary = dictionary.split(",")
            let a = $.grep(dictionName, function (n, i) {
                return $.inArray(n, dictionary) <= -1;
            });
            notStored = a
        } else {
            notStored = dictionName
        }
        return notStored
    }

    /**
     * 字典项名字和版本号读取后台接口
     * @param dicObj
     * @returns dictionaryData|null  返回字典项对应的数据，没有就返回null
     */
    callInterface(dicObj, dictionName) {
        return new Promise((resolve, reject)=> {
            Fetch.getInstance().postWithRequestData("system/dict/showDictByTypeData", {
                requestData: dicObj,
                urlType: "BASE_URL"
            }).then((data)=> {
                let dicValueObj = {}
              if (data.code == 200) {
                    let dictionaryData = data.data;
                    //把值和版本号存到local
                    dictionaryData.map((item)=> {
                        if (item.list != null && item.list != undefined && item.list.length > 0) {
                            localStorage.setItem(item.value, JSON.stringify(item.list))
                            localStorage.setItem(`${item.value}_version`, item.version)
                        }
                    })
                    //把字典项名字存到session的Dictionary
                    this.setSessionStorage(dicObj["value"])
                    dicValueObj = this.getDictionary(dictionName)
                    if (JSON.stringify(dicValueObj) == "{}") {
                        reject(dicValueObj);
                    } else {
                        resolve(dicValueObj);
                    }
                }
            }).catch((error)=> {
                console.log(error)
            })
        })
    }

    /**
     * 把字典项名字存到session
     * 格式 "字典项1,字典项2,..."
     * @param value
     */
    setSessionStorage(value) {
        let dictionary = sessionStorage.getItem("Dictionary")
        if (dictionary == null || dictionary == undefined) {
            sessionStorage.setItem("Dictionary", value)
        } else {
            dictionary += "," + value
            sessionStorage.setItem("Dictionary", dictionary)
        }
    }

    /**
     * 根据字典项名字获得对应的版本号
     * @param notStored 字典项名字
     * @returns {{value: string, version: string}|*} 返回字典项和对应的版本号
     */
    getDictionaryVer(notStored) {
        let dicObj, dicName = [], version = [];
        notStored.map((item)=> {
            let dictionaryVer = localStorage.getItem(`${item}_version`)
            if (dictionaryVer == null || dictionaryVer == undefined) {
                dicName.push(item)
                version.push(0)
            } else {
                dicName.push(item)
                version.push(dictionaryVer)
            }
        })
        dicObj = {
            value: dicName.join(),
            version: version.join()
        }
        return dicObj
    }

    /**
     * 根据key查找对应字典项的name
     * @param name
     * @param id
     */
    selectCorrespondName(name, id) {
        let value = id
        let dicName = localStorage.getItem(name)
        if (dicName == null || dicName == undefined) {
        } else {
            dicName = JSON.parse(dicName)
            for (let item of dicName) {
                if (item.value == id) {
                    value = item.label
                    break
                }
            }
        }
        return value
    }
}