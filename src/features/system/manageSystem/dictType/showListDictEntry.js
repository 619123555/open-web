import {Button, Checkbox, Col, Icon, message, Row, Switch} from 'antd';
import {RcTable, RcTableData} from 'testantd'
import globalConfig from '../../../../config.js';
import Fetch from '../../subfetch';
import EditAddModelDictEntry from './editAddModelDictEntry.js';
import DictConfDicyEntry from './dictConfDicyEntry.js';

const ButtonGroup = Button.Group;

export default class ShowList extends RcTableData {
  constructor(props) {
    super(props);
    this.state = {
      dictConfModelVisible: false,    //配置的弹框
      isSelectDictTypeData: false,    //字典项管理是否允许新增
      orgData: null,                   //过滤机构
      fid: null,
      includeType: null,
      channelOrgCode: [],
      ...this.state,
      selDictValue: '',
      selDictLaber: ''
    };
  }

  componentWillMount() {
    Fetch.getInstance().postWithRequestData("filtration/getOrgs",
        {urlType: "BASE_URL"}).then((data) => {
      if (data.data != null) {
        this.setState({
          orgData: data.data,
        });
      }
    }), (error) => {

    }
  }

  // 更改状态
  onDeleteDict(id, status, type) {
    Fetch.getInstance().postWithRequestData("dict/enableDictData", {
      requestData: {'id': id, 'status': status, 'type.value': type},
      urlType: "BASE_URL"
    }).then((data) => {
      if (data.data != null && data.data.status == 200) {
        this.onResetSelectedRowKeys.bind(this);
      } else {
        message.info("处理错误，请刷新重试", 5);
        this.props.getListData();
      }
    }), (error) => {
      message.error(error);
    }
  }

  // 新增
  onClickInsert = () => {
    console.log(this.props.sta.selectDictValue);
    console.log(this.props.sta.selectDictLaber);
    // this.props.sta.dictTypeSelctData.value
    this.setState({
      selDictValue: this.props.sta.selectDictValue,
      selDictLaber: this.props.sta.selectDictLaber
    });
    if (this.props.sta.selectDictValue) {
      super.onClickInsert();
    } else {
      message.warn('新增项目前请先选择一个字典类型', 3);
    }
  }

  //配置
  onClickDictConf = () => {
    this.setState({
      dictConfModelVisible: true,
    });
    //配置加载信息
    let keys = {
      dictId: this.state.selectedRows[0].id
    };
    Fetch.getInstance().postWithRequestData("filtration/getDictFiltration", {
      requestData: keys
    }).then((data) => {
      if (data.data != null && data.data != '') {
        if (data.data.fid != null) {
          this.setState({
            fid: data.data.fid,
            includeType: data.data.includeType,
            channelOrgCode: data.orgs,
          });
        } else {
          this.setState({
            fid: '',
            channelOrgCode: [],
          });
        }
      } else {
        this.setState({
          fid: '',
          includeType: '',
          channelOrgCode: [],
        });
      }
    }), (error) => {
      message.error(error);
    }
  }

  render() {
    const hasSelected = this.state.selectedRowKeys.length > 0;  // 是否选择
    const oneSelected = this.state.selectedRowKeys.length == 1; //是否仅仅选择了一项
    const columns = [
      {
        title: '字典类型名',
        dataIndex: 'label',
        key: 'label1',
        width: '15%',
        render: (text, record, index) => {
          return text;
        },
      }, {
        title: '字典类型值',
        dataIndex: 'value',
        key: 'value1',
        width: '15%',
        render: (text, record, index) => {
          return text;
        },
      }, {
        title: '字典项名',
        dataIndex: 'label',
        key: 'label',
        width: '15%',
        render: (text, record, index) => {
          return text;
        },
      }, {
        title: '字典项值',
        dataIndex: 'value',
        key: 'value',
        width: '15%',
        render: (text, record, index) => {
          return text;
        },
      }, {
        title: '描述',
        dataIndex: 'description',
        key: 'description',
        render: (text, record, index) => {
          return text;
        },
      }, {
        title: '状态',
        dataIndex: 'status',
        key: 'status',
        width: '15%',
        render: (text, record, index) => {
          return <Switch checkedChildren={'正常'}
                         unCheckedChildren={'停用'}
                         defaultChecked={record.status == 0 ? false : true}
                         onChange={this.onDeleteDict.bind(this, record.id,
                             record.status == 0 ? 1 : 0, record.type.value)}
          />;
        },
      }
    ];
    //加载按钮的默认配置 es6中面向对象
    let tableConfig;
    try {
      let tmp = require(`./dictype.schema.js`);  // 个性化配置加载失败也没关系
      tableConfig = Object.assign({}, globalConfig.DBTable.default,
          tmp.DBTable);  // 注意合并默认配置
    } catch (e) {
      message.error('配置加载失败', 5);
      tableConfig = Object.assign({}, globalConfig.DBTable.default);
    }
    return (
        <div>
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
                        <Icon type="plus-circle-o"/> 新增字典
                      </Button>
                    }{
                    tableConfig.showUpdate &&
                    <Button type="primary" disabled={!oneSelected}
                            onClick={this.onClickUpdate.bind(this)}>
                      <Icon type="edit"/> 修改
                    </Button>
                  }{
                    tableConfig.showDictConf &&
                    <Button type="primary" disabled={!oneSelected}
                            onClick={this.onClickDictConf}>
                      <Icon type="edit"/> 配置
                    </Button>
                  }
                  </ButtonGroup>
                </Col>
              </Row>
            </div>
          </div>
          <RcTable rowKey={'id'} sta={this.state}
                   setState={this.setState.bind(this)} columns={columns}
                   rowSelection={"checkbox"}
                   dataSource={this.props.sta.dataDictEntry}/>

          <EditAddModelDictEntry sta={this.state}
                                 dictTypeSelctData={this.props.sta.dictTypeSelctData}
                                 setState={this.setState.bind(this)}
                                 getListData={this.props.getListData.bind(
                                     this)}/>
          {
            //使用技巧，初次加载的时候，不创建初始弹出框，只有进行选择数据了之后再创建
            hasSelected &&
            <DictConfDicyEntry sta={this.state}
                               dictTypeSelctData={this.props.sta.dictTypeSelctData}
                               setState={this.setState.bind(this)}
                               getListData={this.props.getListData.bind(this)}/>
          }
        </div>
    )
  }
}