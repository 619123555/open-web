/**
 * Created by zhl on 2017-6-9.
 */
/**
 * Created by zhl on 2017-6-9.
 */
import {Modal, Form, Input, Select } from 'antd';
import Fetch from '../../subfetch';
import {RcInputGroup,RcCol} from 'testantd'
const FormItem = Form.Item;
const Option = Select.Option;

class EditAddModal extends React.Component {
    constructor(props) {
        super(props);
    }
    hideModelHandler =()=>{
        this.props.setState({
            dictConfModelVisible: false
        })
        this.props.form.resetFields();
    };

    okHandler(){
        this.props.form.validateFields((err, values) => {
            if (!err) {
                values['dictId'] = this.props.sta.selectedRows[0].id;
                values['fid'] = this.props.sta.fid;
                values['channelOrgCode'] = values['channelOrgCode'].toString();
                Fetch.getInstance().postWithRequestData("filtration/saveDictFiltrationData", {
                    requestData: values,
                    urlType: "BASE_URL"
                }).then((data)=> {
                    const {status} = data.data;
                    if (status == 200) {
                        this.hideModelHandler();
                        this.props.getListData();
                    }
                })
            }
        });
    };


    render() {
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: {span: 9},
            wrapperCol: {span: 15},
        };
        let changnelCds = this.props.sta.orgData != null ?
            this.props.sta.orgData.map(pos => <Option value={pos.id} key={pos.id}>{pos.name}</Option>)
            : null;
        return (
            <span>
                <Modal title="字典项过滤"
                    /* 点击对话框外是否允许关闭 false:不予许关闭 */
                       maskClosable={false} visible={this.props.sta.dictConfModelVisible} width={600}
                    /*此处注意用法区别，注意看：一个用了bind绑定了this，另一个未使用，再对应函数去查看区别用法*/
                       onOk={this.okHandler.bind(this)} onCancel={this.hideModelHandler} >
                    <RcInputGroup inputHeight={400} colNum={1}>
                        {[
                            <RcCol rcLayout="singleColumn" rcSpan={0} key={0}>
                                <FormItem {...formItemLayout} label="id" key={111}>
                                    {
                                        getFieldDecorator('id', {
                                            initialValue: this.props.sta.selectedRows.length > 0 ? this.props.sta.selectedRows[0].id : null
                                        })
                                        (<Input />)
                                    }
                                </FormItem>,
                            </RcCol>,
                            <FormItem {...formItemLayout} label="字典类型名称" key={1}>
                                {
                                    getFieldDecorator('type.label', {
                                        initialValue: this.props.sta.selectedRows.length > 0 ? this.props.sta.selectedRows[0].type.label : '',
                                    })
                                    (<Input disabled={true}/>)
                                }
                            </FormItem>,
                            <FormItem {...formItemLayout} label="字典类型值" key={1}>
                                {
                                    getFieldDecorator('dictType', {
                                        initialValue: this.props.sta.selectedRows.length > 0 ? this.props.sta.selectedRows[0].type.value : '',
                                    })
                                    (<Input disabled={true}/>)
                                }
                            </FormItem>,
                            <FormItem {...formItemLayout} label="字典项名称" key={2}>
                                {
                                    getFieldDecorator('type.value', {
                                        initialValue: this.props.sta.selectedRows.length > 0 ? this.props.sta.selectedRows[0].label : '',
                                    })
                                    (<Input disabled={true}/>)
                                }
                            </FormItem>,
                            <FormItem {...formItemLayout} label="字典项值" key={3}>
                                {
                                    getFieldDecorator('scope', {
                                        initialValue: this.props.sta.selectedRows.length > 0 ? this.props.sta.selectedRows[0].value : '',
                                    })
                                    (<Input disabled={true}/>)
                                }
                            </FormItem>,
                            <FormItem {...formItemLayout} label="过滤类型" key={4}>
                                {
                                    getFieldDecorator('includeType', {
                                        rules: [
                                            { required: true,message: '不能为空' }
                                        ],
                                        initialValue: this.props.sta.includeType,
                                    })
                                    (
                                        <Select placeholder="请选择">
                                            <Option value="1" key="1">包含</Option>
                                            <Option value="2" key="2">不包含</Option>
                                        </Select>
                                    )
                                }
                            </FormItem>,
                            <FormItem {...formItemLayout} label="过滤机构" key={5}>
                                {
                                    getFieldDecorator('channelOrgCode', {
                                        rules: [
                                            { required: true,message: '不能为空' }
                                        ],
                                        initialValue: this.props.sta.channelOrgCode,
                                    })
                                    (
                                        <Select  mode="multiple" showSearch
                                            placeholder="请选择">
                                            {changnelCds}
                                        </Select>
                                    )
                                }
                            </FormItem>
                        ]}
                    </RcInputGroup>
                </Modal>
            </span>
        );
    }
}
export default Form.create()(EditAddModal);