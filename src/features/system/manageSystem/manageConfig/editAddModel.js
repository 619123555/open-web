import {Form, Input, message, Modal, Select} from 'antd';
import Fetch from '../../subfetch';
import {RcInputGroup} from 'testantd'

const FormItem = Form.Item;
const Option = Select.Option;

class EditModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      organizationTree: null//归属部门树结构
    }
  }

  hideModelHandler = () => {
    this.props.setState({
      editAddModelVisible: false
    })
  };

  componentWillMount() {
    if (!this.props.sta.addFlag) {
      if (this.props.sta.selectedRows.length > 0) {
        //获取配置详情
        Fetch.getInstance().postWithRequestData("conf/showConf", {
          requestData: {id: this.props.sta.selectedRows[0].id}
        }).then((data) => {
          console.log(data);
          if (data.code == 200) {
            this.setState({
              config: data.data,
            });
          } else {
            message.error('查询错误，请重试', 5);
          }
        }), (error) => {
          console.log("系统内部错误");
        }
      }
    }

  }

  okHandler() {
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('数据为', values);
        if (this.props.sta.addFlag) {
          // 新增
        } else {
          // 修改
          values.id = this.props.sta.selectedRows[0].id;
        }
        Fetch.getInstance().postWithRequestData("conf/save", {
          requestData: values
        }).then((data) => {
          if (data.code == 200) {
            message.success(data.message);
            //重新清空输入框
            this.props.form.resetFields();
            this.hideModelHandler();
            this.props.onResetSelectedRowKeys();
            this.props.getListData();
          } else {
            message.error(data.message);
          }
        }), (error) => {
          console.log("系统内部错误");
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
    //配置项域
    let Common_DictScope = null;
    if (this.props.propsSta.Common_DictScope != null) {
      Common_DictScope = this.props.propsSta.Common_DictScope.length > 0
          ? this.props.propsSta.Common_DictScope.map(d =>
              <Option key={d.value} value={d.value}>{d.label}</Option>) : null;
    }

    return (
        <span>
                <Modal title="配置管理"
                       maskClosable={false}
                       visible={this.props.sta.editAddModelVisible} width={800}
                       onOk={this.okHandler.bind(this)}
                       onCancel={this.hideModelHandler}>
                    <RcInputGroup inputHeight={150}>
                        {[
                          <FormItem {...formItemLayout} label="配置项名" key={1}>
                            {
                              getFieldDecorator('confKey', {
                                rules: [{required: true, message: '配置项名不能为空'}],
                                initialValue: !this.props.sta.addFlag
                                    ? this.props.sta.config.confKey
                                    : '',
                              })
                              (<Input/>)
                            }
                          </FormItem>,
                          <FormItem {...formItemLayout} label="配置项值" key={2}>
                            {
                              getFieldDecorator('confValue', {
                                rules: [{required: true, message: '配置项值不能为空'}],
                                initialValue: !this.props.sta.addFlag
                                    ? this.props.sta.selectedRows.length > 0
                                        ? this.props.sta.selectedRows[0].confValue
                                        : ''
                                    : '',
                              })(<Input/>)
                            }
                          </FormItem>,
                          <FormItem {...formItemLayout} label="配置项域" key={8}>
                            {
                              getFieldDecorator('scope', {
                                rules: [{required: true, message: '配置项域不能为空'}],
                                initialValue: !this.props.sta.addFlag
                                    ? this.props.sta.selectedRows.length > 0
                                        ? this.props.sta.selectedRows[0]['scope']
                                        : ''
                                    : '',
                              })(
                                  <Select placeholder="请选择">
                                    {Common_DictScope}
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

export default Form.create()(EditModal);