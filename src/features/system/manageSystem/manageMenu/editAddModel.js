import {Form, Input, message, Modal, Select, Switch, TreeSelect} from 'antd';
import Fetch from '../../subfetch';
import {RcInputGroup} from 'testantd'

const FormItem = Form.Item;
const Option = Select.Option;
const TreeNode = TreeSelect.TreeNode;

class EditModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      menuTree: null,      //上级菜单树结构
      isShow: false,

    }

  }

  hideModelHandler = () => {
    this.props.setState({
      editAddModelVisible: false
    })
  };

  componentWillMount() {
    Fetch.getInstance().postWithRequestData("menu/treeData",
        {urlType: "BASE_URL"}).then((data) => {
      const {code} = data;
      if (code == 200) {
        this.setState({
          menuTree: data.data
        });
      }
    }), (error) => {
      message.error('初始化菜单错误，请重试', 5);
    }

  }

  //提交表单
  okHandler() {
    this.props.form.validateFields((err, values) => {
      if (!err) {
        if (values.isShow == true) {
          values.isShow = 1;
        } else {
          values.isShow = 0;
        }

        if (this.props.sta.addFlag) { //新增
          Fetch.getInstance().postWithRequestData("menu/save", {
            requestData: values
          }).then((data) => {
            if (data.code == 200) {
              //重新清空输入框
              this.props.form.resetFields();
              message.success("新增成功");
              this.props.getListData();
            } else {
              message.error('新增错误，请重试', 5);
            }
          }), (error) => {
            console.log("系统内部错误");
          }
        } else {  // 修改
          values.id = this.props.sta.selectedRows[0].menuId;
          Fetch.getInstance().postWithRequestData("menu/updateMenuData", {
            requestData: values
          }).then((data) => {
            if (data.code == 200) {
              //重新清空输入框
              this.props.form.resetFields();
              this.props.onResetSelectedRowKeys();//清空已选
              message.success("修改成功");
              this.props.getListData();
            } else {
              message.error('新增错误，请重试', 5);
            }
          })
        }
        this.hideModelHandler();
      } else {
        message.warn('数据格式有误', 5);
      }
    });
  };

  switchChange(checked) {

    this.setState({
      isShow: checked
    });
    if (!this.props.sta.addFlag) {
      this.props.sta.selectedRows[0].isShow = (checked == true ? 1 : 0);
    }
  }

  render() {
    const {getFieldDecorator} = this.props.form;
    const formItemLayout = {
      labelCol: {span: 9},
      wrapperCol: {span: 15},
    };

    //系统类型
    let common_dictScope = this.props.sta.common_dictScope != null
        ? this.props.sta.common_dictScope.map(
            d => <Option key={d.value} value={d.value}>{d.label}</Option>) : [];

    let loop = data => data != null ? data.map(
        (item) => {
          if (item.children) {
            return (
                <TreeNode key={item.menuId} value={item.menuId}
                          title={item.name}>
                  {loop(item.children)}
                </TreeNode>
            );
          }
          return <TreeNode key={item.menuId} value={item.menuId}
                           title={item.name}/>;
        })
        : null;

    return (
        <span>
                <Modal title="修改菜单"
                       maskClosable={false}
                       visible={this.props.sta.editAddModelVisible} width={800}
                       onOk={this.okHandler.bind(this)}
                       onCancel={this.hideModelHandler}>
                    <RcInputGroup inputHeight={200}>
                        {[
                          <FormItem {...formItemLayout} label="上级菜单" key={6}>
                            {
                              getFieldDecorator('parents.id', {
                                initialValue: !this.props.sta.addFlag
                                    ? this.props.sta.selectedRows.length > 0
                                        ? this.props.sta.selectedRows[0].parentId
                                        : ''
                                    : '',
                              })
                              (
                                  <TreeSelect showSearch dropdownStyle={{
                                    maxHeight: 400,
                                    overflow: 'auto'
                                  }}
                                              placeholder="请选择"
                                              notFoundContent="暂无匹配数据"
                                              allowClear treeDefaultExpandAll
                                              treeNodeFilterProp="title">
                                    {loop(this.state.menuTree)}
                                  </TreeSelect>
                              )
                            }
                          </FormItem>,
                          <FormItem {...formItemLayout} label="菜单名称" key={6}>
                            {
                              getFieldDecorator('name', {
                                rules: [{required: true, message: '不能为空'}],
                                initialValue: !this.props.sta.addFlag
                                    ? this.props.sta.selectedRows.length > 0
                                        ? this.props.sta.selectedRows[0].name
                                        : ''
                                    : '',
                              })
                              (<Input/>)
                            }
                          </FormItem>,
                          <FormItem {...formItemLayout} label="菜单链接" key={1}>
                            {
                              getFieldDecorator('href', {
                                rules: [{required: true, message: '不能为空'}],
                                initialValue: !this.props.sta.addFlag
                                    ? this.props.sta.selectedRows.length > 0
                                        ? this.props.sta.selectedRows[0].to : ''
                                    : '',
                              })
                              (<Input/>)

                            }
                          </FormItem>,
                          <FormItem {...formItemLayout} label="是否显示" key={2}>
                            {
                              getFieldDecorator('isShow', {})(
                                  <Switch checkedChildren={'显示'}
                                          unCheckedChildren={'隐藏'}
                                          onChange={this.switchChange.bind(
                                              this)}
                                          checked={
                                            !this.props.sta.addFlag
                                                ? this.props.sta.selectedRows.length
                                                > 0
                                                ? this.props.sta.selectedRows[0].isShow
                                                == 0 ? false : true
                                                : false
                                                : this.state.isShow}/>
                              )
                            }
                          </FormItem>,
                          <FormItem {...formItemLayout} label="系统" key={3}>
                            {
                              getFieldDecorator('systemSign', {
                                rules: [{required: true, message: '不能为空'}],
                                initialValue: !this.props.sta.addFlag
                                    ? this.props.sta.selectedRows.length > 0
                                        ? this.props.sta.selectedRows[0].systemSign
                                        : ''
                                    : '',
                              })
                              (
                                  <Select placeholder="请选择">
                                    {common_dictScope}
                                  </Select>
                              )
                            }
                          </FormItem>,
                          <FormItem {...formItemLayout} label="备注" key={5}>
                            {
                              getFieldDecorator('remarks', {
                                initialValue: !this.props.sta.addFlag
                                    ? this.props.sta.selectedRows.length > 0
                                        ? this.props.sta.selectedRows[0].remarks
                                        : ''
                                    : '',
                              })
                              (<Input/>)
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