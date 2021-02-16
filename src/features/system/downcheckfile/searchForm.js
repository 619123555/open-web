import {Button, DatePicker, Form, Select, Tree} from 'antd';
import {RcSearchPanel} from 'testantd'
import Dictionary from "../../../utils/dictionaryItem";

const FormItem = Form.Item;
const Option = Select.Option;
const TreeNode = Tree.TreeNode;
class SearchForm extends React.Component {


    state = {
        fileList: [{
            uid: -1,
            name: 'xxx.png',
            status: 'done',
            url: 'http://www.baidu.com/xxx.png',
        }],
        channelId:'',
        fileData:[],
        dateflag:null,
        Common_DictScope:[]


    }


    constructor(props) {
        super(props);

    }
    componentDidMount() {

        //配置项域
        Dictionary.getInstance().init(["Common_PayRollCD"]).then((value) => {
            this.setState({Common_DictScope: value["Common_PayRollCD"]});
        })

    }

  downBillFile = () => {
    this.props.downBillFile();
  }
    handleReset = () => {
        this.props.form.resetFields();
    }
    onChange1 = (date, d) => {
        console.log(d);
        this.setState({
            dateflag:d
        })
    }


    handleChange = (e) => {
        console.log(e+"-------------")
        this.setState({
            channelId:e
        })
    }

  // 拦截文件上传
    beforeUploadHandle=(file)=>{
        console.log("阻止文件上传");
        this.setState(({fileData})=>({
            fileData:[...fileData,file],
        }))

        return false;
    }

  // 文件列表的删除
    fileRemove=(file)=>{
        this.setState(({fileData})=>{
            const index = fileData.indexOf(file);
            return {
                fileData: fileData.filter((_, i) => i !== index)
            }
        })
    }


    render() {

        //配置项域
        let Common_DictScope = null;
        if (this.state.Common_DictScope != null) {
            Common_DictScope = this.state.Common_DictScope.length > 0
                ? this.state.Common_DictScope.map(d =>
                    <Option key={d.value} value={d.value}>{d.label}</Option>) : null;
        }
        console.log('下拉'+Common_DictScope);
        console.log('随机数-----'+Math.random().toString(36).slice(-8));
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
                        [   <FormItem {...formItemLayout} label="通道" key={8}>
                            {getFieldDecorator('channelId')(
                                <Select placeholder="请选择"  onChange={this.handleChange.bind(this)}>
                                    <Option value="">全部</Option>
                                    {Common_DictScope}
                                </Select>
                            )}
                        </FormItem>,
                            <FormItem label="日期"  {...formItemLayout} key={4}>
                                {getFieldDecorator('dateFlag',{
                                    rules: [{required: true, message: '不能为空'}],
                                })(
                                    <DatePicker  onChange={this.onChange1}  />
                                )}
                            </FormItem>,
                        ],
                        [
                            <Button type="primary" onClick={this.downBillFile}
                                    icon="download" title={"下载"}
                                    key={5}>下载</Button>,
                        ]
                    ]}
                </RcSearchPanel>
            </Form>
        );
    }
}

export default Form.create()(SearchForm);