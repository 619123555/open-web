// import React from 'react'
// import ReactDOM from 'react-dom'
//ReactDOM是由default export导出的    render 是由export导出的
import {
  AutoComplete,
  Button,
  Cascader,
  Checkbox,
  Col,
  Form,
  Icon,
  Input,
  message,
  Row,
  Select,
  Tooltip,
  Upload
} from 'antd';
import '../../../css/rule.css';
import PropTypes from 'prop-types';
import 'isomorphic-fetch';
import Path from 'src/pathConfig'

const FormItem = Form.Item;
const Option = Select.Option;
const AutoCompleteOption = AutoComplete.Option;

const residences = [{
    value: 'zhejiang',
    label: 'Zhejiang',
    children: [{
        value: 'hangzhou',
        label: 'Hangzhou',
        children: [{
            value: 'xihu',
            label: 'West Lake',
        }],
    }],
}, {
    value: 'jiangsu',
    label: 'Jiangsu',
    children: [{
        value: 'nanjing',
        label: 'Nanjing',
        children: [{
            value: 'zhonghuamen',
            label: 'Zhong Hua Men',
        }],
    }],
}];

const props = {
    name: 'file',
  action: Path.BASE_URL + '/order/upload',

    onChange(info) {
        if (info.file.status !== 'uploading') {
            console.log(info.file, info.fileList);
        }
        if (info.file.status === 'done') {
            message.success(`${info.file.name} file uploaded successfully`);
        } else if (info.file.status === 'error') {
            message.error(`${info.file.name} file upload failed.`);
        }
    },
};


//在es6中class仅仅是一个语法糖，不是真正的类，本质上还是构造函数+原型 实现继承
class RegistrationForm extends React.Component {

    //构造方法
    constructor(props) {
        super(props);
        console.log("1、执行了SetIndex构造方法");
    }

    componentWillMount(){
        console.log("2、开始加载数据");
    }
    componentDidMount() {
        console.log("4、组件已经完全挂载到网页");
    }

    /*作用：用来给组件提供组件内部使用的数据
    注意：只有通过class创建的组件才具有状态
    注意：状态是私有的，完全由组件来控制
    注意：不要在 state 中添加 render() 方法中不需要的数据，会影响渲染性能！
    可以将组件内部使用但是不渲染在视图中的内容，直接添加给 this
    */
    state = {
        confirmDirty: false,
        autoCompleteResult: [],
        email: '527693773@qq.com',
    };

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
            }
        });
    }

    handleConfirmBlur = (e) => {
        const value = e.target.value;
        this.setState({ confirmDirty: this.state.confirmDirty || !!value });
    }

    compareToFirstPassword = (rule, value, callback) => {
        const form = this.props.form;
        if (value && value !== form.getFieldValue('password')) {
            callback('Two passwords that you enter is inconsistent!');
        } else {
            callback();
        }
    }

    validateToNextPassword = (rule, value, callback) => {
        const form = this.props.form;
        if (value && this.state.confirmDirty) {
            form.validateFields(['confirm'], { force: true });
        }
        callback();
    }

    handleWebsiteChange = (value) => {
        let autoCompleteResult;
        if (!value) {
            autoCompleteResult = [];
        } else {
            autoCompleteResult = ['.com', '.org', '.net'].map(domain => `${value}${domain}`);
        }
        this.setState({ autoCompleteResult });
    }

    handleBtnClick(arg1, arg2) {
        console.log(arg1 + "   " +arg2);
        //$("#email").val("testemail");
        //this.state.email = 'testemail';
        this.setState({email: 'testemail'});
        console.log(this.state.email)
    }

    handleClick(){
        //this.props.router.push("/test/listExample");
        window.location.href="/online/formExample";
    }

    //跳转页面
    static contextTypes = {
        router: PropTypes.object.isRequired
    };
    test = () => {
        console.log(this.context);
        var data = {id:3,name:"sam", age:36};
        var path = {
            pathname:'/online/manageOrder',
            state:data,
        }
        this.context.router.push(path);
    };

    render() {
        console.log("3、开始渲染");
        const { getFieldDecorator } = this.props.form;
        const { autoCompleteResult } = this.state;

        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 8 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 16 },
            },
        };
        const tailFormItemLayout = {
            wrapperCol: {
                xs: {
                    span: 24,
                    offset: 0,
                },
                sm: {
                    span: 16,
                    offset: 8,
                },
            },
        };
        const prefixSelector = getFieldDecorator('prefix', {
            initialValue: '86',
        })(
            <Select style={{ width: 70 }}>
                <Option value="86">+86</Option>
                <Option value="87">+87</Option>
            </Select>
        );

        const websiteOptions = autoCompleteResult.map(website => (
            <AutoCompleteOption key={website}>{website}</AutoCompleteOption>
        ));

        return (
            <Form onSubmit={this.handleSubmit}>
                {/*label 标签的文本
                required	是否必填，如不设置，则会根据校验规则自动生成
                validateStatus	校验状态，如不设置，则会根据校验规则自动生成，可选：'success' 'warning' 'error' 'validating'*/}
                <FormItem
                    {...formItemLayout}
                    label="Email"
                >
                    {/*getFieldDecorator(id, options) 参数*/}
                    {getFieldDecorator('email', {
                       /*
                        enum	枚举类型	string	-
                        len	字段长度	number	-
                        max	最大长度	number	-
                        message	校验文案	string|ReactNode	-
                        min	最小长度	number	-
                        pattern	正则表达式校验	RegExp	-
                        required	是否必选	boolean	false
                        transform	校验前转换字段值	function(value) => transformedValue:any	-
                        type	内建校验类型，可选项	string	'string'
                        validator	自定义校验（注意，callback 必须被调用）	function(rule, value, callback)	-
                        whitespace	必选时，空格是否会被视为错误	boolean	false*/
                        rules: [{
                            type: 'email', message: 'The input is not valid E-mail!',
                        }, {
                            required: true, message: 'Please input your E-mail!',
                        }],
                        initialValue:this.state.email,
                    })(
                        <Input />
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="Password"
                >
                    {getFieldDecorator('password', {
                        rules: [{
                            required: true, message: 'Please input your password!',
                        }, {
                            validator: this.validateToNextPassword,
                        }],
                    })(
                        <Input type="password" />
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="Confirm Password"
                >
                    {getFieldDecorator('confirm', {
                        rules: [{
                            required: true, message: 'Please confirm your password!',
                        }, {
                            validator: this.compareToFirstPassword,
                        }],
                    })(
                        <Input type="password" onBlur={this.handleConfirmBlur} />
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label={(
                        <span>
              Nickname&nbsp;
                            <Tooltip title="What do you want others to call you?">
                <Icon type="question-circle-o" />
              </Tooltip>
            </span>
                    )}
                >
                    {getFieldDecorator('nickname', {
                        rules: [{ required: true, message: 'Please input your nickname!', whitespace: true }],
                    })(
                        <Input />
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="Habitual Residence"
                >
                    {getFieldDecorator('residence', {
                        initialValue: ['zhejiang', 'hangzhou', 'xihu'],
                        rules: [{ type: 'array', required: true, message: 'Please select your habitual residence!' }],
                    })(
                        <Cascader options={residences} />
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="Phone Number"
                >
                    {getFieldDecorator('phone', {
                        rules: [{ required: true, message: 'Please input your phone number!' }],
                    })(
                        <Input addonBefore={prefixSelector} style={{ width: '100%' }} />
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="Website"
                >
                    {getFieldDecorator('website', {
                        rules: [{ required: true, message: 'Please input website!' }],
                    })(
                        <AutoComplete
                            dataSource={websiteOptions}
                            onChange={this.handleWebsiteChange}
                            placeholder="website"
                        >
                            <Input />
                        </AutoComplete>
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="Captcha"
                    extra="We must make sure that your are a human."
                >
                    <Row gutter={8}>
                        <Col span={12}>
                            {getFieldDecorator('captcha', {
                                rules: [{ required: true, message: 'Please input the captcha you got!' }],
                            })(
                                <Input />
                            )}
                        </Col>
                        <Col span={12}>
                            <Button>Get captcha</Button>
                        </Col>
                    </Row>
                </FormItem>
                <FormItem {...tailFormItemLayout}>
                    {getFieldDecorator('agreement', {
                        valuePropName: 'checked',
                    })(
                        <Checkbox>I have read the <a href="">agreement</a></Checkbox>
                    )}
                </FormItem>
                <FormItem {...tailFormItemLayout}>
                    {/*disabled	按钮失效状态	boolean	false
                    href	点击跳转的地址，指定此属性 button 的行为和 a 链接一致	string	-
                    htmlType	设置 button 原生的 type 值，可选值请参考 HTML 标准
                    onClick	点击按钮时的回调*/}
                    <Button type="primary" htmlType="submit">Register</Button>&nbsp;
                    <Button onClick={this.handleBtnClick.bind(this, 'abc', [1, 2])}>changeEmail</Button>&nbsp;
                    <Button onClick={this.handleClick.bind()}>href</Button>&nbsp;
                    <Button onClick={this.test}>router</Button>
                    <Upload {...props}>
                        <Button>
                            <Icon type="upload" /> Click to Upload
                        </Button>
                    </Upload>
                </FormItem>
            </Form>
        );
    }
}

const WrappedRegistrationForm = Form.create()(RegistrationForm);

export default class SetIndex extends React.Component {
    //构造方法
    constructor(props) {
        super(props);
        this.state = {
            pageTotal: 0,       //当前数据的总条数
            data: [],
        }
        //console.log("1、执行了SetIndex构造方法");
    }

    componentWillMount(){
        //console.log("2、开始加载数据");
    }
    componentDidMount() {
        //console.log("4、组件已经完全挂载到网页");
    }

    render() {
        //console.log("3、开始渲染");
        return (
            <Row>
                <Col span={14}>
                    <WrappedRegistrationForm ref="wrappedRegistrationForm" sta={this.state}/>
                </Col>
                <Col span={10}></Col>
            </Row>
        )
    }
}


// ReactDOM.render(<WrappedRegistrationForm />, document.getElementById('app'));