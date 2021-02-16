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
import globalConfig from '../../../../config.js';
import Fetch from '../../subfetch';

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

  //修改
  onClickUpdate = () => {
    console.log(this.state.selectedRows[0].id);
    if (this.state.selectedRows != null && this.state.selectedRows.length > 0) {
      Fetch.getInstance().postWithRequestData("conf/serviceDown", {
        requestData: {ids: this.state.selectedRowKeys.toString()}
      }).then((data) => {
        if (data.code == 200) {
          message.success(data.data);
          this.onResetSelectedRowKeys();
        } else {
          message.error('删除操作错误，请重试', 5);
        }
      })
    }
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
        title: '编号',
        dataIndex: 'id',
        key: 'id',
        render: (text) => {
          return text;
        }
      }, {
        title: '服务名称',
        dataIndex: 'serviceName',
        key: 'serviceName',
        render: (text) => {
          return text;
        }
      }, {
        title: '部署地址',
        dataIndex: 'hostName',
        key: 'hostName',
        render: (text) => {
          return text;
        }
      }, {
        title: '服务端口',
        dataIndex: 'port',
        key: 'port',
        render: (text) => {
          return text;
        }
      }, {
        title: '部署日期',
        dataIndex: 'launchDate',
        key: 'launchDate',
        render: (text) => {
          return text;
        }
      }, {
        title: '最后启动时间',
        dataIndex: 'modified',
        key: 'modified',
        render: (text) => {
          return text;
        }
      }, {
        title: '发版次数',
        dataIndex: 'version',
        key: 'version',
        render: (text) => {
          return text;
        }
      }
    ];
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
                    tableConfig.showUpdate &&
                    <Popconfirm title={multiSelected ? '是否批量下线所选' : '慎重操作-是否下线'}
                                onConfirm={this.onClickUpdate}>
                      <Button type="primary" disabled={!hasSelected}>
                        <Icon type="delete"/> {multiSelected ? '批量下线'
                          : '下线'}
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
        </div>
    )
  }
}