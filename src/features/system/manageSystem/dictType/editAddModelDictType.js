/**
 * Created by zhl on 2017-6-9.
 */
import {Form, Input, message, Modal, Select} from 'antd';
import Fetch from '../../subfetch';
import {RcInputGroup} from 'testantd'
import globalConfig from '../../../../config.js';

const FormItem = Form.Item;
const Option = Select.Option;

class EditAddModal extends React.Component {
    constructor(props) {
        super(props);
    }
    hideModelHandler =()=>{
        this.props.setState({
            editAddModelVisible: false
        })
        this.props.form.resetFields();
    };

    okHandler(){
        this.props.form.validateFields((err, values) => {
            if (!err) {
                if(!this.props.sta.addFlag) {   //修改
                    values['id'] = this.props.sta.selectedRows[0].id;
                    values['status'] = this.props.sta.selectedRows[0].status;
                }else {
                    values['status'] = '1';
                }
                values['label'] = values['labelName'];
                Fetch.getInstance().postWithRequestData("dict/type/saveDictTypeData", {
                  requestData: values
                }).then((data)=> {
                  if (data.code == 200) {
                    console.log("==================")
                        this.props.getListData();
                        this.hideModelHandler();
                        if(this.props.sta.addFlag) {   //修改
                            this.props.getDictKey();
                        }
                    }

                }), (error)=> {
                    console.log("错误信息:" + message);
                }
            }
        });
    };

    render() {
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: {span: 9},
            wrapperCol: {span: 15},
        };
        let Options = this.props.sta.Common_DictScope != null ?
            this.props.sta.Common_DictScope.map(d => <Option title={d.value} key={d.value}>{d.label}</Option>)
            : null;
        return (
            <span>
                <Modal title="修改字典类型"
                    /* 点击对话框外是否允许关闭 false:不予许关闭 */
                       maskClosable={false} visible={this.props.sta.editAddModelVisible} width={600}
                    /*此处注意用法区别，注意看：一个用了bind绑定了this，另一个未使用，再对应函数去查看区别用法*/
                       onOk={this.okHandler.bind(this)} onCancel={this.hideModelHandler} >
                    <RcInputGroup inputHeight={300} colNum={1}>
                        {[
                            <FormItem {...formItemLayout} label="字典类型名" key={1}>
                                {
                                    getFieldDecorator('labelName', {
                                        rules: [
                                            { required: true,message: '不能为空'},
                                            { pattern:globalConfig.regexpString.default.limitCnEnNum,message:'输入有误'}
                                        ],
                                        initialValue: !this.props.sta.addFlag ?
                                            this.props.sta.selectedRows.length > 0 ? this.props.sta.selectedRows[0].label : ''
                                            : '',
                                    })
                                    (<Input />)
                                }
                            </FormItem>,
                            <FormItem {...formItemLayout} label="字典类型值" key={2}>
                                {
                                    getFieldDecorator('value', {
                                        rules: [ { required: true,message: '不能为空' }
                                        ],
                                        initialValue: !this.props.sta.addFlag ?
                                            this.props.sta.selectedRows.length > 0 ? this.props.sta.selectedRows[0].value : ''
                                            : '',
                                    })
                                    (<Input />)
                                }
                            </FormItem>,
                            <FormItem {...formItemLayout} label="适用范围" key={3}>
                                {
                                    getFieldDecorator('scope', {
                                        rules: [ { required: true,message: '不能为空' } ,
                                            { pattern:globalConfig.regexpString.limitCnEnNum,message:'输入有误'}
                                        ],
                                        initialValue: !this.props.sta.addFlag ?
                                            this.props.sta.selectedRows.length > 0 ? this.props.sta.selectedRows[0].scope : ''
                                            : '',
                                    })
                                    (
                                        <Select>
                                            {Options}
                                        </Select>
                                    )
                                }
                            </FormItem>,
                            <FormItem {...formItemLayout} label="描述" key={4}>
                                {
                                    getFieldDecorator('description',{
                                        initialValue: !this.props.sta.addFlag ?
                                            this.props.sta.selectedRows.length > 0 ? this.props.sta.selectedRows[0].description : ''
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
export default Form.create()(EditAddModal);