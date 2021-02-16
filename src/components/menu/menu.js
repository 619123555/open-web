import {Link} from 'react-router';
import { Menu,Icon } from 'antd';
import './menu.css'
import AuthorityControl from 'utils/authorityControl'

class Navigation extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            data: [],
            openKeys: [],
            selectKey:"workbench",
            urlPathData:{}
        }
    }
    componentWillMount(){
        let pathname = window.location.pathname
        let selectKey = pathname.substring(1)
        localStorage.setItem('selectKey',selectKey)
        AuthorityControl.getInstance().getTreeData().then(d=>{
            let url = this.selectKeyArr(d,selectKey)
            let openKeys = this.dealWithUrl(url)
            this.setState({data:d,selectKey:url,openKeys});
            this.getMenuCnText(openKeys)
        })
    }
    selectKeyArr(menuObj,url){
        let selectKey=""
        for (let item of menuObj) {
            if(item.parentId=="1"){
                if(item.children!=null && item.children!=""){
                    selectKey+=this.selectKeyArr(item.children,url)
                }else{
                    if(item.to==url){
                        selectKey = item.key
                        break
                    }
                }
            }else{
                if(item.children!=null && item.children!=""){
                    selectKey+=this.selectKeyArr(item.children,url)
                }else{
                    if(item.to==url){
                        selectKey = item.key
                        break
                    }
                }
            }
        }
        return selectKey
    }
    dealWithUrl(url){
        let openKeys = []
        let urlArr = url.split("/")
        if(urlArr.length==1){
            openKeys.push(urlArr[0])
        }else{
            let urlArrTwo = urlArr.slice(1,3)
            let sliceStr = urlArrTwo[0]+"/"+urlArrTwo[1]
            urlArr.splice(1,2,sliceStr)
            let a = ""
            for(let i = 0;i<urlArr.length;i++){
                a += urlArr[i]+"/"
                openKeys.push(a.substring(0,a.length-1))
            }
        }
        return openKeys
    }
    componentWillReceiveProps(nextProps){
        if(nextProps.collapsed){
            this.setState({openKeys:[]})
        }
    }
    /**
     * 递归生成菜单
     * @param menuObj
     * @returns {Array}
     */
    generateMenu(menuObj) {
        const SubMenu = Menu.SubMenu;
        let vdom = [];
        if(menuObj==[]||menuObj=="") return;

        if (menuObj instanceof Array) {
            for (let item of menuObj) {
                let image = item.image?"fa "+item.image:"fa fa-angle-right";
                if(item.parentId=="1"){     //一级菜单
                    this.state.urlPathData[item.to] = item.name;
                    if(item.children!=null && item.children!=""){
                        vdom.push(
                            <SubMenu key={item.key} title={<span><i className={image} style={{marginRight:'8px',minWidth:'14px'}} /><span className="nav-text">{item.name}</span></span>}>
                                {this.generateMenu(item.children)}
                            </SubMenu>
                        );
                    }else{
                        vdom.push(
                            <Menu.Item key={item.key}>
                                <i className={image} style={{marginRight:'8px',minWidth:'14px'}}></i>
                                <Link to={`/${item.to}`} style={{ display: 'inline' }}><span className="nav-text">{item.name}</span></Link>
                            </Menu.Item>
                        );
                    }
                }else{
                    this.state.urlPathData[item.key] = item.name;
                    if(item.children!=null && item.children!=""){
                        vdom.push(
                            <SubMenu key={item.key} title={<span className="nav-text">{item.name}</span>}>
                                {this.generateMenu(item.children)}
                            </SubMenu>
                        );
                    }else{
                        vdom.push(
                            <Menu.Item key={item.key}>
                                {/*<Icon type="user" />*/}
                                {/*<i className={image} style={{marginRight:'8px',minWidth:'14px'}}></i>*/}
                                <Link to={`/${item.to}`} style={{ display: 'inline' }} title={item.name}><span className="nav-text">{item.name}</span></Link>
                            </Menu.Item>
                        );
                    }
                }
            }
        }
        return vdom;
    }

    /**
     * 点击菜单按钮触发的事件
     * add by zhl
     * for: 页面题头文字
     * */
    handleMenuClick = (e) => {
        let selectUrl = e.keyPath;
        this.getMenuCnText(selectUrl)
    }

    /**
     * 根据 key值 得出路径文字
     * add by zhl
     * for: 页面题头文字
     * */
    getMenuCnText(selectUrl){
        selectUrl = selectUrl.sort();
        let menuCnText = '';
        if(selectUrl != null ){
            let urlPathData = this.state.urlPathData;
            selectUrl.forEach((item, i) => {
                if(i != 0){
                    menuCnText = urlPathData[item] != null ? menuCnText + " > " + urlPathData[item] : '';
                }else {
                    menuCnText = urlPathData[item] != null ? urlPathData[item] : '';
                }
            })
        }
        this.props.setState({
            menuCnText: menuCnText
        });
    }

    onOpenChange = (openKeys) => {
        let openKey = this.state.openKeys;
        if(openKey[0]==""){
            openKey.splice(0,1)
        }
        const latestOpenKey = openKeys[openKeys.length-1]
        let nextOpenKeys = [];
        if(latestOpenKey){
            if(openKey.length==1&&openKey[0]==""){
                nextOpenKeys=openKeys
            }else{
                if(latestOpenKey.indexOf(openKey[0])>-1){
                    nextOpenKeys=openKeys
                }else{
                    nextOpenKeys.push(latestOpenKey)
                }
            }
        }
        this.setState({ openKeys: nextOpenKeys });
        $("#sider").removeClass("ant-layout-sider-collapsed").css({"flex":"0 0 200px","width":"200px"})
        this.props.collapsed && this.props.toggle()
    }
    onSelect = ({key}) => {
        this.setState({selectKey:key})
    }

    render(){
        return(
            <Menu theme="dark" mode="inline" onClick={this.handleMenuClick} selectedKeys={[this.state.selectKey || "workbench"]}
                  onOpenChange={this.onOpenChange} openKeys={this.state.openKeys}
                  onSelect={this.onSelect}
            >
                {this.generateMenu(this.state.data)}
            </Menu>
        )
    }
}

export default Navigation
