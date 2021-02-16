/**
 * Created by Tan on 2017-6-7.
 */
import {Form, message,DatePicker, Button, Col, Row, Input,Select} from 'antd';
import {RcSearchPanel} from 'testantd'
const FormItem = Form.Item;
const Option = Select.Option;
const RangePicker = DatePicker.RangePicker;

class SearchForm extends React.Component {
    constructor(props) {
        super(props);
    }
    handleSearch = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err) => {
            if (err) {
                return;
            }else if(this.props.form.getFieldValue('select-picker') == undefined){
                return;
            }else {
                this.props.getListData();
            }
        });

    }

    handleReset = () => {
        this.props.form.resetFields();
        this.props.getListData();
    }


    render() {

        const {getFieldDecorator} = this.props.form;
        const formItemLayout = {
            labelCol: {span: 5},
            wrapperCol: {span: 15},
        };

        return (
            <Form onSubmit={this.handleSearch} >
                <RcSearchPanel>
                    {[
                        [<FormItem
                            label="日期"
                            {...formItemLayout}
                            key={1}
                        >
                            {getFieldDecorator('range-picker', {
                                rules: [{
                                    required: true, message: '请选择查询日期！',
                                }],
                            })(
                                <RangePicker />
                            )}

                        </FormItem>,
                        <FormItem
                            {...formItemLayout}
                            key={2}
                        >
                            {getFieldDecorator('select-picker',{
                                rules: [{
                                    required: true, message: '请选择发送状态！',
                                }],
                            })(
                            <Select style={{ width: 100 }} placeholder="发送状态">
                                <Option value="1">已发送</Option>
                                <Option value="0">未发送</Option>
                            </Select>
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