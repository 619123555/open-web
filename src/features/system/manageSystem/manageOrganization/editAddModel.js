import {Form, Input, message, Modal, Select, TreeSelect} from 'antd';
import Fetch from '../../subfetch';
import {RcInputGroup} from 'testantd'

const FormItem = Form.Item;
const Option = Select.Option;
const TreeNode = TreeSelect.TreeNode;

class EditModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {


        }
    }
    hideModelHandler =()=>{
        this.props.setState({
            editAddModelVisible: false
        })
    };

    componentWillMount() {
    }

    okHandler(){
        this.props.form.validateFields((err, values) => {
            //values.push("parentIds",this.props.sta.selectedRows[0].parentIds);
            if (!err) {
                console.log('数据为', values);
              if (this.props.sta.addFlag) {
                // 新增
                    Fetch.getInstance().postWithRequestData("organization/saveOrgData", {
                        requestData: values,
                        urlType: "BASE_URL"
                    }).then((data) => {
                      if (data.code == 200) {
                            //重新清空输入框
                            this.props.form.resetFields();
                            message.success("新增成功");
                            this.props.getListData();
                        } else {
                            message.error('新增错误，请重试', 5);
                        }
                    }), (error) => {
                        console.log("系统内部错误");
                    }
                }else{  // 修改
                    values.id=this.props.sta.selectedRows[0].orgId;

                    console.log(values)
                    Fetch.getInstance().postWithRequestData("organization/updateOrgData", {
                        requestData: values,
                        urlType: "BASE_URL"
                    }).then((data) => {
                      if (data.code == 200) {
                            //重新清空输入框
                            this.props.form.resetFields();
                            message.success("修改成功");
                            this.props.getListData();

                        } else {
                            message.error('新增错误，请重试', 5);
                        }
                    }), (error) => {
                        console.log("系统内部错误");
                    }
                }
                this.hideModelHandler();
            } else {
                message.warn('数据格式有误', 5);
            }
        });
    };



    render() {
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: {span: 9},
            wrapperCol: {span: 15},
        };

        //机构类型
        let Common_orgTypeCode = this.props.sta.orgTypeCode!=null ? this.props.sta.orgTypeCode.map(d => <Option key={d.value} value={d.value}>{d.label}</Option>) : [];
        let loop = data=> data != null ?
                data.map(
                    (item) => {
                        if (item.children) {
                            return (
                                <TreeNode key={item.orgId} value={item.orgId} title={item.orgName}>
                                    {loop(item.children)}
                                </TreeNode>
                            );
                        }
                        return <TreeNode key={item.orgId} value={item.orgId} title={item.orgName}/>;
                    })
                : null;
        return (
            <span>
                <Modal title="修改机构"
                       /* 点击对话框外是否允许关闭 false:不予许关闭 */
                       maskClosable={false} visible={this.props.sta.editAddModelVisible} width={800}
                        /*此处注意用法区别，注意看：一个用了bind绑定了this，另一个未使用，再对应函数去查看区别用法*/
                       onOk={this.okHandler.bind(this)} onCancel={this.hideModelHandler} >
                    <RcInputGroup inputHeight={200}>
                        {[
                            <FormItem {...formItemLayout} label="上级机构" key={6}>
                                {
                                    getFieldDecorator('parent.id', {
                                        initialValue: !this.props.sta.addFlag ?
                                            this.props.sta.selectedRows.length > 0 ? this.props.sta.selectedRows[0].parentId  : ''
                                            : '',
                                    })
                                    (
                                        <TreeSelect disabled={!this.props.sta.addFlag} showSearch dropdownStyle={{ maxHeight: 400, overflow: 'auto' }} placeholder="请选择"
                                        notFoundContent="暂无匹配数据" allowClear treeDefaultExpandAll treeNodeFilterProp="title" >
                                            {loop(this.props.propsSta.data)}
                                         </TreeSelect>)
                                }
                            </FormItem>,
                            <FormItem {...formItemLayout} label="机构名称" key={1}>
                                {
                                    getFieldDecorator('name', {
                                        rules:[ {required: true,message: '不能为空' }],
                                        initialValue: !this.props.sta.addFlag ?
                                            this.props.sta.selectedRows.length > 0 ? this.props.sta.selectedRows[0].orgName : ''
                                            : '',
                                    })
                                    (<Input />)


                                }
                            </FormItem>,
                            <FormItem {...formItemLayout} label="机构简称" key={2}>
                                {
                                    getFieldDecorator('simpleCode', {
                                        rules: [ {required: true,message: '不能为空' },{ max: 5, message: '最大长度5' },{pattern:/^([A-Za-z])+$/ , message:"只能输入英文字母"} ],
                                        initialValue: !this.props.sta.addFlag ?
                                            this.props.sta.selectedRows.length > 0 ? this.props.sta.selectedRows[0].simpleCode : ''
                                            : '',
                                    })(<Input disabled={!this.props.sta.addFlag}/>)
                                }
                            </FormItem>,
                            <FormItem {...formItemLayout} label="机构编码" key={3}>
                                {
                                    getFieldDecorator('code', {
                                        rules:[ {required: true,message: '不能为空' }],
                                        initialValue: !this.props.sta.addFlag ?
                                            this.props.sta.selectedRows.length > 0 ? this.props.sta.selectedRows[0].orgCode : ''
                                            : '',
                                    })
                                    (<Input disabled={!this.props.sta.addFlag}/>)
                                }
                            </FormItem>,
                            <FormItem {...formItemLayout} label="机构类型" key={8}>
                                {
                                    getFieldDecorator('type', {
                                        rules: [ {required: true,message: '不能为空' } ],
                                        initialValue: !this.props.sta.addFlag ?
                                            this.props.sta.selectedRows.length > 0 ? this.props.sta.selectedRows[0].orgType : ''
                                            : '',
                                    })(
                                        <Select placeholder="请选择">
                                            {Common_orgTypeCode}
                                        </Select>
                                    )
                                }
                            </FormItem>,
                            <FormItem {...formItemLayout} label="负责人" key={5}>
                                {
                                    getFieldDecorator('master', {
                                        initialValue: !this.props.sta.addFlag ?
                                            this.props.sta.selectedRows.length > 0 ? this.props.sta.selectedRows[0].master : ''
                                            : '',
                                    })
                                    (<Input />)
                                }
                            </FormItem>

                        ]}
                    </RcInputGroup>
                </Modal>
            </span>
        );
    }
}
export default Form.create()(EditModal);