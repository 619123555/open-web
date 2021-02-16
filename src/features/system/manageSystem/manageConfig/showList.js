import {
  Button,
  Checkbox,
  Col,
  Icon,
  message,
  Popconfirm,
  Row,
  Select
} from 'antd';
import {RcTable, RcTableData} from 'testantd'
import Fetch from '../../subfetch';
import globalConfig from '../../../../config.js';
import EditAddModel from './editAddModel.js';

const ButtonGroup = Button.Group;

export default class ShowList extends RcTableData {
  constructor(props) {
    super(props);
    this.state = {
      selectedRowKeys: [],             // 当前有哪些行被选中, 这里只保存key
      selectedRows: [],                //选择的行
      editAddModelVisible: false,     //修改和新增的弹框
      assignModelVisible: false,      //修改的弹框
      addFlag: true,                  //用来标志修改和新增
      genderPCode: [],                 //性别
      UserTypeCd: [],                  //用户类型
      config: {},  //配置管理
    };
  }

  componentWillMount() {

  }

  //新增
  onClickInsert = () => {
    this.setState({
      editAddModelVisible: true,
      addFlag: true
    });
  }
  //修改
  onClickUpdate = () => {
    console.log(this.state.selectedRows[0].id);
    this.setState({
      editAddModelVisible: true,
      addFlag: false
    });
    Fetch.getInstance().postWithRequestData("conf/showConf", {
      requestData: {id: this.state.selectedRows[0].id}
    }).then((data) => {
      console.log(data);
      if (data.code == 200) {
        this.setState({
          config: data.data,
        });
      } else {
        message.error('查询错误，请重试', 5);
      }
    })
  }

  //删除
  onClickDelete = () => {
    let delData = {
      id: this.state.selectedRowKeys[0]
    }
    console.log(delData);
    Fetch.getInstance().postWithRequestData("conf/delteConf", {
      requestData: delData
    }).then((data) => {
      if (data.code == 200) {
        message.success(data.data);
        this.props.getListData();
        this.onResetSelectedRowKeys();
      }
    })
  }

  //重置已选择的数据
  onResetSelectedRowKeys = () => {
    this.setState({
      selectedRowKeys: [],
      selectedRows: [],
    })
  }

  render() {
    const Option = Select.Option;
    const hasSelected = this.state.selectedRowKeys.length > 0;  // 是否选择
    const oneSelected = this.state.selectedRowKeys.length == 1; //是否仅仅选择了一项
    const multiSelected = this.state.selectedRowKeys.length > 1;  // 是否选择了多项
    const columns = [
      {
        title: '配置项名',
        dataIndex: 'confKey',
        key: 'confKey',
        render: (text, record, index) => {
          return text;
        }
      }, {
        title: '配置项值',
        dataIndex: 'confValue',
        key: 'confValue',
        width: '30%',
        render: (text, record, index) => {
          return text;
        }
      }, {
        title: '配置项域',
        dataIndex: 'scope',
        key: 'scope',
        width: '15%',
        className: 'menu-system-td',
        render: (text, record, index) => {
          this.props.sta.Common_DictScope.forEach(function (val) {
            if (val.value == text) {
              text = val.label;
            }
          });
          return text;
        }
      }, {
        title: '状态',
        dataIndex: 'status',
        key: 'status',
        width: '20%',
        render: (text, record, index) => {
          return text == 1 ? '启用' : '关闭';
        }
      }
    ];
    //加载按钮的默认配置 es6中面向对象
    let tableConfig = Object.assign({}, globalConfig.DBTable.default);

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
                    <Button type="primary" onClick={this.onClickInsert}>
                      <Icon type="plus-circle-o"/> 新增
                    </Button>
                  }{
                  tableConfig.showUpdate &&
                  <Button type="primary" disabled={!hasSelected || !oneSelected}
                          onClick={this.onClickUpdate}>
                    <Icon type="edit"/> 修改
                  </Button>
                }{
                  tableConfig.showDelete &&
                  <Popconfirm title={multiSelected ? '是否批量删除所选' : '是否删除'}
                              onConfirm={this.onClickDelete}>
                    <Button type="primary" disabled={!hasSelected}>
                      <Icon type="delete"/> {multiSelected ? '批量删除' : '删除'}
                    </Button>
                  </Popconfirm>
                }
                </ButtonGroup>
              </Col>
            </Row>
          </div>
          <RcTable rowKey={'id'} ref="rcTable" sta={this.state}
                   setState={this.setState.bind(this)} rowSelection={"checkbox"}
                   columns={columns} dataSource={this.props.sta.data}/>

          <EditAddModel sta={this.state} propsSta={this.props.sta}
                        setState={this.setState.bind(this)}
                        getListData={this.props.getListData.bind(this)}
                        onResetSelectedRowKeys={this.onResetSelectedRowKeys.bind(
                            this)}/>
        </div>
    )
  }
}