import {Button, Form, Input} from 'antd';
import {RcSearchPanel} from 'testantd'

const FormItem = Form.Item;


class SearchForm extends React.Component {
    constructor(props) {
        super(props);
    }
    handleSearch = () => {
        this.props.getListData();
    };
    handleReset = () => {
        this.props.form.resetFields();
    };

    render() {
        const {getFieldDecorator} = this.props.form;
        const formItemLayout = {
            labelCol: {span: 5},
            wrapperCol: {span: 19},
        };
        return (
                <Form onSubmit={this.handleSearch} >
                    <RcSearchPanel>
                        {[
                            [<FormItem label="角色名称"  {...formItemLayout} key={1}>
                                {getFieldDecorator('name')(
                                    <Input style={{fontSize: 13}} />
                                )}
                            </FormItem>,
                                <FormItem label="角色编码"  {...formItemLayout}
                                          key={2}>
                                  {getFieldDecorator('code')(
                                      <Input style={{fontSize: 13}}/>
                                  )}
                                </FormItem>
                            ],
                            [
                            <Button type="primary" onClick={this.handleSearch} key={2}>查询</Button>,
                            <Button style={{marginLeft: 8}} onClick={this.handleReset.bind(this)}  key={3}> 重置 </Button>
                            ]
                        ]}
                    </RcSearchPanel>
                </Form>

        );
    }
}
export default Form.create()(SearchForm);