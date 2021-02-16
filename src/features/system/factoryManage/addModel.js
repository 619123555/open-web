import {
    Button,
    Form,
    Icon,
    Input,
    message,
    Modal,
    Select,
    TreeSelect,
    Upload
} from 'antd';
import Fetch from '../subfetch';
import {RcInputGroup} from 'testantd'

const FormItem = Form.Item;
const Option = Select.Option;
const TreeNode = TreeSelect.TreeNode;

class AddModal extends React.Component {
    constructor(props) {
        super(props);
        // this.handChangeIntegral = this.handChangeIntegral.bind(this)
        this.state = {
            hiddenIntegral: false,
            isShow: false,
            fileList: [
                {
                    uid: '-1',
                    name: '未上传',
                    status: 'done',
                    url: '',
                }
            ],
            backGroundList: [
                {
                    uid: '-2',
                    name: '浏览',
                    status: 'done',
                    url: '',
                }
            ],
            shareImagesList: [
                {
                    uid: '-1',
                    name: '未上传',
                    status: 'done',
                    url: '',
                }
            ],
        }
    }
    hideModelHandler = () => {
        this.props.setState({
            editAddModelVisible: false
        })
    };
    // 控制积分输入页面
    // handChangeIntegral = (e) => {
    //     console.log(this.state)
    //     if ('P0003' == e) {
    //         this.setState({
    //             hiddenIntegral: false
    //         }, this.hiddenIntegral)
    //     } else {
    //         this.setState({
    //             hiddenIntegral: true
    //         }, this.hiddenIntegral)
    //     }
    // }

    handleChange = info => {
        let fileList = [...info.fileList];
        fileList = fileList.slice(-1);
        fileList = fileList.map(file => {
            if (file.response && file.response.code == 200) {
                file.url = file.response.data.url;
                file.name = file.response.data.imageName;
                file.id = file.response.data.id;
                console.log(file.response.data.url);
                this.props.form.setFieldsValue({productLogo: file.response.data.url});
            }
            return file;
        });
        this.setState({fileList});
    };
    // handleBackGroundChange = info => {
    //     let backGroundList = [...info.fileList];
    //     backGroundList = backGroundList.slice(-1);
    //     backGroundList = backGroundList.map(file => {
    //         if (file.response && file.response.code == 200) {
    //             file.url = file.response.data.url;
    //             file.name = file.response.data.imageName;
    //             file.id = file.response.data.id;
    //             console.log(file.response.data.url);
    //             this.props.form.setFieldsValue(
    //                 {wsBackgroundImg: file.response.data.url});
    //         }
    //         return file;
    //     });
    //     this.setState({backGroundList});
    // };
    // handleShareImagesChange = info => {
    //     let shareImagesList = [...info.fileList];
    //     shareImagesList = shareImagesList.slice(-1);
    //     shareImagesList = shareImagesList.map(file => {
    //         if (file.response && file.response.code == 200) {
    //             file.url = file.response.data.url;
    //             file.name = file.response.data.imageName;
    //             file.id = file.response.data.id;
    //             console.log(file.response.data.url);
    //             this.props.form.setFieldsValue(
    //                 {shareImage: file.response.data.url});
    //         }
    //         return file;
    //     });
    //     this.setState({shareImagesList});
    // };
    //提交表单
    okHandler() {
        this.props.form.validateFields((err, values) => {
            if (!err) {
                if (values.isShow == true) {
                    values.isShow = 1;
                } else {
                    values.isShow = 0;
                }
                if (this.props.sta.addFlag) { //新增终端设备
                    Fetch.getInstance().postWithRequestData("terminalFactory/addFactory", {
                        requestData: values
                    }).then((data) => {
                        if (data.code == 200) {
                            //重新清空输入框
                            this.props.form.resetFields();
                            message.success("新增成功");
                            this.hideModelHandler();
                            this.props.getListData();
                        } else {
                            message.error('新增错误:' + data.message, 5);
                        }
                    }), (error) => {
                        console.log("系统内部错误");
                    }
                }
            } else {
                message.warn('数据格式有误', 5);
            }
        });
    };

    render() {
        const {getFieldDecorator} = this.props.form;
        const formItemLayout = {
            labelCol: {span: 9},
            wrapperCol: {span: 15},
        };
        // const uploadLogo = {
        //     action: Fetch.getInstance().BASE_URL + 'product/uploadLogo',
        //     onChange: this.handleChange,
        //     multiple: true,
        // };
        // const backGroundProps = {
        //     action: Fetch.getInstance().BASE_URL + 'product/uploadLogo',
        //     onChange: this.handleBackGroundChange,
        //     multiple: false,
        // };
        // const shareImagesUpload = {
        //     action: Fetch.getInstance().BASE_URL + 'product/uploadLogo',
        //     onChange: this.handleShareImagesChange,
        //     multiple: false,
        // };
        return (
            <span>
                <Modal title="添加终端厂商"
                       maskClosable={false}
                       visible={this.props.sta.editAddModelVisible} width={600}
                       onOk={this.okHandler.bind(this)}
                       onCancel={this.hideModelHandler}>
                    <RcInputGroup inputHeight={200}>
                        {[
                            <FormItem {...formItemLayout} label="机具型号" key={1}>
                                {
                                    getFieldDecorator('modelNo', {
                                        rules: [{required: true, message: '不能为空'}],
                                        initialValue: !this.props.sta.addFlag
                                            ? this.props.sta.selectedRows.length > 0
                                                ? this.props.sta.selectedRows[0].factoryId: '': '',
                                    })
                                    (
                                        <Select showSearch placeholder="请选择">
                                            <Option value='S98' key='0'>S98</Option>
                                        </Select>
                                    )
                                }
                            </FormItem>,
                            <FormItem {...formItemLayout} label="机具名称" key={2}>
                                {
                                    getFieldDecorator('modelName', {
                                        rules: [{required: true, message: '不能为空'}],
                                        initialValue: !this.props.sta.addFlag
                                            ? this.props.sta.selectedRows.length > 0
                                                ? this.props.sta.selectedRows[0].modelName: '': '',
                                    })
                                    (<Select showSearch placeholder="请选择">
                                        <Option value='M35' key='0'>M35</Option>
                                    </Select>)
                                }
                            </FormItem>,
                            <FormItem {...formItemLayout} label="组件名称" key={3}>
                                {
                                    getFieldDecorator('componentName', {
                                        rules: [{required: true, message: '不能为空'}],
                                    })
                                    (<Select showSearch placeholder="请选择">
                                        <Option value='POS' key='0'>POS</Option>
                                        <Option value='大pos' key='0'>大pos</Option>
                                        <Option value='MPOS' key='0'>MPOS</Option>
                                        <Option value='BATTERY' key='0'>电池</Option>
                                        <Option value='POWER_ADAPTER' key='0'>电源适配器</Option>
                                        <Option value='PIN_PAD' key='0'>密码键盘</Option>
                                        <Option value='SIM' key='0'>SIM卡</Option>
                                    </Select>)
                                }
                            </FormItem>,
                            <FormItem {...formItemLayout} label="CDMA" key={3}>
                                {
                                    getFieldDecorator('commuType', {
                                        rules: [{required: true, message: '不能为空'}],
                                    })
                                    (<Select showSearch placeholder="请选择">
                                        <Option value='GPRS' key='0'>中国电信</Option>
                                        <Option value='TD' key='0'>中国移动2G，中国联通2G</Option>
                                        <Option value='CDMA2000' key='0'>中国移动3G</Option>
                                        <Option value='WCDMA' key='0'>中国电信3G</Option>
                                        <Option value='TCPIP' key='0'>中国联通3G</Option>
                                        <Option value='MODEM' key='0'>网线</Option>
                                        <Option value='BLUETOOTH' key='0'>蓝牙</Option>
                                    </Select>)
                                }
                            </FormItem>,
                            <FormItem {...formItemLayout} label="厂商代码" key={4}>
                                {
                                    getFieldDecorator('factoryCode', {
                                        rules: [{required: true, message: '不能为空'}],
                                    })
                                    (<Input placeholder={'如：newland'}/>)
                                }
                            </FormItem>,
                            <FormItem {...formItemLayout} label="厂商简称" key={4}>
                                {
                                    getFieldDecorator('factoryShortName', {
                                        rules: [{required: true, message: '不能为空'}],
                                    })
                                    (<Input placeholder={'如：新大陆'}/>)
                                }
                            </FormItem>,
                            <FormItem {...formItemLayout} label="厂商全称" key={4}>
                                {
                                    getFieldDecorator('factoryFullName', {
                                        rules: [{required: true, message: '不能为空'}],
                                    })
                                    (<Input placeholder={'如：北京新大陆科技有限生产中心'}/>)
                                }
                            </FormItem>,
                            <FormItem {...formItemLayout} label="厂商主密钥Key" key={4}>
                                {
                                    getFieldDecorator('factoryKey', {
                                        rules: [{required: true, message: '不能为空'}],
                                    })
                                    (<Input placeholder={'厂商提供的一串密钥'}/>)
                                }
                            </FormItem>,
                        ]}
                    </RcInputGroup>
                </Modal>
            </span>
        );
    }
}


export default Form.create()(AddModal);