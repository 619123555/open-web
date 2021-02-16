import {Form, Input, Modal, Select} from 'antd';
import Fetch from '../../subfetch';
import {RcCol, RcInputGroup} from 'testantd'
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
        });
        this.props.form.resetFields();
    };

  componentDidMount() {
    console.log("===111====");
  }

  componentWillMount() {
    console.log("=======");
  }

    okHandler(){
        this.props.form.validateFields((err, values) => {
            if (!err) {
              if (!this.props.sta.addFlag) {
                //修改
                    values['status'] = this.props.sta.selectedRows[0].status;
                    values['id'] = this.props.sta.selectedRows[0].id;
                    values['sort'] = '1';
              } else {
                //新增
                    values['status'] = '1';
                    values['sort'] = '1';
                }
              values['type'] = this.props.sta.selDictValue;
              console.log(values);
                Fetch.getInstance().postWithRequestData("dict/saveDictData", {
                  requestData: values
                }).then((data)=> {
                  if (data.code == 200) {
                        this.hideModelHandler();
                        this.props.getListData();
                    }
                });
            }
        });
    };

    render() {
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: {span: 9},
            wrapperCol: {span: 15},
        };
        return (
            <span>
                <Modal title="修改字典"
                       maskClosable={false} visible={this.props.sta.editAddModelVisible} width={500}
                       onOk={this.okHandler.bind(this)} onCancel={this.hideModelHandler} >
                    <RcInputGroup inputHeight={300} colNum={1}>
                        {[
                            <RcCol rcLayout="singleColumn" rcSpan={0} key={0}>
                                <FormItem {...formItemLayout} label="id">
                                    {
                                        getFieldDecorator('id', {
                                            initialValue: !this.props.sta.addFlag ?
                                                this.props.sta.selectedRows.length > 0 ? this.props.sta.selectedRows[0].id : null
                                                : null,
                                        })
                                        (<Input />)
                                    }
                                </FormItem>,
                            </RcCol>,
                            <FormItem {...formItemLayout} label="字典类型名" key={1}>
                                {
                                  getFieldDecorator('type.lable', {
                                      initialValue: !this.props.sta.addFlag
                                          ? this.props.sta.selectedRows.length
                                          > 0
                                              ? this.props.sta.selectedRows[0].type
                                              : ''
                                          : this.props.sta.selDictLaber != null
                                              ? this.props.sta.selDictLaber
                                              : null,
                                    })
                                    (<Input  disabled={true}/>)
                                }
                            </FormItem>,
                            <FormItem {...formItemLayout} label="字典类型值" key={2}>
                                {
                                  getFieldDecorator('type', {
                                      initialValue: !this.props.sta.addFlag
                                          ? this.props.sta.selectedRows.length
                                          > 0
                                              ? this.props.sta.selectedRows[0].value
                                              : ''
                                          : this.props.sta.selDictValue != null
                                              ? this.props.sta.selDictValue
                                              : null,
                                    })
                                    (<Input disabled={true}/>)
                                }
                            </FormItem>,
                            <FormItem {...formItemLayout} label="字典项名" key={5}>
                                {
                                  getFieldDecorator('dictType.label', {
                                        rules: [ { required: true,message: '不能为空' },
                                            { pattern:globalConfig.regexpString.default.limitCnEnNum,message:'输入有误'}
                                        ],
                                        initialValue: !this.props.sta.addFlag ?
                                            this.props.sta.selectedRows.length > 0 ? this.props.sta.selectedRows[0].label : ''
                                            : '',
                                    })
                                    (<Input />)
                                }
                            </FormItem>,
                            <FormItem {...formItemLayout} label="字典项值" key={6}>
                                {
                                  getFieldDecorator('dictType.value', {
                                        rules: [ { required: true,message: '不能为空' },
                                            { pattern:globalConfig.regexpString.default.limitCnEnNum,message:'输入有误'}
                                        ],
                                        initialValue: !this.props.sta.addFlag ?
                                            this.props.sta.selectedRows.length > 0 ? this.props.sta.selectedRows[0].value : ''
                                            : '',
                                    })
                                    (<Input />)
                                }
                            </FormItem>,
                            <FormItem {...formItemLayout} label="描述" key={7}>
                                {
                                    getFieldDecorator('description',{
                                        initialValue: !this.props.sta.addFlag ?
                                            this.props.sta.selectedRows.length > 0 ? this.props.sta.selectedRows[0].description : ''
                                            : '',
                                    })
                                    (<Input />)
                                }
                            </FormItem>,
                        ]}
                    </RcInputGroup>
                </Modal>
            </span>
        );
    }
}
export default Form.create()(EditAddModal);