import {Modal, Form, Input, message,Button} from 'antd';
const FormItem = Form.Item;
import Fetch from '../../subfetch';
import {RcInputGroup} from 'testantd'
import '../../../../css/manageInformation.css';
import RecipientsModel from './recipientsModel.js';


class EditModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            addRecipientsVisible:false,  //接收人弹框
            addRecipOrgVisible : false,  //接收机构弹框
            selectedIdList:[],
            selectedRecipName:'',
            content: '请填写内容！'

        }
    }

    handleRecipients(){
        this.setState({
            addRecipientsVisible: true,
        });
    }
    handleReciOrg(){
        this.setState({
            addRecipOrgVisible: true,
        });
    }

    clearFormValue(){
        this.setState({
            selectedIdList:[],
            selectedRecipName:'',
        });

        this.refs.recipientsModel.reSetState();
        this.props.form.resetFields();
    }

    okHandler(){
        this.props.form.validateFields((err, values) => {
            if (this.state.selectedIdList == [] || this.state.selectedIdList.length <= 0){
                message.warning('请选择接收人!');
                return;
            }
            if (!err) {
                this.props.setState({
                    addModelVisible: false
                });

                //处理发送邮件和记录
                Fetch.getInstance().postWithRequestData("information/save", {
                    requestData:values,
                    urlType: "BASE_URL"
                }).then((data)=>{
                    console.log("保存发送信息");
                    this.props.getListData();
                }),(error)=>{
                    console.log("111...." + error);
                }

                this.clearFormValue();
            }

        })
    }

    hideModelHandler =()=>{
        this.props.setState({
            addModelVisible: false
        });
        this.clearFormValue();
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: {span: 6},
            wrapperCol: {span: 15},
        };

        return (
            <span>
                <Modal title="发送站内信"
                    /* 点击对话框外是否允许关闭 false:不予许关闭 */
                       maskClosable={false} visible={this.props.sta.addModelVisible} width={920}
                    /*此处注意用法区别，注意看：一个用了bind绑定了this，另一个未使用，再对应函数去查看区别用法*/
                       onOk={this.okHandler.bind(this)} onCancel={this.hideModelHandler} >


                    <RcInputGroup inputHeight={560} colNum={1} >
                        {[
                            <FormItem {...formItemLayout} label="接收人" key={6} >
                                        {getFieldDecorator('showRepectionPerson', {
                                            initialValue : this.state.selectedRecipName
                                        })(
                                        <Input  placeholder="请选择接收人"  disabled = {true} />
                                        )}
                                        <Button size="large" onClick={this.handleRecipients.bind(this)} >选择接收人</Button>
                                        {/*<Button size="large" onClick={this.handleReciOrg.bind(this)} >选择接收机构</Button>*/}
                            </FormItem>,
                            <FormItem {...formItemLayout} label="主题" key={7}>
                                {getFieldDecorator('title', {
                                    rules:
                                        [
                                            { required: true, message: '请填写主题！' },
                                            { max : 100 ,message: '主题长度超过限制！'

                                    }],
                                })(
                                    <Input  />
                                )}
                            </FormItem>,
                            <FormItem {...formItemLayout} label="内容" key={8}>
                                {getFieldDecorator('emailContent', {
                                    rules: [
                                        { required: true, message: '请填写内容！'},
                                        { message: '内容长度超过限制！', max: 1900}
                                    ],
                                    initialValue : this.state.mailTemplate
                                })(
                                    <Input type="textarea" autosize={{ minRows: 6, maxRows: 12 }}/>
                                )}
                            </FormItem>,

                            <FormItem {...formItemLayout}  key={9}>
                                {getFieldDecorator('repectionPersonArray', {
                                    initialValue : this.state.selectedIdList
                                })(
                                    <Input type="hidden" />
                                )}
                            </FormItem>,


                        ]}
                    </RcInputGroup>


                </Modal>
                <RecipientsModel ref="recipientsModel" sta={this.state} setState = {this.setState.bind(this)} />
                {/*<RecipOrgModel ref="recipOrgModel" sta={this.state} setState = {this.setState.bind(this)} />*/}

            </span>
        );
    }
}
export default Form.create()(EditModal);