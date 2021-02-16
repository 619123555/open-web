import {Col, message, Row} from 'antd';
import Fetch from '../../subfetch';
import {RcPagination} from 'testantd'
import ShowList from './showList.js';
import CreateForm from './searchForm.js';

export default class ManagePosition extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      pageTotal: 0,       //当前数据的总条数
    }
  }

  componentDidMount() {
    this.getListData();
  }

  getListData(keys = {}) {
    keys["pageSize"] = this.refs.paginationData.state.pageSize;
    keys["pageNo"] = this.refs.paginationData.state.pageCurrent;
    keys = Object.assign({}, keys,
        this.refs['createForm'].getForm().getFieldsValue());
    Fetch.getInstance().postWithRequestData("position/showPositionPageData",
        {requestData: keys, urlType: "BASE_URL"}).then((data) => {
      console.log(data.data);
      this.setState({
        data: data.data.list,
        pageTotal: Number(data.data.total),       //每页的数据总条数
      });
    }), (error) => {
      console.log("岗位列表加载失败!" + error);
      message.error("岗位列表加载失败!", 3, callback);
    }
  }

  render() {
    return (
        <Row type="flex" justify="start">
          {/*<Col>*/}
          {/*岗位管理*/}
          {/*</Col>*/}
          {/*form 查询框*/}
          <Col span={24}>
            <CreateForm ref="createForm" sta={this.state}
                        getListData={this.getListData.bind(this)}/>
          </Col>
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