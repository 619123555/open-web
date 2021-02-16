/**
 * Created by Tan on 2017-6-12.
 */
import {Modal,Input, Select, message, Row, Col, TreeSelect,Button,Transfer, Tree} from 'antd';
import Fetch from '../../subfetch';
import '../../../../css/manageInformation.css';

export default class RecipientsModel extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectOrg: 0,
            transferUserDidload:false
        }
    }



    hideModelHandler =()=>{
        this.props.setState({
           addRecipientsVisible : false
        });
    }


    handleSelectedIdListChange(value){
        this.props.setState({selectedIdList:value});

        //把已选择的ID集合转换成名称集合，用于显示
        Fetch.getInstance().postWithRequestData("user/findUserByIDs", {
            requestData:{'userIds':value.join(',')},
            urlType: "BASE_URL"
        }).then((data)=>{
            this.props.setState({selectedRecipName:data.data});
        }),(error)=>{
            console.log("获取接收人名字集合失败" + error);
        }
    }
    //第一级弹出框确定或者取消后，清除第二级弹出框的所有内容
    reSetState(){
        this.state.selectOrg = 0;
        if(this.state.transferUserDidload){
            this.refs["TransferUser"].reSetTransferState();
        }

    }

    setSelectOrg(selectOrg) {
        this.setState({selectOrg: selectOrg});
    }

    okHandler() {
        this.refs["TransferUser"].saveUser();
        this.hideModelHandler();
    }

    render() {
        return (
            <span>
                <Modal title="选择接收人"
                    /* 点击对话框外是否允许关闭 false:不予许关闭 */
                       maskClosable={false} visible={this.props.sta.addRecipientsVisible} width={900}
                    /*此处注意用法区别，注意看：一个用了bind绑定了this，另一个未使用，再对应函数去查看区别用法*/
                       onOk={this.okHandler.bind(this)} onCancel={this.hideModelHandler} >
                    <div className="crudBox">
                        <div className="mR-box">
                            <div className="widget-content-user">
                                <div className="userOrgList">
                                    <SOrgTree
                                        sta={this.state}
                                        setSelectOrg={this.setSelectOrg.bind(this)}
                                    />
                                </div>
                                <div className="userTransfer">
                                    <TransferUser
                                        ref="TransferUser"
                                        sta={this.state}
                                        setState = {this.setState.bind(this)}
                                        handleSelectedIdListChange={this.handleSelectedIdListChange.bind(this)}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </Modal>
            </span>
        );
    }
}
class SOrgTree extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            gData: [],
        }
    }

    componentWillMount() {
        this.getMenuList();
    }

    getMenuList() {
        Fetch.getInstance().postWithRequestData("organization/showOrgListData", {urlType: "BASE_URL"}).then((data)=> {
            this.setState({
                gData: data.data
            });
        }), (error)=> {
            console.log("错误信息:" + error);
        }
    }

    onSelect = (selectedKeys, info) => {
        this.props.setSelectOrg(info.node.props.eventKey);
    }

    render() {
        const TreeNode = Tree.TreeNode;
        const loop = data => data.map((item) => {
            if (item.children) {
                return (
                    <TreeNode key={item.key} title={item.orgName}>
                        {loop(item.children)}
                    </TreeNode>
                );
            }
            return <TreeNode key={item.key} title={item.orgName}/>;
        });
        return (
            <Tree onSelect={this.onSelect}>
                {loop(this.state.gData)}
            </Tree>
        );
    }
}
class TransferUser extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            orgId:"",
            showUsers: [],
            selectUserKey: [],
        }
    }

    componentDidMount(){
        this.props.setState({transferUserDidload:true});
    }

    componentWillReceiveProps(nextProps) {
        this.showUserList(nextProps);
    }

    reSetTransferState(){
        this.state = {
            orgId:"",
            showUsers: [],
            selectUserKey: []
        }
    }

    showUserList(nextProps) {
        let orgId = nextProps.sta.selectOrg;

        Fetch.getInstance().postWithRequestData("role/showUsersAndOrg", {
            requestData: {
                orgId: orgId,
            }, urlType: "BASE_URL"
        }).then((data)=> {
            this.setState({
                showUsers: data.allLists,
            });
        }), (error)=> {
            console.log("111...." + error);
        }

    }

    handleChange = (nextTargetKeys) => {
        this.setState({
            selectUserKey: nextTargetKeys,
        });
    }

    saveUser() {
        if (this.state.selectUserKey == null || this.state.selectUserKey == ''){
            message.warning("请选择接收对象！");
            return;
        }
        //在上级组件中记录选择的接收人的id，用于后台的保存
        this.props.handleSelectedIdListChange(this.state.selectUserKey);
    }

    render() {
        return (
            <div className="widget-content">
                <div><Transfer
                    dataSource={this.state.showUsers}
                    showSearch
                    listStyle={{
                        width: 250,
                        height: 300,
                    }}
                    searchPlaceholder='请输入搜索内容'
                    titles={['未选中','已选中']}

                    targetKeys={this.state.selectUserKey}
                    onChange={this.handleChange}
                    render={item => `${item.title}-${item.description}`}
                />
                </div>

            </div>
        );
    }
}