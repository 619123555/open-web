/**
 * Created by Administrator on 2017-6-21.
 */
import {Modal,Form,Row, Tree} from 'antd';
import Fetch from '../../subfetch';

export default class RecipOrgModel extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedOrgs: []
        }
    }



    okHandler(){
        this.props.setState({
            addRecipOrgVisible : false
        });
    }

    hideModelHandler =()=>{
        this.props.setState({
            addRecipOrgVisible : false
        });
    }

    render() {



        return (

            <span>
                <Modal title="选择接收机构"
                    /* 点击对话框外是否允许关闭 false:不予许关闭 */
                       maskClosable={false} visible={this.props.sta.addRecipOrgVisible} width={800}
                    /*此处注意用法区别，注意看：一个用了bind绑定了this，另一个未使用，再对应函数去查看区别用法*/
                       onOk={this.okHandler.bind(this)} onCancel={this.hideModelHandler}>

                    <div>
                        <OrgTree
                            sta={this.state}
                            setState = {this.setState.bind(this)}
                        />
                    </div>
                </Modal>
            </span>
        );
    }

}

class OrgTree extends React.Component{

    constructor(props) {
        super(props);
        this.state = {
            gData: [],
            selectedKeys:[],
        }
    }

    componentDidMount() {
        this.getMenuList();
    }

    getMenuList() {
        Fetch.getInstance().postWithRequestData("organization/showOrgListData", {urlType: "BASE_URL"}).then((data)=> {
            this.setState({
                gData: data.data
            });
            console.log("gData:");
            console.log(data.data);
        }), (error)=> {
            console.log("错误信息:" + error);
        }
    }


    onCheckOrgTree = (checkedKeys) => {
        this.setState({
            selectedKeys: checkedKeys
        });
        this.props.setState({selectedOrgs:checkedKeys});
        console.log(this.props.sta.selectedOrgs);
    }

    onSelect = (selectedKeys, info) => {
        // console.log('onSelect', info);
        this.setState({ selectedKeys });
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
            <Tree checkable   onCheckOrgTree={this.onCheckOrgTree.bind(this)} onSelect={this.onSelect} checkedKeys={this.state.selectedKeys}  defaultExpandAll={false}>
                {loop(this.state.gData)}
            </Tree>
        );
    }

}