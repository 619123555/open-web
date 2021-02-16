/**
 * Created by zhl on 2017-6-5.
 */
import {Col, message, Row, Tabs} from 'antd';
import ShowListDictType from './showListDictType.js';
import ShowListDictEntry from './showListDictEntry.js';
import CreateFormDictType from './searchFormDictType';
import CreateFormDictEntry from './searchFormDictEntry.js';
import {RcPagination} from 'testantd'
import Fetch from '../../subfetch';
import Dictionary from '../../../../utils/dictionaryItem.js';

const TabPane = Tabs.TabPane;

/**
 * 再利用react来开发项目是的时候，建议大家查看一下ES6 的一些基本语法，如： 箭头函数，解构赋值，default ，export default，延展操作符  等等
 * 特别需要注意的一点就是要注意 组件  this的引用
 * */
export default class DictType extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pageTotalDictEntry: 0,      //字典项管理 == 当前数据的总条数
      pageTotalDictType: 0,       //字典类型管理  == 当前数据的总条数
      dataDictEntry: [],          //字典项管理数据
      dataDictType: [],           //字典类型管理数据
      tabsKey: 'dictType',
      dictTypeSelctData: {
        value: '',
        label: ''
      },
      Common_DictType: [], //字典类型
      Common_DictOrg: [],  //过滤机构,
      selectDictValue: '',
      selectDictLaber: ''
    }
  }

  componentDidMount() {
    this.getListDataDictType();
    this.getListDataDictEntry();
  }

  componentWillMount() {
    this.getDictKey();
  }

  // 获取字典项的值
  getDictKey() {
    Dictionary.getInstance().init("Common_ChannelCd").then((data) => {
      this.setState({
        Common_DictOrg: data.Common_ChannelCd
      });
    })

    //字典类型
    Fetch.getInstance().postWithRequestData("dict/getDictData").then((data) => {
      if (data.code == 200) {
        this.setState({
          Common_DictType: data.data.dataDictTypeList,
        });
      }
    }), (error) => {
      message.info('字典值：字典类型获取出错！', 5);
    }
  }

  onChangeTabs = (key) => {
    this.setState({
      tabsKey: key
    })
  }

  onChangeSelectDict = (key) => {
    this.setState({
      selectDictValue: key.key,
      selectDictLaber: key.label
    })
  }

  //把查询条件作为默认值传输
  getListDataDictType(keys = {}) {
    keys["pageSize"] = this.refs.paginationDataDictType.state.pageSize;
    keys["pageNo"] = this.refs.paginationDataDictType.state.pageCurrent;
    keys = Object.assign({}, keys,
        this.refs.createFormDictType.getForm().getFieldsValue());
    keys['label'] = keys['labelName'];
    Fetch.getInstance().postWithRequestData("dict/type/showDictTypeListData", {
      requestData: keys
    }).then((data) => {
      if (data.code == 200) {
        this.setState({
          dataDictType: data.data.list,
          pageTotalDictType: Number(data.data.total),       //每页的数据总条数
        });
      } else {
        message.error('查询错误，请重试', 5);
      }
    }), (error) => {
      console.log("系统内部错误");
    }
  }

  //把查询条件作为默认值传输
  getListDataDictEntry = (keys = {}) => {
    let dictEntryFormData = this.refs.createFormDictEntry.getForm().getFieldsValue();
    if (dictEntryFormData['dictType']['value']) {
      this.state.dictTypeSelctData = {
        value: dictEntryFormData['dictType']['value'].key,
        label: dictEntryFormData['dictType']['value'].label
      };
      keys['type'] = this.refs.createFormDictEntry.getForm().getFieldValue(
          'dictType').key;
    } else {
      this.state.dictTypeSelctData = {
        value: '',
        label: ''
      };
    }
    keys["pageSize"] = this.refs.paginationDataDictEntry.state.pageSize;
    keys["pageNo"] = this.refs.paginationDataDictEntry.state.pageCurrent;
    keys = Object.assign({}, dictEntryFormData, keys);
    keys['label'] = keys['labelName'];
    Fetch.getInstance().postWithRequestData("dict/showDictListData", {
      requestData: keys
    }).then((data) => {
      console.log(data.code);
      if (data.code == 200) {
        this.setState({
          dataDictEntry: data.data.list,
          pageTotalDictEntry: Number(data.data.total),
        });
      } else {
        message.error('查询错误，请重试', 5);
      }
    });
  }

  //通过 '字典项' 按钮切换页签
  changeTabsLabel = (tabsKey, selectedRows) => {
    console.log(selectedRows);
    this.refs.createFormDictEntry.getForm().setFieldsValue({
      'dictType.value': {
        key: selectedRows.value,
        label: selectedRows.label
      }
    });
    this.setState({
      tabsKey: tabsKey,
    });
    this.refs.showListDictEntry.state.selectedRows = [];
    this.refs.showListDictEntry.state.selectedRowKeys = [];
    this.getListDataDictEntry();
  }

  render() {
    return (
        <Row type="flex" justify="start">
          <Col span={24}>
            <Tabs activeKey={this.state.tabsKey} onChange={this.onChangeTabs}>
              <TabPane tab="字典类型管理" key="dictType">
                <Col span={24}>
                  {/*form 查询框*/}
                  <CreateFormDictType ref="createFormDictType" sta={this.state}
                                      getListData={this.getListDataDictType.bind(
                                          this)}/>
                </Col>
                <Col span={24}>
                  <ShowListDictType ref="showListDictType" sta={this.state}
                                    setState={this.setState.bind(this)}
                                    changeTabsLabel={this.changeTabsLabel.bind(
                                        this)}
                                    getDictKey={this.getDictKey.bind(this)}
                                    getListData={this.getListDataDictType.bind(
                                        this)}/>
                </Col>
                <Col span={24}>
                  <RcPagination ref="paginationDataDictType"
                                getListData={this.getListDataDictType.bind(
                                    this)}
                                pageTotal={this.state.pageTotalDictType}/>
                </Col>
              </TabPane>
              <TabPane tab="字典项管理" key="dictEntry" forceRender={true}>
                <Col span={24}>
                  {/*form 查询框*/}
                  <CreateFormDictEntry ref="createFormDictEntry"
                                       sta={this.state}
                                       getListData={this.getListDataDictEntry.bind(
                                           this)}
                                       onChangeSelectDict={this.onChangeSelectDict.bind(
                                           this)}/>
                </Col>
                <Col span={24}>
                  <ShowListDictEntry ref="showListDictEntry" sta={this.state}
                                     getListData={this.getListDataDictEntry.bind(
                                         this)}
                                     setState={this.setState.bind(this)}
                                     changeTabsLabel={this.changeTabsLabel.bind(
                                         this)}/>
                </Col>
                <Col span={24}>
                  <RcPagination ref="paginationDataDictEntry"
                                getListData={this.getListDataDictEntry.bind(
                                    this)}
                                pageTotal={this.state.pageTotalDictEntry}/>
                </Col>
              </TabPane>
            </Tabs>
          </Col>
        </Row>
    )
  }
}
