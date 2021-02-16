/**
 * 修改密码公共Model
 */
import {Form, Input, message, Modal} from 'antd';
import Fetch from 'utils/fetch.js';
import {RcInputGroup} from 'testantd'

const FormItem = Form.Item;

class UpdatePassword extends React.Component {
    constructor(props) {
        super(props);
    }

    hideModelHandler = ()=> {
        this.props.setState({
            passwordModelVisible: false
        })
        this.props.form.resetFields();
    };

    okHandler() {
        this.props.form.validateFields((err, values) => {
            if (!err) {
                Fetch.getInstance().postWithRequestData("system/user/updatePassword", {
                    requestData: values
                }).then((data) => {
                  if (data.code == 200) {
                        message.success(data.message);
                        this.props.form.resetFields();
                        this.hideModelHandler();
                    } else {
                        message.error(data.message);
                    }
                })
            } else {
                message.warn('数据格式有误');
            }
        });
    };

    checkPassword = (rule, value, callback) => {
        const form = this.props.form;
        if (value && value !== form.getFieldValue('newPassword')) {
            callback('两次密码输入不一致!');
        } else {
            callback();
        }
    }

    render() {
        const {getFieldDecorator} = this.props.form;
        const formItemLayout = {
            labelCol: {span: 7},
            wrapperCol: {span: 17},
        };
        return (
            <span>
                <Modal title="修改密码"
                       maskClosable={false} visible={this.props.sta.passwordModelVisible} width={400}
                       onOk={this.okHandler.bind(this)} onCancel={this.hideModelHandler}>
                    <RcInputGroup inputHeight={172} colNum={1}>
                        {[
                            <FormItem {...formItemLayout} label="原密码" key={100}>
                                {
                                    getFieldDecorator('oldPassword', {
                                        rules: [{required: true, message: '原密码不能为空'}],
                                    })
                                    (<Input type="password" placeholder="输入旧密码"/>)
                                }
                            </FormItem>,
                            <FormItem {...formItemLayout} label="新密码" key={101}>
                                {
                                    getFieldDecorator('newPassword', {
                                        rules: [{required: true, message: '新密码不能为空'}],
                                    })
                                    (<Input type="password" placeholder="输入新密码"/>)
                                }
                            </FormItem>,
                            <FormItem {...formItemLayout} label="确认密码" key={102}>
                                {
                                    getFieldDecorator('password', {
                                        rules: [{required: true, message: '确认密码不能为空'}, {
                                            validator: this.checkPassword,
                                        }],
                                    })
                                    (<Input type="password" placeholder="输入确认密码"/>)
                                }
                            </FormItem>
                        ]}
                    </RcInputGroup>
                </Modal>
            </span>
        );
    }
}
export default Form.create()(UpdatePassword);