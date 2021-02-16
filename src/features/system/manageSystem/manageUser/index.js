import {Col, message, Row} from 'antd';
import Fetch from '../../subfetch';
import {RcPagination} from 'testantd'
import CreateForm from './searchForm.js';
import ShowList from './showList.js';

export default class SysConfig extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pageTotal: 0,
      data: [],
    }
  }

  componentDidMount() {
    this.getListData();
  }

  //把查询条件作为默认值传输
  getListData(keys = {}) {
    keys["pageSize"] = this.refs.paginationData.state.pageSize;
    keys["pageNo"] = this.refs.paginationData.state.pageCurrent;
    keys = Object.assign({}, keys, this.refs.createForm.getFieldsValue());
    Fetch.getInstance().postWithRequestData("user/listData", {
      requestData: keys, urlType: "BASE_URL"
    }).then((data) => {
      if (data.code == 200) {
        this.setState({
          data: data.data.list,
          pageTotal: Number(data.data.total),
        });
      } else {
        message.error('查询错误，请重试', 5);
      }
    })
  }

  render() {
    return (
        <Row type="flex" justify="start">
          {/*form 查询框*/}
          <Col span={24}>
            <CreateForm ref="createForm" sta={this.state}
                        getListData={this.getListData.bind(this)}/>
          </Col>
          {/*数据列表*/}
          <Col span={24}>
            <ShowList sta={this.state}
                      getListData={this.getListData.bind(this)}/>
          </Col>
          {/*分页*/}
          <RcPagination ref="paginationData"
                        getListData={this.getListData.bind(this)}
                        pageTotal={this.state.pageTotal}/>
        </Row>
    )
  }
}
