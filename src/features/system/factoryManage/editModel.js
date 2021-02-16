import {
    Button,
    Form,
    Icon,
    Input,
    message,
    Modal,
    Select,
    Tree,
    Upload
} from 'antd';
import Fetch from '../subfetch';
import {RcInputGroup} from 'testantd'

const FormItem = Form.Item;
const TreeNode = Tree.TreeNode;

class EditRole extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            hiddenIntegral: false,
            selectedKeys: [],
            fileList: [
                {
                    uid: '-1',
                    name: '浏览',
                    status: 'done',
                    url: this.props.sta.selectedRows[0].productLogo,
                }
            ],
            backGroundList: [
                {
                    uid: '-2',
                    name: '浏览',
                    status: 'done',
                    url: this.props.sta.selectedRows[0].wsBackgroundImg,
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
            editModelVisible: false,
            selectedKeys: [],
            selectedRowKeys: []
        })
    };
    // 控制积分显示
    handChangeIntegral = (e) => {
        if ('P0003' == e) {
            this.setState({
                hiddenIntegral: false
            }, this.hiddenIntegral)
        } else {
            this.setState({
                hiddenIntegral: true
            }, this.hiddenIntegral)
        }
    }

    componentDidMount() {
        let e = this.props.sta.selectedRows[0].productType;
        if ('P0003' == e) {
            this.setState({
                hiddenIntegral: false
            }, this.hiddenIntegral)
        } else {
            this.setState({
                hiddenIntegral: true
            }, this.hiddenIntegral)
        }
    }

    handleChange = info => {
        let fileList = [...info.fileList];
        fileList = fileList.slice(-1);
        fileList = fileList.map(file => {
            if (file.response && file.response.code == 200) {
                file.url = file.response.data.url;
                file.name = file.response.data.imageName;
                file.id = file.response.data.id;
                console.log(file.response.data.url);
                //this.props.sta.selectedRows[0].productLogo = file.response.data.url;
                this.props.form.setFieldsValue({productLogo: file.response.data.url});
            }
            return file;
        });
        this.setState({fileList});
    };

    handleBackGroundChange = info => {
        let backGroundList = [...info.fileList];
        backGroundList = backGroundList.slice(-1);
        backGroundList = backGroundList.map(file => {
            if (file.response && file.response.code == 200) {
                file.url = file.response.data.url;
                file.name = file.response.data.imageName;
                file.id = file.response.data.id;
                console.log(file.response.data.url);
                //this.props.sta.selectedRows[0].productLogo = file.response.data.url;
                this.props.form.setFieldsValue(
                    {wsBackgroundImg: file.response.data.url});
            }
            return file;
        });
        this.setState({backGroundList});
    };
    handleShareImagesChange = info => {
        let shareImagesList = [...info.fileList];
        shareImagesList = shareImagesList.slice(-1);
        shareImagesList = shareImagesList.map(file => {
            if (file.response && file.response.code == 200) {
                file.url = file.response.data.url;
                file.name = file.response.data.imageName;
                file.id = file.response.data.id;
                console.log(file.response.data.url);
                this.props.form.setFieldsValue(
                    {shareImage: file.response.data.url});
            }
            return file;
        });
        this.setState({shareImagesList});
    };

    onCheck = (checkedKeys) => {
        this.setState({
            selectedKeys: checkedKeys
        });
    }


    okHandler() {
        this.props.form.validateFields((err, values) => {
            console.log(values);
            if (!err) {
                values.id = this.props.sta.selectedRows[0].id;
                Fetch.getInstance().postWithRequestData("terminalFactory/editFactory", {
                    requestData: values,
                }).then((data) => {
                    const {code, messages} = data;
                    if (code === 200) {
                        message.success('修改成功', 5);
                        this.hideModelHandler();
                        this.props.getListData();
                    }
                }), (error) => {
                    console.log("错误信息:" + messages);
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
        const props = {
            action: Fetch.getInstance().BASE_URL + 'product/uploadLogo',
            onChange: this.handleChange,
            multiple: true,
        };
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
                <Modal title="厂商信息编辑"
                    /* 点击对话框外是否允许关闭 false:不予许关闭 */
                       maskClosable={false}
                       visible={this.props.sta.editModelVisible} width={800}
                    /*此处注意用法区别，注意看：一个用了bind绑定了this，另一个未使用，再对应函数去查看区别用法*/
                       onOk={this.okHandler.bind(this)}
                       onCancel={this.hideModelHandler}>
                    <RcInputGroup inputHeight={300}>
                        {[
                            <FormItem {...formItemLayout} label="机具型号" key={1}>
                                {
                                    getFieldDecorator('modelNo', {
                                        rules: [{required: true, message: '不能为空'}],
                                        initialValue: !this.props.sta.addFlag
                                            ? this.props.sta.selectedRows.length > 0
                                                ? this.props.sta.selectedRows[0].modelNo: '': '',
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
                                        initialValue: !this.props.sta.addFlag
                                            ? this.props.sta.selectedRows.length > 0
                                                ? this.props.sta.selectedRows[0].componentName: '': '',
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
                                        initialValue: !this.props.sta.addFlag
                                            ? this.props.sta.selectedRows.length > 0
                                                ? this.props.sta.selectedRows[0].commuType: '': '',
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
                                        initialValue: !this.props.sta.addFlag
                                            ? this.props.sta.selectedRows.length > 0
                                                ? this.props.sta.selectedRows[0].factoryCode: '': '',
                                    })
                                    (<Input placeholder={'如：newland'}/>)
                                }
                            </FormItem>,
                            <FormItem {...formItemLayout} label="厂商简称" key={4}>
                                {
                                    getFieldDecorator('factoryShortName', {
                                        rules: [{required: true, message: '不能为空'}],
                                        initialValue: !this.props.sta.addFlag
                                            ? this.props.sta.selectedRows.length > 0
                                                ? this.props.sta.selectedRows[0].factoryShortName: '': '',
                                    })
                                    (<Input placeholder={'如：新大陆'}/>)
                                }
                            </FormItem>,
                            <FormItem {...formItemLayout} label="厂商全称" key={4}>
                                {
                                    getFieldDecorator('factoryFullName', {
                                        rules: [{required: true, message: '不能为空'}],
                                        initialValue: !this.props.sta.addFlag
                                            ? this.props.sta.selectedRows.length > 0
                                                ? this.props.sta.selectedRows[0].factoryFullName: '': '',
                                    })
                                    (<Input placeholder={'如：北京新大陆科技有限生产中心'}/>)
                                }
                            </FormItem>,
                            <FormItem {...formItemLayout} label="" key={3}>
                                {
                                    getFieldDecorator('version', {
                                        rules: [{required: true, message: '不能为空'}],
                                        initialValue: !this.props.sta.addFlag
                                            ? this.props.sta.selectedRows.length > 0
                                                ? this.props.sta.selectedRows[0].version: '': '',
                                    })
                                    (<Input type={'hidden'}/>)
                                }
                            </FormItem>,
                        ]}
                    </RcInputGroup>
                </Modal>
            </span>
        );
    }
}


export default Form.create()(EditRole);