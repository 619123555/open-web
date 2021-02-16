import {Button, Form, Input, Select} from 'antd';
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

  render() {
    const {getFieldDecorator} = this.props.form;
    const formItemLayout = {
      labelCol: {span: 5},
      wrapperCol: {span: 19},
    };
    let Common_DictScope = this.props.sta.Common_DictScope.length > 0
        ? this.props.sta.Common_DictScope.map(d =>
            <Option key={d.value} value={d.value}>{d.label}</Option>) : null;

    return (
        <Form onSubmit={this.handleSearch}>
          <RcSearchPanel>
            {[
              [<FormItem label="配置项名"  {...formItemLayout} key={1}>
                {getFieldDecorator('confKey')(
                    <Input style={{fontSize: 13}}/>
                )}
              </FormItem>,
                <FormItem label="配置项域"  {...formItemLayout} key={2}>
                  {getFieldDecorator('scope')(
                      <Select placeholder="请选择">
                        {Common_DictScope}
                      </Select>
                  )}
                </FormItem>,
                <FormItem label="状态"  {...formItemLayout} key={1}>
                  {getFieldDecorator('status')(
                      <Input style={{fontSize: 13}}/>
                  )}
                </FormItem>
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