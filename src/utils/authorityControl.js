import Fetch from 'utils/fetch'
import Path from 'src/pathConfig'

export default class AuthorityControl {
    static instance
    treeData=""
    static getInstance(){
        if(!AuthorityControl.instance){
            AuthorityControl.instance = new AuthorityControl()
        }
        return AuthorityControl.instance
    }

    //获取左侧菜单数据
    async getTreeData(pathname="null"){
        if(await this.checkLogin()){
            if(this.treeData==""){
                this.treeData = await this.getFetch()
            }
            if(pathname=="null"){
                return this.treeData
            }else{
                return this.generateMenu(this.treeData,pathname)
            }
        }
    }
    checkLogin(){
        return new Promise((resolve,reject)=> {
            Fetch.getInstance().postWithRequestData(Path.LOGIN_CHECK_URL).then((d)=> {
              if (d.code == 200) {
                    resolve(1);
                }else{
                    reject(0);
                }
            })
        }).catch((e)=>{
            console.log(e)
        })
    }
    getFetch(){
        return new Promise((resolve,reject)=> {
            Fetch.getInstance().postWithRequestData(Path.MENU_URL).then((d)=> {
              if (d.code == 200) {
                    this.treeData = d.data
                    resolve(this.treeData);
                }else{
                    reject("");
                }
            })
        })
    }
    generateMenu(menuObj,pathname) {
        let flag = 0;
        if(menuObj==[]||menuObj=="") return;
        for (let item of menuObj) {
            if(item.parentId=="1"){
                if(item.children!=null && item.children!=""){
                    flag+=this.generateMenu(item.children,pathname)
                }else{
                    if(item.to==pathname){
                        flag++
                        break
                    }
                }
            }else{
                if(item.children!=null && item.children!=""){
                    flag+=this.generateMenu(item.children,pathname)
                }else{
                    if(item.to==pathname){
                        flag++
                        break
                    }
                }
            }
        }
        return flag
    }
}
