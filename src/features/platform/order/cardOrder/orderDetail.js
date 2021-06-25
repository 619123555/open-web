import {Form, Input, Modal, Select, Tree} from 'antd';
import {RcInputGroup} from 'testantd'
import CommonTools from 'utils/commonTools';

const FormItem = Form.Item;
const Option = Select.Option;
const TreeNode = Tree.TreeNode;

class PositionForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pData: null,
      orgTree: [],        //新增时加载机构树
    }
  }

  componentDidMount() {

  }

  setTreeValue(data) {
    if (data.length > 0) {
      data.splice(1, 1);
    }
    this.props.setState({treeTotal: data});
  }

  hideModelHandler = () => {
    this.props.setState({
      editAddModelVisible: false,
      //checkedKeys: [],
      orgTree: [],
      checkAll: false,
    })
  }

  //点击确定
  okHandler() {
    this.props.setState({
      editAddModelVisible: false,
      //checkedKeys: [],
      orgTree: [],
      checkAll: false,
    })
  }

  onCheck = (checkedKeys) => {

  }

  onCheckAllChange = (e) => {
    this.props.setState({
      //checkedKeys: e.target.checked ? this.props.sta.treeTotal : [],
      indeterminate: false,
      checkAll: e.target.checked,
    });
  }

  render() {
    const {getFieldDecorator} = this.props.form;
    const formItemLayout = {
      labelCol: {span: 9},
      wrapperCol: {span: 15},
    };
    //通道
    let card_channel = null;
    console.log(this.props.propsSta.card_channel);
    if (this.props.propsSta.card_channel != null) {
      card_channel = this.props.propsSta.card_channel.length > 0
          ? this.props.propsSta.card_channel.map(d =>
              <Option key={d.value} value={d.value}>{d.label}</Option>) : null;
    }

    return (
        <span>

          <Modal title={"订单详情"}
                 maskClosable={false}
                 visible={this.props.sta.editAddModelVisible} width={800}
                 onOk={this.okHandler.bind(this)} confirmLoading={false} okText={"关闭"}
                 onCancel={this.hideModelHandler}>
              <RcInputGroup inputHeight={300} colNum={2}>
                  {[
                    <FormItem {...formItemLayout} label="商户编号" key={1}>
                      {
                        getFieldDecorator('merchantNo', {
                          rules: [{}],
                          initialValue: this.props.sta.orderInfo.merchantNo,
                        })
                        (<div>{this.props.sta.orderInfo.merchantNo}</div>)
                      }
                    </FormItem>,
                    <FormItem {...formItemLayout} label="渠道订单号" key={2}>
                      {
                        getFieldDecorator('externalNo', {
                          rules: [{}],
                          initialValue: this.props.sta.orderInfo.externalNo,
                        })(<div>{this.props.sta.orderInfo.externalNo}</div>)
                      }
                    </FormItem>,
                    <FormItem {...formItemLayout} label="通道订单号" key={3}>
                      {
                        getFieldDecorator('tradeNo', {
                          rules: [{}],
                          initialValue: this.props.sta.orderInfo.tradeNo,
                        })(<div>{this.props.sta.orderInfo.tradeNo}</div>)
                      }
                    </FormItem>,
                    <FormItem {...formItemLayout} label="创建时间" key={4}>
                      {
                        getFieldDecorator('createDate', {
                          rules: [{}],
                          initialValue: CommonTools.fmtTimeStampToDateLong(this.props.sta.orderInfo.createDate),
                        })(<div>{this.props.sta.orderInfo.createDate}</div>)
                      }
                    </FormItem>,
                    <FormItem {...formItemLayout} label="支付时间" key={5}>
                      {
                        getFieldDecorator('timeExpire', {
                          rules: [{}],
                          initialValue: CommonTools.fmtTimeStampToDateLong(this.props.sta.orderInfo.timeExpire),
                        })(<div>{CommonTools.fmtTimeStampToDateLong(this.props.sta.orderInfo.timeExpire)}</div>)
                      }
                    </FormItem>,
                    <FormItem {...formItemLayout} label="金额" key={6}>
                      {
                        getFieldDecorator('totalAmount', {
                          rules: [{}],
                          initialValue: this.props.sta.orderInfo.totalAmount,
                        })(<div>{this.props.sta.orderInfo.totalAmount}</div>)
                      }
                    </FormItem>,
                    <FormItem {...formItemLayout} label="币种" key={7}>
                      {
                        getFieldDecorator('amountType', {
                          rules: [{}],
                          initialValue: this.props.sta.orderInfo.amountType,
                        })(<div>{this.props.sta.orderInfo.amountType}</div>)
                      }
                    </FormItem>,
                    <FormItem {...formItemLayout} label="交易类型" key={8}>
                      {
                        getFieldDecorator('limitPay', {
                          rules: [{}],
                          initialValue: this.props.sta.orderInfo.businessCode,
                        })(<div>{this.props.sta.orderInfo.businessCode}</div>)
                      }
                    </FormItem>,
                    <FormItem {...formItemLayout} label="通道" key={9}>
                      {
                        getFieldDecorator('channelMerchantNo', {
                          rules: [{}],
                          initialValue: this.props.sta.orderInfo.channelMerchantNo,
                        })(<div>{this.props.sta.orderInfo.channelMerchantNo}</div>)
                      }
                    </FormItem>
                  ]}
              </RcInputGroup>
          </Modal>
      </span>
    );
  }
}

export default Form.create()(PositionForm);
