import {Button, DatePicker, Form, Input} from 'antd';
import {RcSearchPanel} from 'testantd'

const FormItem = Form.Item;

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

  render() {
    const {getFieldDecorator} = this.props.form;
    const formItemLayout = {
      labelCol: {span: 5},
      wrapperCol: {span: 19},
    };
    return (
        <Form onSubmit={this.handleSearch}>
          <RcSearchPanel>
            {[
              [<FormItem label="部署地址"  {...formItemLayout} key={1}>
                {getFieldDecorator('hostName')(
                    <Input style={{fontSize: 13}}/>
                )}
              </FormItem>,
                <FormItem label="服务端口"  {...formItemLayout} key={2}>
                  {getFieldDecorator('port')(
                      <Input style={{fontSize: 13}}/>
                  )}
                </FormItem>,
                <FormItem label="服务名称"  {...formItemLayout} key={3}>
                  {getFieldDecorator('serviceName')(
                      <Input style={{fontSize: 13}}/>
                  )}
                </FormItem>,
                <FormItem label="部署日期"  {...formItemLayout} key={4}>
                  <DatePicker onChange={this.onChange}/>
                </FormItem>
              ],
              [
                <Button type="primary" onClick={this.handleSearch}
                        key={6}>查询</Button>,
                <Button style={{marginLeft: 8}}
                        onClick={this.handleReset.bind(this)} key={7}>
                  重置 </Button>
              ]
            ]}
          </RcSearchPanel>
        </Form>
    );
  }
}

export default Form.create()(SearchForm);