import {Col, message, Row} from 'antd';
import Fetch from '../../subfetch';
import {RcPagination} from 'testantd'
//创建查询框按钮
import CreateForm from './searchForm.js';
// 创建列表组件
import ShowList from './showList.js';

export default class manageRole extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pageTotal: 0,       //当前数据的总条数
      data: [],
    }
  }

  componentDidMount() {
    this.getListData();
  }

  //把查询条件作为默认值传输
  getListData(keys = {}) {
    keys["pageSize"] = this.refs['paginationData'].state.pageSize;
    keys["pageNo"] = this.refs['paginationData'].state.pageCurrent;
    keys = Object.assign({}, keys,
        this.refs['createForm'].getForm().getFieldsValue());
    Fetch.getInstance().postWithRequestData("role/showRolePageData", {
      requestData: keys,
      urlType: "BASE_URL"
    }).then((data) => {
      if (data.code == 200) {
        this.setState({
          data: data.data.list,
          pageTotal: Number(data.data.total),       //每页的数据总条数
        });
      } else {
        message.error('查询错误，请重试', 5);
      }
    }), (error) => {
      console.log("系统内部错误");
    }
  }

  render() {
    return (
        <Row type="flex" justify="start">
          <Col span={24}>
            <CreateForm ref="createForm" sta={this.state}
                        getListData={this.getListData.bind(this)}/>
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
