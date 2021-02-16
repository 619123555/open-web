import {Col, message, Row} from 'antd';
import Fetch from '../../subfetch';
import {RcPagination} from 'testantd'
import Dictionary from '../../../../utils/dictionaryItem.js';
import CreateForm from './searchForm.js';
import ShowList from './showList.js';

export default class SysConfig extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pageTotal: 0,             //当前数据的总条数
      data: [],
      launchDate: null,
      Common_DictScope: [],     //配置项域
    }
  }

  componentDidMount() {
    //配置项域
    Dictionary.getInstance().init(["Common_DictScope"]).then((value) => {
      this.setState({Common_DictScope: value["Common_DictScope"]});
    })
    this.getListData();
  }

  setLaunchDate = (date) => {
    this.setState({
      launchDate: date
    });
  }

  //把查询条件作为默认值传输
  getListData(keys = {}) {
    keys["pageSize"] = this.refs.paginationData.state.pageSize;
    keys["pageNo"] = this.refs.paginationData.state.pageCurrent;
    var launchDate = this.state.launchDate;
    if (launchDate != null && launchDate != "") {
      keys["launchDate"] = launchDate;
    }
    keys = Object.assign({}, keys, this.refs.createForm.getFieldsValue());
    Fetch.getInstance().postWithRequestData("conf/serviceListData", {
      requestData: keys
    }).then((data) => {
      if (data.code == 200) {
        this.setState({
          data: data.data.list,
          pageTotal: Number(data.data.total),
        });
      } else {
        message.error('查询错误，请重试', 5);
      }
    });
  }

  render() {
    return (
        <Row type="flex" justify="start">
          <Col span={24}>
            <CreateForm ref="createForm" sta={this.state}
                        getListData={this.getListData.bind(this)}
                        setLaunchDate={this.setLaunchDate.bind(this)}/>
          </Col>
          <Col span={24}>
            <ShowList sta={this.state}
                      getListData={this.getListData.bind(this)}/>
          </Col>
          <RcPagination ref="paginationData"
                        getListData={this.getListData.bind(this)}
                        pageTotal={this.state.pageTotal}/>
        </Row>
    )
  }
}
