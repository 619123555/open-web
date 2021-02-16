import {Col, message, Row} from 'antd';
import Fetch from '../../subfetch';
import {RcPagination} from 'testantd'
import CreateForm from './searchForm.js';
import ShowList from './showList.js';

export default class SysLog extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pageTotal: 0,             //当前数据的总条数
      data: [],
      launchDate: null,
    }
  }

  componentDidMount() {
    let keys = {
      pageNo: 1,
      pageSize: 10
    };
    this.getListData(keys);
  }

  setLaunchDate = (date) => {
    this.setState({
      launchDate: date
    });
  };

  //把查询条件作为默认值传输
  getListData(keys) {
    var launchDate = this.state.launchDate;
    if (launchDate != null && launchDate != "") {
      keys["launchDate"] = launchDate;
    }
    keys = Object.assign({}, keys, this.refs.createForm.getFieldsValue());
    Fetch.getInstance().postWithRequestData("conf/logListData", {
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
