import {Button, Form, Input} from 'antd';
import {RcSearchPanel} from 'testantd'

const FormItem = Form.Item;

class SearchForm extends React.Component {
  constructor(props) {
    super(props);
  }

  handleSearch = () => {
    let keys = {
      pageNo: 1,
      pageSize: 10
    };
    this.props.getListData(keys);
  };
  handleReset = () => {
    this.props.form.resetFields();
  };

  onChange = (date, d) => {
    console.log(d);
    this.props.setLaunchDate(d);
  };

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
              [<FormItem label="用户编号"  {...formItemLayout} key={1}>
                {getFieldDecorator('userId')(
                    <Input style={{fontSize: 13}}/>
                )}
              </FormItem>,
                <FormItem label="操作编号"  {...formItemLayout} key={2}>
                  {getFieldDecorator('id')(
                      <Input style={{fontSize: 13}}/>
                  )}
                </FormItem>,
                <FormItem label="用户名称"  {...formItemLayout} key={3}>
                  {getFieldDecorator('userName')(
                      <Input style={{fontSize: 13}}/>
                  )}
                </FormItem>,
                <FormItem label="ip地址"  {...formItemLayout} key={3}>
                  {getFieldDecorator('ip')(
                      <Input style={{fontSize: 13}}/>
                  )}
                </FormItem>,
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