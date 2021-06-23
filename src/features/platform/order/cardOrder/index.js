import {Col, Row} from 'antd';
import Fetch from 'features/platform/subfetch';
import {RcPagination} from 'testantd'
import ShowList from './showList.js';
import CreateForm from './searchForm.js';
import Dictionary from '../../../../utils/dictionaryItem.js';

export default class ManagePosition extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      pageTotal: 0,
      totalOrderAmount: 0,
      Common_Channel: [],
      UserTypeCD: [],
      Common_BusinessCode: [],
    }
  }

  /**
   * 在渲染前调用
   */
  componentDidMount() {
    this.getListData();
    // 初始化字典
    Dictionary.getInstance().init("Common_Channel,UserTypeCD,Common_BusinessCode,card_type").then((value) => {
      this.setState({
        Common_Channel: value.Common_Channel,
        UserTypeCD: value.UserTypeCD,
        Common_BusinessCode: value.Common_BusinessCode,
        card_type: value.card_type
      });
        console.log("Common_BusinessCode");
        console.log(this.state.Common_Channel);
    })
  }

  onShowSizeChange(current, pageSize) {
    console.log(current, pageSize);
  }

  /**
   * componentDidMount() 与 componentWillUnmount() 方法被称作生命周期钩子
   */
  componentWillUnmount() {
    console.log("componentWillUnmount");
  }

  getListData(keys = {}) {
    keys["pageSize"] = this.refs.paginationData.state.pageSize;
    keys["pageNo"] = this.refs.paginationData.state.pageCurrent;
    keys = Object.assign({}, keys,
        this.refs['createForm'].getForm().getFieldsValue());

    const rangeTimeValue = this.refs["createForm"].getForm().getFieldValue('timeExpires')
        ? this.refs["createForm"].getForm().getFieldValue('timeExpires') : [];
    if (rangeTimeValue.length>0) {
        keys["timeExpireBegin"] = rangeTimeValue[0] ?
            rangeTimeValue[0].format('YYYY-MM-DD HH:mm:ss') : "";
        keys["timeExpireEnd"] = rangeTimeValue[1] ?
            rangeTimeValue[1].format('YYYY-MM-DD HH:mm:ss') : "";
    }

    console.log("keys:" + keys);
    console.log(keys);
    console.log("keys:" + keys);
    Fetch.getInstance().postWithRequestData("cardOrder/getCardOrderList",
        {requestData: keys}).then((data) => {
      this.setState({
        data: data.data.list,
        pageTotal: data.data.total,
        totalOrderAmount: data.data.totalOrderAmount
      });
    })
    console.log(this.state.data)
  }


  downloadExcel() {
      // let formElement = document.createElement('form');
      // formElement.style.display = "display:none;";
      // formElement.method = 'post';
      // formElement.action = 'http://127.0.0.1:8093/order/export';
      // formElement.target = 'callBackTarget';
      //
      // document.body.appendChild(formElement);
      // formElement.submit();
      // document.body.removeChild(formElement);
  }

  render() {
    return (
        <Row type="flex" justify="start">
          <Col span={24}>
            <CreateForm ref="createForm" sta={this.state}
                        getListData={this.getListData.bind(this)}
                        downloadExcel={this.downloadExcel.bind(this)}/>
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
