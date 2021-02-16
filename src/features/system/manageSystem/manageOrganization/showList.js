/**
 * Created by zlq on 2017-5-15.
 */
import {Button, Checkbox, Col, Icon, message, Row, Select, Table} from 'antd';

import Fetch from '../../subfetch';
import Dictionary from '../../../../utils/dictionaryItem.js';
//弹出框引入
import EditAddModel from './editAddModel.js';

//定义一些常量变量
const ButtonGroup = Button.Group;

export default class ShowList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      scrolHeight: document.documentElement.clientHeight,     //浏览器可用高度
      editAddModelVisible: false,     //修改和新增的弹框
      assignModelVisible: false,      //修改的弹框
      selectedRowKeys: [],            // 当前有哪些行被选中, 这里只保存key
      selectedRows: [],             //选择的行
      addFlag: true,                  //用来标志修改和新增

      orgTypeCode: [],                  //机构类型
    };
  }

  componentWillMount() {
    //机构类型字典
    Dictionary.getInstance().init(["OrgTypeCD"]).then((value) => {
      this.setState({orgTypeCode: value["OrgTypeCD"]});
    })
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
    this.setState({
      editAddModelVisible: true,
      addFlag: false
    });
  }
  //分配
  onClickAssign = () => {
    this.setState({assignModelVisible: true});
  }
  //删除
  onClickDelete = () => {
    if (confirm("确认要删除")) {
      console.log(this.state.selectedRowKeys);
      let delData = {
        ids: this.state.selectedRowKeys
      }
      Fetch.getInstance().postWithRequestData("organization/delOrgData",
          {requestData: delData}).then((data) => {
        const {status} = data;
        if (data.code == 200) {
          message.success("删除成功");
          this.onResetSelectedRowKeys();
          this.props.getListData();
        }
      }), (error) => {
        message.error('删除请求错误，请重试', 5);
      }
    }

  }

  // 排序
  updateOrgSort(orgId, type) {
    let date = {
      id: orgId,
      "type": type
    }
    Fetch.getInstance().postWithRequestData("organization/updateOrgSort",
        {requestData: date}).then((data) => {
      const {status} = data;
      if (data.code == 200) {
        this.props.getListData();
      }
    }), (error) => {
      console.log("111...." + error);
    }
  }

  /**
   * 处理表格的选择事件
   */
  onTableSelectChange = (selectedRowKeys, selectedRows) => {
    this.setState({
      selectedRows: selectedRows,
      selectedRowKeys: selectedRowKeys,
    });
  };

  // 重置已选择的数据
  onResetSelectedRowKeys = () => {
    this.setState({
      selectedRowKeys: [],
      selectedRows: [],
    })
  }

  /**
   * 点击行，选中复选框
   * @param record  当前行的记录
   * @param index  选择的第几行（只是一个序号问题）
   */
  handleRowClick = (record) => {
    //此处需要使用 column中的key
    let selectedRowKeys = this.state.selectedRowKeys;
    let selectedRows = this.state.selectedRows;
    var index = selectedRowKeys.indexOf(record.orgId);
    //过滤 不可选择
    if (record.parentIds.indexOf(',2,') > 1 || record.orgId == '2') {
      return;
    }
    if (index != -1) {
      selectedRowKeys.splice(index, 1);
      selectedRows.splice(index, 1);
      this.setState({
        selectedRowKeys: selectedRowKeys,
        selectedRows: selectedRows,
      });
    } else {
      selectedRowKeys.push(record.orgId);
      selectedRows.push(record);
      this.setState({
        selectedRows: selectedRows,
        selectedRowKeys: selectedRowKeys,
      });
    }
  };

  render() {
    const Option = Select.Option;
    const hasSelected = this.state.selectedRowKeys.length > 0;  // 是否选择
    const oneSelected = this.state.selectedRowKeys.length == 1; //是否仅仅选择了一项
    const multiSelected = this.state.selectedRowKeys.length > 1;  // 是否选择了多项

    const columns = [
      {
        title: '机构名称',
        dataIndex: 'orgName',
        key: 'orgName',
        render: (text, record, index) => {
          return text;
        }
      }, {
        title: '机构简称',
        dataIndex: 'simpleCode',
        key: 'simpleCode',
        width: '13%',
        render: (text, record, index) => {
          return text;
        }
      }, {
        title: '机构编码',
        dataIndex: 'orgCode',
        key: 'orgCode',
        width: '13%',
        render: (text, record, index) => {
          return text;
        }
      }, {
        title: '机构类型',
        dataIndex: 'orgType',
        key: 'orgType',
        width: '13%',
        render: (text, record, index) => {
          if (this.state.orgTypeCode != null && this.state.orgTypeCode != '') {
            this.state.orgTypeCode.forEach(function (val) {
              if (val.value == text) {
                text = val.label;
              }
            });
            return text;
          }
          /* Common_OrgManageScopeCd
           return this.props.sta.updateId==record.orgId ? <input className="tableInput orgType" type="text" defaultValue={text}/> : text;*/
        }
      }, {
        title: '负责人',
        dataIndex: 'master',
        width: '13%',
        key: 'master',
        render: (text, record, index) => {
          return text;
        }
      }, {
        title: '排序',
        width: '13%',
        className: 'sortingCenter',
        render: (record) => {
          return <span className="curdStyle">
                    <a className="wards upwards"
                       onClick={this.updateOrgSort.bind(this, record.orgId,
                           "up")}> <Icon style={{fontSize: '15px'}}
                                         type="up-circle-o"/> </a>
                    <a className="wards downwards"
                       onClick={this.updateOrgSort.bind(this, record.orgId,
                           "down")}> <Icon
                        style={{fontSize: '15px', paddingLeft: '4%'}}
                        type="down-circle-o"/> </a>
                </span>;
        }
      }
    ];

    const rowSelection = {
      selectedRowKeys: this.state.selectedRowKeys,
      onChange: this.onTableSelectChange,

      getCheckboxProps: record => ({
        disabled: record.parentIds.indexOf(',2,') > 1 || record.orgId == '2',    //设置**不可选择
      }),
    };

    return (
        <div>
          <div className="db-table-button">
            <Row>
              <Col span={24} style={{textAlign: 'left'}}>
                <Checkbox checked={hasSelected}
                          onChange={this.onResetSelectedRowKeys}>
                  <span>{hasSelected ? this.state.selectedRowKeys.length
                      : ''}</span>
                </Checkbox>
                <ButtonGroup>
                  {
                    <Button type="primary" onClick={this.onClickInsert}>
                      <Icon type="plus-circle-o"/> 新增
                    </Button>
                  }{
                  <Button type="primary" disabled={!hasSelected || !oneSelected}
                          onClick={this.onClickUpdate}>
                    <Icon type="edit"/> 修改
                  </Button>
                }{
                  <Button type="primary" disabled={!hasSelected}
                          onClick={this.onClickDelete}>
                    <Icon type="delete"/> {multiSelected ? '批量删除' : '删除'}
                  </Button>
                }
                </ButtonGroup>
              </Col>
            </Row>
          </div>
          <Table rowSelection={rowSelection} columns={columns}
                 pagination={false} onRowClick={this.handleRowClick}
                 dataSource={this.props.sta.data}
                 scroll={{x: false, y: this.state.scrolHeight - 150}}
                 rowKey="orgId"/>

          <EditAddModel sta={this.state} propsSta={this.props.sta}
                        setState={this.setState.bind(this)}
                        getListData={this.props.getListData.bind(this)}/>

        </div>
    )
  }
}