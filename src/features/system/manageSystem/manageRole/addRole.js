import {Form, Input, message, Modal, Row, Tree} from 'antd';
import Fetch from '../../subfetch';
import {RcInputGroup} from 'testantd'

const FormItem = Form.Item;
const TreeNode = Tree.TreeNode;

class AddRole extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            roleMenuData: [],
            selectedKeys: [],
            code: ''
        }
    }

    hideModelHandler = ()=> {
        this.props.setState({
            addModelVisible: false
        })
        this.setState({
            selectedKeys: [],
        })
    };

    shouldComponentUpdate() {
        return true;
    }

    componentDidMount() {
        this.getMenuList();
        this.selectRoleMaxCode();
    }

    //得到用户菜单的数据
    getMenuList() {
        Fetch.getInstance().postWithRequestData("menu/treeData", {urlType: "BASE_URL"}).then((data) => {
          if (data.code == 200) {
                this.setState({
                  roleMenuData: data.data
                });
            } else {
                message.error('数据初始化错误，请重试', 5);
            }

        }), (error) => {
            message.error('用户菜单数据错误', 5);
        }
    }

    selectRoleMaxCode() {
        Fetch.getInstance().postWithRequestData("role/selectRoleMaxCode", {
            urlType: "BASE_URL"
        }).then((data)=> {
            this.setState({
                code: data.data,
                selectedKeys: []
            });
        }), (error)=> {
            console.log("错误信息:" + error);
        }
    }

    okHandler() {
        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log('数据为', values);
                if (this.state.selectedKeys.length <= 0) {
                    message.warn('请选择角色菜单!', 5);
                    return false;
                }
              console.log(this.state.selectedKeys);
                let selectedKeys = JSON.stringify(this.state.selectedKeys);
                selectedKeys = selectedKeys.substring(selectedKeys.indexOf("[") + 1, selectedKeys.lastIndexOf("]")).replace(/"/g, "")
                let saveData = {name: values.name, code: values.code, menuIds: selectedKeys};
                Fetch.getInstance().postWithRequestData("role/saveRoleData", {
                    requestData: saveData,
                    urlType: "BASE_URL"
                }).then((data)=> {
                  if (data.code == 200) {
                        message.success('角色新增成功', 5);
                        //重新清空输入框
                        this.props.form.resetFields();
                        this.selectRoleMaxCode();
                        this.hideModelHandler();
                        this.props.getListData();
                    }
                }), (error)=> {
                  console.log("错误信息:" + data.data);
                }

            } else {
                message.warn('数据格式有误', 5);
            }
        });
    };

    onCheck = (checkedKeys) => {
        this.setState({
            selectedKeys: checkedKeys
        });
    }

    render() {
        const loop = data => data.map((item) => {
            if (item.children) {
                return (
                    <TreeNode key={item.key} title={item.name}>
                        {loop(item.children)}
                    </TreeNode>
                );
            }
            return <TreeNode key={item.key} title={item.name}/>;
        });

        const {getFieldDecorator} = this.props.form;
        const formItemLayout = {
            labelCol: {span: 9},
            wrapperCol: {span: 15},
        };
        return (
            <span>
                <Modal title="角色新增"
                    /* 点击对话框外是否允许关闭 false:不予许关闭 */
                       maskClosable={false} visible={this.props.sta.addModelVisible} width={800}
                    /*此处注意用法区别，注意看：一个用了bind绑定了this，另一个未使用，再对应函数去查看区别用法*/
                       onOk={this.okHandler.bind(this)} onCancel={this.hideModelHandler}>
                    <RcInputGroup inputHeight={300}>
                        {[
                            <FormItem {...formItemLayout} label="角色名称" key={2}>
                                {
                                    getFieldDecorator('name', {
                                        rules: [{required: true, message: '角色名称不可为空!'},
                                            {max: 95, message: '角色名称过长'},
                                            {pattern: /^([A-Za-z]|[\u4E00-\u9FA5]|[0-9])+$/, message: '角色名称输入有误！'}],
                                        initialValue: '',
                                    })
                                    (<Input disabled={false}/>)
                                }
                            </FormItem>,
                            <FormItem {...formItemLayout} label="角色编号" key={3}>
                                {
                                    getFieldDecorator('code', {
                                        rules: [{max: 8, max: 20, message: ''}],
                                        initialValue: this.state.code,
                                    })(<Input disabled={false}/>)
                                }
                            </FormItem>,
                            <Row key={1}>
                                <FormItem {...formItemLayout} label="功能菜单">
                                    {
                                        getFieldDecorator('menuIds')
                                        (
                                            <Tree checkable onCheck={this.onCheck.bind(this)}
                                                  checkedKeys={this.state.selectedKeys}
                                                  defaultExpandAll={false}>
                                                {loop(this.state.roleMenuData)}
                                            </Tree>
                                        )
                                    }
                                </FormItem>
                            </Row>
                        ]}
                    </RcInputGroup>
                </Modal>
            </span>
        );
    }
}
export default Form.create()(AddRole);