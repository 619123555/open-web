/**
 * Created by zhl on 2017-6-5.
 */
import {Button, Form, Input, Select} from 'antd';
import {RcSearchPanel} from 'testantd'

const FormItem = Form.Item;
const Option = Select.Option

class SearchForm extends React.Component {
  constructor(props) {
    super(props);
  }

  handleSearch = () => {
    let keys = this.props.form.getFieldsValue();
    this.props.getListData(keys);
  }

  handleReset = () => {
    this.props.form.resetFields();
  }
  handleChange = (seactItemTypeValue) => {
    console.log(seactItemTypeValue);
    this.props.onChangeSelectDict(seactItemTypeValue);
  }

  render() {
    const {getFieldDecorator} = this.props.form;
    const formItemLayout = {
      labelCol: {span: 5},
      wrapperCol: {span: 19},
    };
    //字典类型
    let Select_DictType = this.props.sta.Common_DictType != null
    && this.props.sta.Common_DictType.length > 0
        ? this.props.sta.Common_DictType.map(
            item => <Option value={item.value}
                            key={item.value}>{item.label}</Option>
        )
        : null;
    // 过滤机构
    let Select_DictOrg = this.props.sta.Common_DictOrg != null
    && this.props.sta.Common_DictOrg.length > 0
        ? this.props.sta.Common_DictOrg.map(
            item => <Option key={item.value}>{item.label}</Option>
        )
        : null;
    return (
        <Form>

          <RcSearchPanel formJustify="left" colNum={2}>
            {[
              [
                <FormItem label="字典类型"  {...formItemLayout} key={1}>
                  {getFieldDecorator('dictType',
                      {initialValue: {key: `${this.props.sta.dictTypeSelctData.value}`}})(
                      <Select labelInValue showSearch placeholder="请选择"
                              allowClear onChange={this.handleChange}>
                        {Select_DictType}
                      </Select>
                  )}
                </FormItem>,
                <FormItem label="过滤机构"  {...formItemLayout} key={2}>
                  {getFieldDecorator('channelOrgCode')(
                      <Select showSearch placeholder="请选择" allowClear>
                        {Select_DictOrg}
                      </Select>
                  )}
                </FormItem>,
                <FormItem label="字典项名"  {...formItemLayout} key={3}>
                  {getFieldDecorator('labelName')(
                      <Input/>
                  )}
                </FormItem>,
                <FormItem label="字典项值"  {...formItemLayout} key={4}>
                  {getFieldDecorator('value')(
                      <Input/>
                  )}
                </FormItem>
              ], [
                <Button type="primary" onClick={this.handleSearch.bind(this)}
                        key={5}>查询</Button>,
                <Button style={{paddingLeft: 8}}
                        onClick={this.handleReset.bind(this)}
                        key={6}>重置</Button>
              ]
            ]}
          </RcSearchPanel>
        </Form>

    );
  }
}

export default Form.create()(SearchForm);