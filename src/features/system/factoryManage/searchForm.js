import {Button, DatePicker, Form, Input, Select} from 'antd';
import {RcSearchPanel} from 'testantd'
const FormItem = Form.Item;
const Option = Select.Option;

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
  onChange = (date, d) => {
    console.log(d);
    this.props.setLaunchDate(d);
  }
  onChange1=(date,d)=>{
    console.log(d);
    this.props.setEndTimeDate(date);

  }

  render() {
    const {getFieldDecorator} = this.props.form;
    const formItemLayout = {
      labelCol: {span: 5},
      wrapperCol: {span: 19},
    };
    const couponStatus = {
    };
    return (
        <Form onSubmit={this.handleSearch}>
          <RcSearchPanel>
            {[
              [<FormItem label="厂商编号"  {...formItemLayout} key={1}>
                {getFieldDecorator('factoryCode')(
                    <Input style={{fontSize: 13}}/>
                )}
              </FormItem>,
                <FormItem label="厂商简称"  {...formItemLayout} key={2}>
                  {getFieldDecorator('factoryShortName')(
                      <Input style={{fontSize: 13}}/>
                  )}
                </FormItem>,
              ],
              [
                <Button type="primary" onClick={this.handleSearch}
                        key={5}>查询</Button>,
                <Button style={{marginLeft: 8}}
                        onClick={this.handleReset.bind(this)} key={6}>
                  重置 </Button>
              ]
            ]}
          </RcSearchPanel>
        </Form>
    );
  }
}


export default Form.create()(SearchForm);
