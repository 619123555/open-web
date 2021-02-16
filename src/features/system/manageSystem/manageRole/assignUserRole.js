import {Form, message, Modal, Transfer, Tree} from 'antd';
import Fetch from '../../subfetch';
import '../../../../css/manageRole.css';

class AssignUserRole extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectOrg: 0
        }
    }

    setSelectOrg(selectOrg) {
        (function (selectOrg) {
            var that = this;
            this.setState({selectOrg: selectOrg}, function () {
                console.log("setState:" + that.state.selectOrg);
            });
        }).call(this, selectOrg);
    }

    refreshAssignUserList() {
        this.props.refreshAssignUserList(0);
    }

    hideModelHandler = ()=> {
        this.props.setState({
            assignUserRoleVisible: false
        })
    };


    okHandler() {
        this.props.form.validateFields((err, values) => {
            if (!err) {
                // console.log('数据为', values);
                this.refs["TransferUser"].saveUserRole();
                this.hideModelHandler();
            } else {
                message.warn('数据格式有误', 5);
            }
        });
    };

    render() {
        return (
            <span>
                <Modal title="角色分配"
                    /* 点击对话框外是否允许关闭 false:不予许关闭 */
                       maskClosable={false} visible={this.props.sta.assignUserRoleVisible} width={815}
                    /*此处注意用法区别，注意看：一个用了bind绑定了this，另一个未使用，再对应函数去查看区别用法*/
                       onOk={this.okHandler.bind(this)} onCancel={this.hideModelHandler}>
            <div className="crudBox">
                <div className="mR-box">
                    <div className="belong-title">用户选择
                    </div>
                    <div className="widget-content-user">
                        <div className="roleOrgList"><SOrgTree sta={this.state}
                                                               setSelectOrg={this.setSelectOrg.bind(this)}/></div>
                        <div className="roleOrgTransfer"><TransferUser sta={this.state} rid={this.props.rid}
                                                                       setState = {this.setState.bind(this)} refreshAssignUserList={this.refreshAssignUserList.bind(this)} ref="TransferUser"/></div>
                    </div>
                </div>
            </div>
                    </Modal>
                </span>
        )
    }
}
class SOrgTree extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            gData: [],
        }
    }

    componentDidMount() {
        this.getMenuList();
    }

    getMenuList() {
        Fetch.getInstance().postWithRequestData("organization/showOrgListData", {urlType: "BASE_URL"}).then((data)=> {
            this.setState({
              gData: data.data.data
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
            selectUserKey:[]
        }
    }

    componentWillReceiveProps(nextProps) {
        this.showRoleUser(nextProps);
    }

    showRoleUser(nextProps) {
        let roleId = nextProps.rid;
        let orgId = nextProps.sta.selectOrg;
        Fetch.getInstance().postWithRequestData("role/showUsersAndOrg", {
            requestData: {
                orgId: orgId,
                roleId: roleId
            }, urlType: "BASE_URL"
        }).then((data)=> {
            this.setState({
              showUsers: data.data.allLists,
              selectUserKey: data.data.selectedLists,
                orgId:orgId
            });
        }), (error)=> {
            console.log("错误信息:" + error);
        }
    }
    handleChange = (targetKeys) => {
        this.setState({selectUserKey: targetKeys});
    }
    saveUserRole() {
        let roleId = this.props.rid;
        let idsStr = JSON.stringify(this.state.selectUserKey);
        let orgId=this.state.orgId;
        idsStr = idsStr.substring(idsStr.indexOf("[") + 1, idsStr.lastIndexOf("]")).replace(/"/g, "");
        Fetch.getInstance().postWithRequestData("role/assignRoleDetailData", {
            requestData: {
                roleId: roleId,
                idsStr: idsStr,
                orgId:orgId
            }, urlType: "BASE_URL"
        }).then((data)=> {
          if (data.code == 200) {
            message.success(data.data, 5);
          }
            this.props.refreshAssignUserList();
        }), (error)=> {
            console.log("错误信息:" + error);
        }
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
                    titles={['未选中', '已选中']}
                    targetKeys={this.state.selectUserKey}
                    onChange={this.handleChange}
                    render={item => `${item.title}-${item.description}`}
                />
                </div>
            </div>
        );
    }
}
export default Form.create()(AssignUserRole);