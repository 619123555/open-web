import {Form, Input, message, Modal, Select, TreeSelect} from 'antd';
import Fetch from '../../subfetch';
import {RcInputGroup} from 'testantd'

const FormItem = Form.Item;
const Option = Select.Option;
const TreeNode = TreeSelect.TreeNode;

class EditAddModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {}
  }

  hideModelHandler = () => {
    this.props.setState({
      editAddModelVisible: false
    })
  };

  componentWillMount() {

  }

  okHandler() {
    this.props.form.validateFields((err, values) => {
      if (!err) {
        if (this.props.sta.addFlag) {
          Fetch.getInstance().postWithRequestData("user/save",
              {requestData: values}).then((data) => {
            if (data.code == 200) {
              this.setState({
                organizationTree: data.data
              });
              this.hideModelHandler();
              this.props.form.resetFields();
              this.props.getListData();
            } else {
              message.error(data.message, 5);
            }
          }), (error) => {
            message.error('新增错误', 5);
          }
        } else {
          //修改
          values.id = this.props.sta.selectedRows[0].id;
          // if (values.company.id == "posp信息科技有限公司") {
          //   values.company.id = "2";
          // }
          // if (values.office.code == "posp信息科技有限公司1") {
          //   values.office.code = '100000';
          // }
          console.log(values)
          Fetch.getInstance().postWithRequestData("user/saveUserData",
              {requestData: values}).then((data) => {
            if (data.code == 200) {
              this.setState({});
              this.hideModelHandler();
              this.props.form.resetFields();

              this.props.onResetSelectedRowKeys();
              this.props.getListData();
            }
          }), (error) => {
            message.error('修改错误', 5);
          }
        }

      }
    });
  };

  updateOrgTree(value) {

    this.props.form.setFieldsValue({
      'office.id': '',
    });
    this.props.getOrgTree(value);
  }

  render() {
    const {getFieldDecorator} = this.props.form;
    const formItemLayout = {
      labelCol: {span: 9},
      wrapperCol: {span: 15},
    };
    //归属部门
    let Common_organization = this.props.sta.organization != null
    && this.props.sta.organization.length > 0 ? this.props.sta.organization.map(
        organization => <Option value={organization.orgId}
                                key={organization.orgId}>{organization.orgName}</Option>)
        : [];
    //性别
    let Common_GenderPCodes = this.props.sta.genderPCode != null
    && this.props.sta.genderPCode.length > 0 ? this.props.sta.genderPCode.map(
        d => <Option key={d.value} value={d.value}>{d.label}</Option>) : [];
    //用户类型
    let Common_UserTypeCds = this.props.sta.UserTypeCd != null
    && this.props.sta.UserTypeCd.length > 0 ? this.props.sta.UserTypeCd.map(
        d => <Option key={d.value} value={d.value}>{d.label}</Option>) : [];
    let loop = data => data != null ? data.map(
        (item) => {
          if (item.children) {
            return (
                <TreeNode key={item.orgId} value={item.orgId}
                          title={item.orgName}>
                  {loop(item.children)}
                </TreeNode>
            );
          }
          return <TreeNode key={item.orgId} value={item.orgId}
                           title={item.orgName}/>;
        })
        : null;
    return (
        <span>
                <Modal title="修改用户"
                    /* 点击对话框外是否允许关闭 false:不予许关闭 */
                       maskClosable={false}
                       visible={this.props.sta.editAddModelVisible} width={800}
                    /*此处注意用法区别，注意看：一个用了bind绑定了this，另一个未使用，再对应函数去查看区别用法*/
                       onOk={this.okHandler.bind(this)}
                       onCancel={this.hideModelHandler}>
                    <RcInputGroup inputHeight={300}>
                        {[
                          <FormItem {...formItemLayout} label="工号" key={1}>
                            {
                              getFieldDecorator('no', {
                                initialValue: !this.props.sta.addFlag
                                    ? this.props.sta.selectedRows.length > 0
                                        ? this.props.sta.selectedRows[0].no : ''
                                    : '',
                              })
                              (<Input disabled={true}/>)
                            }
                          </FormItem>,
                          <FormItem {...formItemLayout} label="姓名" key={2}>
                            {
                              getFieldDecorator('name', {
                                rules: [{
                                  required: true,
                                  message: '姓名长度不合法',
                                  min: 2,
                                  max: 100,
                                }],
                                initialValue: !this.props.sta.addFlag
                                    ? this.props.sta.selectedRows.length > 0
                                        ? this.props.sta.selectedRows[0].name
                                        : ''
                                    : '',
                              })(<Input/>)
                            }
                          </FormItem>,
                          <FormItem {...formItemLayout} label="性别" key={3}>
                            {
                              getFieldDecorator('gender', {
                                rules: [{
                                  required: true,
                                  message: '性别不能为空'
                                }],
                                initialValue: !this.props.sta.addFlag
                                    ? this.props.sta.selectedRows.length > 0
                                        ? this.props.sta.selectedRows[0].gender
                                        : ''
                                    : '',
                              })(
                                  <Select placeholder="请选择">
                                    {Common_GenderPCodes}
                                  </Select>
                              )
                            }
                          </FormItem>,
                          <FormItem {...formItemLayout} label="归属公司" key={4}>
                            {
                              getFieldDecorator('company.id', {
                                rules: [{required: true, message: '归属公司不能为空'}],
                                initialValue: !this.props.sta.addFlag
                                    ? this.props.sta.selectedRows.length
                                    > 0
                                        ? this.props.sta.selectedRows[0].company.id
                                        : ''
                                    : '',
                              })(
                                  <Select showSearch placeholder="请选择"
                                          onChange={this.updateOrgTree.bind(
                                              this)}>
                                    {Common_organization}
                                  </Select>
                              )
                            }
                          </FormItem>,
                          <FormItem {...formItemLayout} label="归属部门" key={5}>
                            {
                              getFieldDecorator('office.id', {
                                rules: [{
                                  required: true,
                                  message: '归属部门不能为空'
                                }],
                                initialValue: !this.props.sta.addFlag
                                    ? this.props.sta.selectedRows.length
                                    > 0
                                        ? this.props.sta.selectedRows[0].office.id
                                        : ''
                                    : '',
                              })
                              (
                                  <TreeSelect showSearch dropdownStyle={{
                                    maxHeight: 400,
                                    overflow: 'auto'
                                  }} placeholder="请选择"
                                              notFoundContent="暂无匹配数据"
                                              allowClear treeDefaultExpandAll
                                              treeNodeFilterProp="title">
                                    {loop(this.props.sta.organizationTree)}
                                  </TreeSelect>
                              )
                            }
                          </FormItem>,
                          <FormItem {...formItemLayout} label="邮箱" key={6}>
                            {
                              getFieldDecorator('email', {
                                rules: [{
                                  required: true,
                                  message: '邮箱不能为空或格式有误',
                                  type: 'email'
                                }],
                                initialValue: !this.props.sta.addFlag
                                    ? this.props.sta.selectedRows.length > 0
                                        ? this.props.sta.selectedRows[0]['email']
                                        : ''
                                    : '',
                              })(<Input/>)
                            }
                          </FormItem>,
                          <FormItem {...formItemLayout} label="手机" key={7}>
                            {
                              getFieldDecorator('mobile', {
                                rules: [{
                                  required: true,
                                  message: '手机不能为空',
                                  max: 15,
                                }],
                                initialValue: !this.props.sta.addFlag
                                    ? this.props.sta.selectedRows.length > 0
                                        ? this.props.sta.selectedRows[0]['mobile']
                                        : ''
                                    : '',
                              })(<Input/>)
                            }
                          </FormItem>,
                          <FormItem {...formItemLayout} label="用户类型" key={8}>
                            {
                              getFieldDecorator('userType', {
                                rules: [{
                                  required: true,
                                  message: '用户类型不能为空'
                                }],
                                initialValue: !this.props.sta.addFlag
                                    ? this.props.sta.selectedRows.length > 0
                                        ? this.props.sta.selectedRows[0]['userType']
                                        : ''
                                    : '',
                              })(
                                  <Select placeholder="请选择">
                                   {Common_UserTypeCds}
                                  </Select>
                              )
                            }
                          </FormItem>,
                          <FormItem {...formItemLayout} label="所属渠道" key={9}>
                            {
                              getFieldDecorator('manageChannel', {
                                rules: [{
                                  required: false,
                                  message: '所属渠道长度超限',
                                  max: 40,
                                  min: 1
                                }],
                                initialValue: !this.props.sta.addFlag
                                    ? this.props.sta.selectedRows.length > 0
                                        ? this.props.sta.selectedRows[0]['manageChannel']
                                        : ''
                                    : '',
                              })(<Input/>)
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