import {Button, Form, Input} from 'antd';
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

    render() {
        const {getFieldDecorator} = this.props.form;
        const formItemLayout = {
            labelCol: {span: 5},
            wrapperCol: {span: 19},
        };
        return (
                <Form onSubmit={this.handleSearch} >
                    <RcSearchPanel formJustify='center' colNum={4}>
                        {[
                            [
                                <FormItem label="工号"  {...formItemLayout} key={1}>
                                    {getFieldDecorator('no')(
                                        <Input style={{fontSize: 13}} />
                                    )}
                                </FormItem>,
                                <FormItem label="姓名"  {...formItemLayout} key={2}>
                                    {getFieldDecorator('name')(
                                        <Input style={{fontSize: 13}} />
                                    )}
                                </FormItem>,
                                <FormItem label="邮箱"  {...formItemLayout}
                                          key={3}>
                                  {getFieldDecorator('email')(
                                      <Input style={{fontSize: 13}}/>
                                  )}
                                </FormItem>,
                                <FormItem label="手机"  {...formItemLayout}
                                          key={4}>
                                  {getFieldDecorator('mobile')(
                                      <Input style={{fontSize: 13}}/>
                                  )}
                                </FormItem>
                            ],[
                                <Button type="primary" onClick={this.handleSearch} key={5}>查询</Button>,
                                <Button style={{marginLeft: 8}} onClick={this.handleReset.bind(this)}  key={6}> 重置 </Button>
                            ]
                        ]}
                    </RcSearchPanel>
                </Form>

        );
    }
}
export default Form.create()(SearchForm);