import {Table, Form, Input, DatePicker, Col, Button, InputNumber} from 'antd';
import ChildComponent from './workBenchChild/ChildComponent.js';
const FormItem = Form.Item;
import Regex from './../../utils/Regex.js';

const formItemLayout = {
    labelCol: {
        xs: {span: 24},
        sm: {span: 5},
    },
    wrapperCol: {
        xs: {span: 24},
        sm: {span: 12},
    },
};

class WorkBench extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            nameContext: "nameContext12312312",
        }
    }

    getChildContext() {
        return {
            state: this.state,
            setState: this.setState.bind(this)
        }
    }

    onClickBtn = () => {
        let aaa = this.props.form.getFieldsValue();
        if (aaa["datePicker"]) {
            console.log(aaa["datePicker"].format('YYYY-MM-DD'))
        }
        this.setState({
            nameContext: '更改了，更改'
        })
    }

    render() {
        const columns = [
            {
                title: 'Name',
                dataIndex: 'name',
                key: 'name',
                width: '40%',
            }, {
                title: 'Age',
                dataIndex: 'age',
                key: 'age',
                width: '30%',
                render: (text, record, index) => {
                    return Regex.formatNumToMicrometer('￥',',', text );
                }
            }, {
                title: 'Address',
                dataIndex: 'address',
                key: 'address',
            }
        ];
        const {getFieldDecorator, getFieldsError, getFieldError, isFieldTouched} = this.props.form;
        const data = [
            {
                key: 1,
                name: 'John Brown sr.',
                age: 60000,
                address: 'New York No. 1 Lake Park',
                children: [{
                    key: 11,
                    name: 'John Brown',
                    age: 42,
                    address: 'New York No. 2 Lake Park',
                }, {
                    key: 12,
                    name: 'John Brown jr.',
                    age: 30,
                    address: 'New York No. 3 Lake Park',
                    children: [{
                        key: 121,
                        name: 'Jimmy Brown',
                        age: 16,
                        address: 'New York No. 3 Lake Park',
                    }],
                }, {
                    key: 13,
                    name: 'Jim Green sr.',
                    age: 72,
                    address: 'London No. 1 Lake Park',
                    children: [{
                        key: 131,
                        name: 'Jim Green',
                        age: 42,
                        address: 'London No. 2 Lake Park',
                        children: [{
                            key: 1311,
                            name: 'Jim Green jr.',
                            age: 25,
                            address: 'London No. 3 Lake Park',
                        }, {
                            key: 1312,
                            name: 'Jimmy Green sr.',
                            age: 18,
                            address: 'London No. 4 Lake Park',
                        }],
                    }],
                }],
            }, {
                key: 2,
                name: 'Joe Black',
                age: 32,
                address: 'Sidney No. 1 Lake Park',
            }
        ];
// rowSelection objects indicates the need for row selection
        const rowSelection = {
            onChange: (selectedRowKeys, selectedRows) => {
                console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
            },
            onSelect: (record, selected, selectedRows) => {
                console.log(record, selected, selectedRows);
            },
            onSelectAll: (selected, selectedRows, changeRows) => {
                console.log(selected, selectedRows, changeRows);
            },
        };
        return (
            <div>
                <ChildComponent></ChildComponent>
                <Button type="primary" onClick={this.onClickBtn}>点击获取form数据（点击展示context的用法）</Button>

                <Table columns={columns} rowSelection={rowSelection} dataSource={data}/>

                <Form>
                    <FormItem
                        {...formItemLayout}
                        label="Fail"
                    >
                        {getFieldDecorator('Fail', {
                            initialValue: '1000'
                        })(
                            <InputNumber
                                style={{ width: '100%' }}
                                formatter={ Regex.formatNumToMicrometer.bind(this,'￥',' ' ) }
                                parser={ Regex.parserStrToNum.bind(this,'￥',' ')}
                            />
                        )}

                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="Warning"
                        validateStatus="warning"
                    >
                        <InputNumber
                            style={{ width: '100%' }}
                            formatter={ Regex.formatNumToMicrometer.bind(this,'$',' ' ) }
                            parser={ Regex.parserStrToNum.bind(this,'\\$',' ')}
                        />
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="Validating"
                        hasFeedback
                        validateStatus="validating"
                        help="The information is being validated..."
                    >
                        <Input placeholder="I'm the content is being validated" id="validating"/>
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="Success"
                        hasFeedback
                        validateStatus="success"
                    >
                        <Input placeholder="I'm the content" id="success"/>
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="Warning"
                        hasFeedback
                        validateStatus="warning"
                    >
                        <Input placeholder="Warning" id="warning"/>
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="Fail"
                        hasFeedback
                        validateStatus="error"
                        help="Should be combination of numbers & alphabets"
                    >
                        <Input placeholder="unavailable choice" id="error"/>
                    </FormItem>
                    <FormItem label="inline"
                        labelCol={{
                            xs: {span: 24},
                            sm: {span: 5},
                        }}
                        wrapperCol={{
                            xs: {span: 24},
                            sm: {span: 19},
                        }}
                        help
                    >
                        <Col span="6">
                            <FormItem validateStatus="error" label="error" help="Please select the correct date">
                                {getFieldDecorator('datePicker', {})(
                                    <DatePicker />
                                )}
                            </FormItem>
                        </Col>
                        <Col span="1">
                            <p className="ant-form-split">-</p>
                        </Col>
                        <Col span="6">
                            <FormItem label="dataPicker">
                                <DatePicker />
                            </FormItem>
                        </Col>
                    </FormItem>
                </Form>
            </div>

        )
    }
}
WorkBench.propTypes = {
    state : React.PropTypes.object,
    setState: React.PropTypes.func

}
WorkBench.childContextTypes = {
    state : React.PropTypes.object,
    setState: React.PropTypes.func
}
export default Form.create()(WorkBench);