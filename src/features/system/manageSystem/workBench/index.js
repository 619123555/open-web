import {Col, message, Row} from 'antd';
import AssetPool from './assetPool.js';
import {RcPagination} from 'testantd'
import AssetPrediction from './assetPrediction.js';
import Dictionary from '../../../../utils/dictionaryItem';
import '../../../../css/workBench.css';
import Fetch from '../../subfetch';
import ShowList from './showList.js';

export default class assetBaseDataQuery extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pageTotal: 0,       //当前数据的总条数
      data: [],
      claimStatus: [],
      capitalCD: [],      //资金方
      Common_bussies: [],  //业务类型
      userNo: null
    }
  }

  componentDidMount() {
    this.getListData();
  }

  componentWillMount() {
    Dictionary.getInstance().init("ADS_CapitalCD,Common_bussies").then(
        (value) => {
          this.setState({
            capitalCD: value.ADS_CapitalCD,
            Common_bussies: value.Common_bussies,
          });
        })
  }

  // 把查询条件作为默认值传输
  getListData(keys = {}) {
    keys["pageSize"] = this.refs.paginationData.state.pageSize;
    keys["pageNo"] = this.refs.paginationData.state.pageCurrent;
    Fetch.getInstance().postWithRequestData("workBench/dealtWith", {
      requestData: keys
    }).then((data) => {
      //console.log(data.data.total);
      if (data.code == 200) {
        this.setState({
          data: data.data.page.list,
          pageTotal: Number(data.data.page.total),
          userNo: data.data.userNo
        });
      }
    })
  }

  onConfirmWran(uid) {
    Fetch.getInstance().postWithRequestData("/warn/confirm", {
      requestData: {'id': uid}
    }).then((data) => {
      if (data.code == 200) {
        message.success("操作成功", 5);
        this.getListData();
      }
    })
  }

  render() {
    return (
        <div>
          <div className="main-content">
            <Row gutter={24}>
              <Col className="gutter-row" span={12}>
                <AssetPool/>
              </Col>
              <Col className="gutter-row" span={12}>
                <AssetPrediction sta={this.state}/>
              </Col>
            </Row>
          </div>
          <div className="main-content">
            <Row gutter={24}>
              <Col span={24}>
                <ShowList sta={this.state}
                          getListData={this.getListData.bind(this)}
                          onConfirmWran={this.onConfirmWran.bind(this)}/>
              </Col>
              <RcPagination ref="paginationData"
                            getListData={this.getListData.bind(this)}
                            pageTotal={this.state.pageTotal}/>
            </Row>
          </div>
        </div>

    )
  }
}

