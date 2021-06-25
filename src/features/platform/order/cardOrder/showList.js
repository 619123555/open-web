import {
  Button,
  Checkbox,
  Col,
  EditableCell,
  Icon,
  message,
  Row,
  Table
} from 'antd';
import Fetch from 'features/platform/subfetch';
import globalConfig from '../../../../config.js'
import OrderDetail from './orderDetail.js';
import CommonTools from 'utils/commonTools';


const ButtonGroup = Button.Group;

export default class ShowList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      flag: true,          //新增1，修改为数据ID
      ResourceStateCD: [],
      pCode: null,    //新增时的岗位代码
      accumReturnedPrin: 0,
      scrolHeight: document.documentElement.clientHeight - 370,
      editAddModelVisible: false,     //修改和新增的弹框
      assignModelVisible: false,      //修改的弹框
      showVisible: false,          // 展现对话框
      selectedRowKeys: [],        // 当前有哪些行被选中, 这里只保存key
      selectedRows: [],           //保存选中行中的对象
      selectedData: null,          //选中的数据展示
      checkedKeys: [],     //新增或编辑时选择的机构数
      treeTotal: [],        //机构总数
      indeterminate: true,    //设置 indeterminate 状态，只负责样式控制
      checkAll: false,         //指定当前全选是否选中
      orderInfo: {},  //订单详情
    }
  }

  componentWillMount() {
    console.log("渲染开始..." + this.props.sta.pageTotal);
  }

  //新增
  onClickInsert = () => {

  }

  // 明细
  showDetail = (internalNo) => {
    this.setState({
        editAddModelVisible: true,
    });

    Fetch.getInstance().postWithRequestData("order/orderInfo", {
        requestData: {internalNo: internalNo}
    }).then((data) => {
        if (data.code == 200) {
            //console.log(data.data);
            this.setState({
                orderInfo: data.data,
            });
        } else {
            message.error('查询错误，请重试', 5);
        }
    })
  }

  // 查看
  onClickSelect = () => {
    console.log(this.state.selectedRows[0].internalNo);
    if (this.state.selectedRows[0].internalNo.length
        == this.state.treeTotal.length) {
      this.setState({checkAll: true});
    }
    this.setState({
      editAddModelVisible: true,
      flag: false,
      showVisible: false,
      checkedKeys: this.state.selectedRows[0],
    });

    Fetch.getInstance().postWithRequestData("order/orderInfo", {
      requestData: {internalNo: this.state.selectedRows[0].internalNo}
    }).then((data) => {
      if (data.code == 200) {
        //console.log(data.data);
        this.setState({
          orderInfo: data.data,
        });
      } else {
        message.error('查询错误，请重试', 5);
      }
    })
  }
  //删除
  onClickDelete = () => {
    if (confirm("确认要删除")) {
      let internalNos = this.state.selectedRowKeys;
      //console.log(internalNos);
      Fetch.getInstance().postWithRequestData("order/deleteOrder", {
        requestData: {internalNos: internalNos},
      }).then((data) => {
        const {code} = data;
        if (code == 200) {
          message.success("删除成功");
          this.props.getListData();
          this.setState({
            selectedRowKeys: [],  // 当前有哪些行被选中, 这里只保存key
            selectedRows: [],
          });
        } else {
          message.error('删除操作错误，请重试');
        }
      })
    }
  }

  /**
   * 处理表格的选择事件
   * @param selectedRowKeys
   */
  onTableSelectChange = (selectedRowKeys, selectedRows) => {
    this.setState({
      selectedRows: selectedRows,
      selectedRowKeys: selectedRowKeys,
    });
  }

  onResetSelectedRowKeys = () => {
    this.setState({
      selectedRowKeys: [],
      selectedRows: [],
    })
  }

  handleRowClick = (record) => {
    let selectedRowKeys = this.state.selectedRowKeys;
    let selectedRows = this.state.selectedRows;
    var index = selectedRowKeys.indexOf(record.internalNo);
    if (index != -1) {
      selectedRowKeys.splice(index, 1);
      selectedRows.splice(index, 1);
      this.setState({
        selectedRowKeys: selectedRowKeys,
        selectedRows: selectedRows,
      });
    } else {
      selectedRowKeys.push(record.internalNo);
      selectedRows.push(record);
      this.setState({
        selectedRows: selectedRows,
        selectedRowKeys: selectedRowKeys,
      });
    }
  }

  positionShow(record) {
    this.setState({
      editAddModelVisible: false,
      flag: false,
      showVisible: true,
      selectedData: record,
    });
  }

  getListData() {
    this.props.getListData();
  }

  //资产追加列表下面统计
  totalAmtMessage() {
    // return (<div className="selectTotalHead">
    //   <span>合计统计-->></span><span>笔数:{this.regMoney(
    //     this.props.sta.pageTotal)}笔;</span><span>交易金额{this.regMoney(
    //     this.props.sta.totalOrderAmount)}元</span>
    // </div>);
  }

  //格式化
  regMoney = (text) => {
    return text != null ? text.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
        : 0;
  }

  render() {
    let config = Object.assign({}, globalConfig.DBTable.default);
    config.showDelete = false;
    const hasSelected = this.state.selectedRowKeys.length > 0;  // 是否选择
    const oneSelected = this.state.selectedRowKeys.length == 1; //是否仅仅选择了一项
    const multiSelected = this.state.selectedRowKeys.length > 1;  // 是否选择了多项

    const columns = [{
      title: '流水号',
      dataIndex: 'tradeNo',
      key: 'tradeNo',
      render: (text, record, index) => {
        return text;
      }
    },
      {
        title: '金额',
        dataIndex: 'amount',
        key: 'amount',
        render: (text, record, index) => {
          return text;
        }
      },
      ,
      {
        title: '实际金额',
        dataIndex: 'realAmount',
        key: 'realAmount',
        render: (text, record, index) => {
          return text;
        }
      },
      ,
      {
        title: '结算金额',
        dataIndex: 'settleAmount',
        key: 'settleAmount',
        render: (text, record, index) => {
          return text;
        }
      },
      {
        title: '订单状态',
        dataIndex: 'status',
        key: 'status',
        render: (text, record, index) => {
          this.props.sta.pay_type.forEach(function (val) {
            if (val.value == text) {
              text = val.label;
            }
          });
          return text;
        },
      },
      {
        title: '交易卡类型',
        dataIndex: 'cardType',
        key: 'cardType',
        render: (text, record, index) => {
          this.props.sta.card_trade_type.forEach(function (val) {
            if (val.value == text) {
              text = val.label;
            }
          });
          return text;
        },
      },
      {
        title: '创建时间',
        dataIndex: 'createTime',
        key: 'createTime',
        render: (text, record, index) => {
          return CommonTools.fmtTimeStampToDateLong(text);
        },
      },
      {
        title: '完成时间',
        dataIndex: 'completeTime',
        key: 'completeTime',
        render: (text, record, index) => {
          return CommonTools.fmtTimeStampToDateLong(text);
        },
      },
      {
        title: '通道',
        dataIndex: 'channelId',
        key: 'channelId',
        render: (text, index) => {
          this.props.sta.card_channel.forEach(function (val) {
            if (val.value == text) {
              text = val.label;
            }
          });
          return text;
        },
      },
    ];

    const rowSelection = {
      selectedRowKeys: this.state.selectedRowKeys,
      onChange: this.onTableSelectChange,
    };

    return (
        <div>
          <Table rowKey={'tradeNo'} ref="rcTable" columns={columns}
                 pagination={false}
                 onRowClick={this.handleRowClick}
                 dataSource={this.props.sta.data}
                 footer={this.totalAmtMessage.bind(this)}/>
          <OrderDetail sta={this.state} propsSta={this.props.sta}
                       setState={this.setState.bind(this)}
                       getListData={this.props.getListData.bind(this)}/>
        </div>
    )
  }

}
