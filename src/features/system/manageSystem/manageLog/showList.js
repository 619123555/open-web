import {RcTable, RcTableData} from 'testantd'

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

  //重置已选择的数据
  onResetSelectedRowKeys = () => {
    this.setState({
      selectedRowKeys: [],
      selectedRows: [],
    })
  }

  render() {
    const columns = [
      {
        title: '操作序号',
        dataIndex: 'id',
        key: 'id',
        render: (text) => {
          return text;
        }
      }, {
        title: '用户名称',
        dataIndex: 'userName',
        key: 'userName',
        render: (text) => {
          return text;
        }
      }, {
        title: '操作记录',
        dataIndex: 'methodDesc',
        key: 'methodDesc',
        render: (text) => {
          return text;
        }
      }, {
        title: 'ip地址',
        dataIndex: 'ip',
        key: 'ip',
        render: (text) => {
          return text;
        }
      }, {
        title: '操作时间',
        dataIndex: 'createTime',
        key: 'createTime',
        render: (text) => {
          return text;
        }
      }
    ];
    return (
        <div>
          <RcTable rowKey={'id'} ref="rcTable" sta={this.state}
                   setState={this.setState.bind(this)}
                   columns={columns} dataSource={this.props.sta.data}/>
        </div>
    )
  }
}