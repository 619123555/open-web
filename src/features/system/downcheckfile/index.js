import {Col, Form, message, Row} from 'antd';
import Fetch from '../subfetch';
import Dictionary from '../../../utils/dictionaryItem.js';
import CreateForm from './searchForm.js';

const FormItem = Form.Item;

export default class CouponManager extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pageTotal: 0,             //当前数据的总条数
      data: [],
      Common_DictScope: [],     //配置项域
      beginTime: null,
      endTime: null
    }
  }

  componentDidMount() {
    //配置项域
    Dictionary.getInstance().init(["Common_ChannelCd"]).then((value) => {
      this.setState({Common_DictScope: value["Common_ChannelCd"]});
    })
    this.getListData();
  }

  setLaunchDate = (date) => {
    this.setState({
      beginTime: date

    });
  }
  setEndTime = (date) => {
    this.setState({
          endTime: date
        }
    );
  }

  //把查询条件作为默认值传输
  getListData(keys = {}) {

    console.log(1111111);

    Fetch.getInstance().postWithRequestData("accountBalance/accountList", {
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

  downBillFile = (keys = {}) => {
    keys = Object.assign({}, keys, this.refs.createForm.getFieldsValue());
    const createDateStartValue = this.refs["createForm"].getForm().getFieldValue(
        'dateFlag');
    keys["dateFlag"] = createDateStartValue
        ? createDateStartValue.format('YYYY-MM-DD') : '';
    console.log(keys);
    Fetch.getInstance().postWithRequestData("baseBank/downloadCheckFile", {
      requestData: keys
    }).then((data) => {
      if (data.code == 200) {
        window.location.href = data.data;
      } else {
        message.error('下载错误，请重试', 5);
      }
    });
  };

  render() {
    return (
        <Row type="flex" justify="start">
          <Col span={24}>
            <CreateForm ref="createForm" sta={this.state}
                        getListData={this.getListData.bind(this)}
                        setLaunchDate={this.setLaunchDate.bind(this)}
                        setEndTime={this.setEndTime.bind(this)}
                        downBillFile={this.downBillFile.bind(this)}/>
          </Col>
          <Col span={24}>
          </Col>

        </Row>
    )
  }
}
