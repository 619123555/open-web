/**
 * Created by zhl on 2017-5-15.
 */
import {Button, Checkbox, Col, Icon, message, Popconfirm, Row} from 'antd';
import {RcTable, RcTableData} from 'testantd'
import Fetch from '../../subfetch';
import globalConfig from '../../../../config.js';
import Dictionary from '../../../../utils/dictionaryItem.js';
import EditAddModel from './editAddModel.js';
import AssignModel from './assignModel.js';

const ButtonGroup = Button.Group;

export default class ShowList extends RcTableData {
  constructor(props) {
    super(props);
    this.state = {
      organizationTree: null,      //归属部门树结构
      genderPCode: [],                 //性别
      UserTypeCd: [],                  //用户类型
      organization: [],                //机构
      CommonChannelCd: [],             //管理渠道
      ...this.state
    }
  }

  componentWillMount() {
    //性别和用户类型
    Dictionary.getInstance().init(
        "Common_GenderPCode,UserTypeCD,Common_ChannelCd").then(
        (value) => {
          this.setState({
            genderPCode: value.Common_GenderPCode,
            UserTypeCd: value.UserTypeCD,
            CommonChannelCd: value.CommonChannelCd
          });
        })
    //归属部门
    Fetch.getInstance().postWithRequestData("organization/getTreeData", {
      requestData: {grade: 2}
    }).then((data) => {
      if (data.code == 200) {
        this.setState({organization: data.data});
      }
    });
  }

  //获取归属部门树结构 根据归属公司id
  getOrgTree(parentId) {
    Fetch.getInstance().postWithRequestData("organization/getTreeData",
        {requestData: {parentId: parentId}, urlType: "BASE_URL"}).then(
        (data) => {
          if (data.code == 200) {
            this.setState({
              organizationTree: data.data
            });
          }
        }), (error) => {
      message.error('初始化机构部门错误，请重试', 5);
    }
  }

  //修改
  onClickUpdate = () => {
    this.getOrgTree(this.state.selectedRows[0].company.id);
    super.onClickUpdate();
  }

  //分配
  onClickAssign = () => {
    super.onClickAssign();
  }

  // 冻结用户
  onClickCleanCache = () => {
    Fetch.getInstance().postWithRequestData("user/cleanCache", {
      requestData: {ids: this.state.selectedRowKeys.toString()},
      urlType: "BASE_URL"
    }).then((data) => {
      if (data.code == 200) {
        message.success(data.data);
        this.props.getListData();
        this.onResetSelectedRowKeys();
      }
    });
  }

  //删除
  onClickDelete = () => {
    // message.info('删除的ID为： ' + this.state.selectedRowKeys, 5);
    Fetch.getInstance().postWithRequestData("user/deleteList", {
      requestData: {ids: this.state.selectedRowKeys.toString()},
      urlType: "BASE_URL"
    }).then((data) => {
      if (data.code == 200) {
        message.success(data.data);
        this.props.getListData();
        this.onResetSelectedRowKeys();
      } else {
        message.error('删除操作错误，请重试', 5);
      }
    }), (error) => {
      message.error('删除请求错误，请重试', 5);
    }
  }

  //重置密码
  onClickResetPassword = () => {
    Fetch.getInstance().postWithRequestData("user/resetPsw", {
      requestData: {id: this.state.selectedRowKeys[0]}
    }).then((data) => {
      if (data.code == 200) {
        message.success(data.data);
      } else {
        message.error('重置密码操作错误，请重试', 5);
      }
    });
  }

  render() {
    const hasSelected = this.state.selectedRowKeys.length > 0;  // 是否选择
    const oneSelected = this.state.selectedRowKeys.length == 1; //是否仅仅选择了一项
    const multiSelected = this.state.selectedRowKeys.length > 1;  // 是否选择了多项
    const columns = [
      {
        title: '工号',
        dataIndex: 'no',
        key: 'no',
        render: (text, record, index) => {
          return text;
        }
      }, {
        title: '姓名',
        dataIndex: 'name',
        key: 'name',
        render: (text, record, index) => {
          return text;
        }
      }, {
        title: '性别',
        dataIndex: 'gender',
        key: 'gender',
        className: 'menu-system-td',
        render: (text, record, index) => {
          if (this.state.genderPCode != null && this.state.genderPCode != '') {
            this.state.genderPCode.forEach(function (val) {
              if (val.value == text) {
                text = val.label;
              }
            });
            return text;
          }
        }
      }, {
        title: '归属部门',
        dataIndex: 'office.name',
        key: 'office.name',
        render: (text, record, index) => {
          return text;
        }
      }, {
        title: '邮箱',
        dataIndex: 'email',
        key: 'email',
        render: (text, record, index) => {
          return text;
        }
      }, {
        title: '手机',
        dataIndex: 'mobile',
        key: 'mobile',
        render: (text, record, index) => {
          return text;
        }
      }, {
        title: '状态',
        dataIndex: 'status',
        key: 'status',
        render: (text, record, index) => {
          if (text == 1) {
            text = "正常";
          } else {
            text = "冻结";
          }
          return text;
        }
      }
    ];

    //加载按钮的默认配置 es6中面向对象
    let tableConfig;
    try {
      let tmp = require(`./tableConfig.schema.js`);
      tableConfig = Object.assign({}, globalConfig.DBTable.default,
          tmp.DBTable);  // 注意合并默认配置
    } catch (e) {
      message.error('配置加载失败', 5);
      tableConfig = Object.assign({}, globalConfig.DBTable.default);
    }

    return (
        <div>
          <div className="db-table-button">
            <Row>
              <Col span={24}>
                <Checkbox checked={hasSelected}
                          onChange={this.onResetSelectedRowKeys.bind(this)}>
                  <span>{hasSelected ? this.state.selectedRowKeys.length
                      : ''}</span>
                </Checkbox>
                <ButtonGroup>
                  {
                    tableConfig.showInsert &&
                    <Button type="primary"
                            onClick={this.onClickInsert.bind(this)}>
                      <Icon type="plus-circle-o"/> 新增
                    </Button>
                  }{
                  tableConfig.showUpdate &&
                  <Button type="primary" disabled={!hasSelected || !oneSelected}
                          onClick={this.onClickUpdate}>
                    <Icon type="edit"/> 修改
                  </Button>
                }{
                  tableConfig.showAssign &&
                  <Button type="primary" disabled={!hasSelected || !oneSelected}
                          onClick={this.onClickCleanCache}>
                    <Icon type="edit"/> 冻结
                  </Button>
                }{
                  tableConfig.showDelete &&
                  <Popconfirm title={multiSelected ? '是否批量删除所选' : '是否删除'}
                              onConfirm={this.onClickDelete}>
                    <Button type="primary" disabled={!hasSelected}>
                      <Icon type="delete"/> {multiSelected ? '批量删除' : '删除'}
                    </Button>
                  </Popconfirm>

                }{
                  tableConfig.showResetPassword &&
                  <Popconfirm title={multiSelected ? '是否批量重置密码' : '重置密码'}
                              onConfirm={this.onClickResetPassword}>
                    <Button type="primary" disabled={!hasSelected}>
                      <Icon type="edit"/> {multiSelected ? '批量重置密码' : '重置密码'}
                    </Button>
                  </Popconfirm>
                }
                </ButtonGroup>
              </Col>
            </Row>
          </div>

          <RcTable rowKey={'id'} sta={this.state} rowSelection={"checkbox"}
                   setState={this.setState.bind(this)}
                   columns={columns} dataSource={this.props.sta.data}/>

          <EditAddModel ref="editModel" sta={this.state}
                        setState={this.setState.bind(this)}
                        getOrgTree={this.getOrgTree.bind(this)}
                        getListData={this.props.getListData.bind(this)}
                        onResetSelectedRowKeys={this.onResetSelectedRowKeys.bind(
                            this)}/>
          {
            hasSelected &&
            <AssignModel sta={this.state} setState={this.setState.bind(this)}
                         onResetSelectedRowKeys={this.onResetSelectedRowKeys.bind(
                             this)}/>
          }
        </div>
    )
  }
}