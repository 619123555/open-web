import {Button, DatePicker, TimePicker, Form, Input, Select} from 'antd';
import {RcSearchPanel} from 'testantd'
import moment from 'moment';
import {RangePickerProps} from "antd/lib/date-picker";

const FormItem = Form.Item;
const RangePicker = DatePicker.RangePicker;

class SearchForm extends React.Component {
  constructor(props) {
    super(props);
  }

  handleSearch = () => {
    this.props.getListData();
  }
  handleReset = () => {
    this.props.form.resetFields();
  }
  handleDownloadExcel = () => {
    this.props.downloadExcel();
  }

  render() {
    const {getFieldDecorator} = this.props.form;
    const formItemLayout = {
      labelCol: {span: 8},
      wrapperCol: {span: 39},
    };
    const dateFormat = 'YYYY-MM-DD';
    // TimePicker.format("YYYY-MM-DD HH:mm:ss");
      console.log(TimePicker);
    TimePicker.format = "YYYY-MM-DD HH:mm:ss";
      console.log("TimePicker");
    console.log(TimePicker);
      console.log(RangePicker);
    let com_hannels = this.props.sta.Common_Channel != null
      && this.props.sta.Common_Channel.length > 0
          ? this.props.sta.Common_Channel.map(
              d => <Option key={d.value} value={d.value}>{d.label}</Option>) : [];
    let Common_BusinessCode = this.props.sta.Common_BusinessCode != null
    && this.props.sta.Common_BusinessCode.length > 0
        ? this.props.sta.Common_BusinessCode.map(
            d => <Option key={d.value} value={d.value}>{d.label}</Option>) : [];
    let pay_type = this.props.sta.pay_type != null
    && this.props.sta.pay_type.length > 0
        ? this.props.sta.pay_type.map(
            d => <Option key={d.value} value={d.value}>{d.label}</Option>) : [];
    return (
        <Form onSubmit={this.handleSearch}>
          <RcSearchPanel formJustify='center' colNum={3}>
            {[
              [<FormItem label="流水号"  {...formItemLayout} key={1}>
                {getFieldDecorator('tradeNo')(
                    <Input style={{fontSize: 13}}/>
                )}
              </FormItem>,
                <FormItem label="订单状态"  {...formItemLayout} key={2}>
                  {getFieldDecorator('status')(
                      <Select placeholder="请选择" allowClear>
                        {pay_type}
                      </Select>
                  )}
                </FormItem>,
                <FormItem label="完成时间"  {...formItemLayout} key={3}>
                  {
                    getFieldDecorator('timeExpires', {
                      rules: [{required: true, message: '请输入支付时间'}],
                    })
                    (
                        <RangePicker showTime format="YYYY-MM-DD HH:mm:ss"/>
                    )
                  }
                </FormItem>,
                <FormItem label="通道"  {...formItemLayout} key={4}>
                  {getFieldDecorator('channelId')(
                      <Select placeholder="请选择" allowClear>
                        {com_hannels}
                      </Select>
                  )}
                </FormItem>
              ],
              [
                <Button type="primary" onClick={this.handleSearch}
                        key={2} icon="search" title={"查询"}/>,
                <Button style={{marginLeft: 8}} onClick={this.handleReset.bind(this)}
                        key={6} icon="sync" title={"重置"}/>
                // <Button style={{marginLeft: 8}}
                // onClick={this.handleDownloadExcel} key={9} icon="download" title={"下载excel"}/>
              ]
            ]}
          </RcSearchPanel>
        </Form>
    );
  }
}

export default Form.create()(SearchForm);