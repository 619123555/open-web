import {Form, Input, message, Modal, Select, Tree} from 'antd';
import Fetch from '../../subfetch';
import {RcCol, RcInputGroup} from 'testantd'

const FormItem = Form.Item;
const Option = Select.Option;
const TreeNode = Tree.TreeNode;

class AssignModel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userData: null,                 //值为对象
      menuCheckedKeys: [],            //菜单已选中的  类型为list
      positionCheckedKeys: [],        //岗位已选中  类型为list
      userMenuData: [],               //用户权限菜单数据
      /*CommonChannelCd:[],      //管理渠道*/

    }
  }

  componentDidMount() {
    this.updateAllotFlag(this.props.sta.selectedRows[0]);
    this.getMenuList();

    /* //加载管理渠道
     Dictionary.getInstance().init(["Common_ChannelCd"]).then((value)=>{
         this.setState({CommonChannelCd: value["Common_ChannelCd"]});
     })*/
  }

  updateAllotFlag(record) {
    // Fetch.getInstance().postWithRequestData("user/getUserAssignData",{requestData:{"id":record.id},urlType:"BASE_URL"}).then((data)=>{
    //     if(data.status==200){
    //         this.setState({
    //             userData:data.data,
    //             //menuCheckedKeys: data.data.specialMenus.menuIdList,
    //             menuCheckedKeys: data.data.userMenuList,
    //             positionCheckedKeys: data.data.user.puList,    //岗位已选中
    //         });
    //     } else {
    //         message.error('数据初始化错误，请重试', 5);
    //     }
    // }),(error)=>{
    //     message.error('数据初始化错误，请重试', 5);
    // }
  }

  // 得到用户菜单的数据
  getMenuList() {
    Fetch.getInstance().postWithRequestData("menu/treeData",
        {urlType: "BASE_URL"}).then((data) => {
      if (data.code == 200) {
        this.setState({
          userMenuData: data.data
        });
      } else {
        message.error('数据初始化错误，请重试', 5);
      }
    })
  }

  hideModelHandler = () => {
    this.props.setState({
      assignModelVisible: false
    })
    /*this.state.menuCheckedKeys = [];

    this.props.form.resetFields();*/
  };

  okHandler() {
    this.props.form.validateFields((err, values) => {
      if (!err) {
        values.id = this.props.sta.selectedRows[0].id;
        values.no = this.props.sta.selectedRows[0].no;
        values.manageChannel = values.manageChannel.toString();
        // values.menuIds=this.state.menuCheckedKeys.toString();
        let ids = [];
        let keys = this.state.menuCheckedKeys;
        // 截取key中的菜单id
        for (let key of keys) {
          if (key.concat('/')) {
            key = key.toString().substr(key.lastIndexOf('/') + 1);
            ids.push(key);
          }
        }
        values.menuIds = ids.toString();

        //userid
        console.log(values)
        Fetch.getInstance().postWithRequestData("user/menuSave",
            {requestData: values, urlType: "BASE_URL"}).then((data) => {
          if (data.code == 200) {
            this.hideModelHandler();
            this.state.menuCheckedKeys = [];
            this.props.form.resetFields();
            this.props.onResetSelectedRowKeys();

          } else {
            message.error(data.message)
          }
        }), (error) => {
          console.log("111...." + error);
        }
      }
    });
  };

  //菜单点击事件
  onCheckMenu = (menuCheckedKeys, checkedNodes) => {

    let mc = menuCheckedKeys.concat(checkedNodes.halfCheckedKeys);//将上级目录的id添加进来
    this.setState({"menuCheckedKeys": menuCheckedKeys});

  }

  render() {
    const loop = data => data.map((item) => {
      if (item.children) {
        return (
            <TreeNode key={item.key} title={item.name}>
              {loop(item.children)}
            </TreeNode>
        );
      }
      return <TreeNode key={item.key} title={item.name}/>;
    });
    const {getFieldDecorator} = this.props.form;
    const formItemLayout = {
      labelCol: {span: 9},
      wrapperCol: {span: 15},
    };
    //归属部门

    let channelOpts = this.props.sta.CommonChannelCd != null
    && this.props.sta.CommonChannelCd.length > 0
        ? this.props.sta.CommonChannelCd.map(
            channel => <Option key={channel.value}
                               value={channel.value}>{channel.label}</Option>
        ) : [];
    return (
        <span>
                <Modal title="用户分配"
                    /* 点击对话框外是否允许关闭 false:不予许关闭 */
                       maskClosable={false}
                       visible={this.props.sta.assignModelVisible} width={800}
                    /*此处注意用法区别，注意看：一个用了bind绑定了this，另一个未使用，再对应函数去查看区别用法*/
                       onOk={this.okHandler.bind(this)}
                       onCancel={this.hideModelHandler}>
                    <RcInputGroup inputHeight={300} colNum={2}>
                        {[
                          <RcCol rcLayout={'singleColumn'} rcSpan={6} key={1}>
                            <FormItem {...formItemLayout} label="用户菜单">
                              {
                                getFieldDecorator('menuIds', {
                                  rules: [{}],
                                })
                                (
                                    <Tree checkable defaultExpandAll={true}
                                          checkedKeys={this.state.menuCheckedKeys.length
                                          > 0 ? this.state.menuCheckedKeys : []}
                                          onCheck={this.onCheckMenu}>
                                      {this.state.userMenuData != null
                                      && this.state.userMenuData.length > 0
                                          ? loop(this.state.userMenuData) : []}
                                    </Tree>
                                )
                              }
                            </FormItem>
                          </RcCol>,
                          <FormItem {...formItemLayout} label="用户姓名" key={2}>
                            {
                              getFieldDecorator('userName', {
                                initialValue: this.props.sta.selectedRows[0].name
                              })
                              (<Input disabled={true}/>)
                            }
                          </FormItem>,
                          <FormItem {...formItemLayout} label="归属公司" key={3}>
                            {
                              getFieldDecorator('companyName', {
                                rules: [{}],
                                initialValue: this.props.sta.selectedRows[0].company.name,
                              })(
                                  <Input disabled={true}/>
                              )
                            }
                          </FormItem>,
                          <FormItem {...formItemLayout} label="归属部门" key={4}>
                            {
                              getFieldDecorator('officeName', {
                                initialValue: this.props.sta.selectedRows[0].office.name,
                                // initialValue: this.state.userData != null && this.state.userData.user.office != null ? this.state.userData.user.office.name : '',
                              })(
                                  <Input disabled={true}/>
                              )
                            }
                          </FormItem>,
                          <FormItem {...formItemLayout} label="管理渠道" key={5}>
                            {
                              getFieldDecorator('manageChannel', {
                                //initialValue: this.props.sta.selectedRows[0].manageChannelList,
                                initialValue: this.state.userData != null
                                && this.state.userData.role.user.manageChannelList.length
                                > 0
                                    ? this.state.userData.role.user.manageChannelList
                                    : [],
                              })(
                                  <Select mode="multiple" placeholder="请选择">
                                    {channelOpts}
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

export default Form.create()(AssignModel);