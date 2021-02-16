/**
 * Created by zhl on 2017-6-5.
 */
import {Form,Button, Input} from 'antd';
import {RcSearchPanel} from 'testantd'
const FormItem = Form.Item;

class SearchFormType extends React.Component {
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
                <RcSearchPanel formJustify='left' colNum={2}>
                    {[
                        [
                            <FormItem label="字典类型名"  {...formItemLayout} key={1}>
                                {getFieldDecorator('labelName')(
                                    <Input />
                                )}
                            </FormItem>,
                            <FormItem label="字典类型值"  {...formItemLayout} key={2}>
                                {getFieldDecorator('value')(
                                    <Input  />
                                )}
                            </FormItem>
                        ],[
                            <Button type="primary" onClick={this.handleSearch} key={5}>查询</Button>,
                            <Button style={{paddingLeft: 8}} onClick={this.handleReset.bind(this)}  key={6}> 重置 </Button>
                        ]
                    ]}
                </RcSearchPanel>
            </Form>

        );
    }
}
export default Form.create()(SearchFormType);