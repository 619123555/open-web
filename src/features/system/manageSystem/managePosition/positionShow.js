import {message,Switch,Input,Button,Col,Select, Row,TreeSelect,Tree,Modal,Form} from 'antd';
const FormItem = Form.Item;
import Fetch from '../../subfetch';
import {RcInputGroup} from 'testantd'
const Option = Select.Option;
const TreeNode = Tree.TreeNode;

class PositionShow extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            pData:null,
            orgTree: [],        //新增时加载机构树
            assignOrgTree:[],   //返现已选择的机构树
            checkedKeys:[],     //
            treeTotal:0,        //机构总数
        }
    }

    componentDidMount(){
        this.getOrgTree();
    }

    //获取归属部门树结构 根据归属公司id
    getOrgTree(){
        Fetch.getInstance().postWithRequestData("organization/showOrgListData",{urlType:"BASE_URL"}).then((data)=>{
            const {status} = data;
            if(status==200){
                this.setState({
                    orgTree:data.data,
                });
                this.setTreeValue(data.selectedKeys);
            }
        }),(error)=>{
            message.error('初始化所属机构错误，请重试');
        }
    }

    setTreeValue(data){
        if(data.length > 0){
            data.splice(1,1);
        }
        this.setState({treeTotal:data.length});
    }

    hideModelHandler =()=>{
        this.props.setState({
            showVisible: false,
            checkedKeys:[],
        })
    }

    closeModal(){
        this.props.setState({
            showVisible: false,
            checkedKeys:[],
        })
    }

    render(){
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: {span: 9},
            wrapperCol: {span: 15},
        };
        //状态
        let ResourceStateCD = this.props.sta.ResourceStateCD.length > 0 ? this.props.sta.ResourceStateCD.map(d => <Option key={d.value} value={d.value}>{d.label}</Option>) : null;
        const loop = data => data.map((item) => {
            if (item.children) {
                return (
                    <TreeNode key={item.key} title={item.orgName}>
                        {loop(item.children)}
                    </TreeNode>
                );
            }
            return <TreeNode key={item.key} title={item.orgName}/>;
        });

        let trees = this.state.checkedKeys;
        if(null == trees || trees.length == 0){
            if(this.props.sta.selectedData != null){
                trees = this.props.sta.selectedData.orgIdList;
            }else{
                trees = [];
            }
        }

        return(
            <span>
                <Modal title={"查看岗位信息"}
                    /* 点击对话框外是否允许关闭 false:不予许关闭 */
                       maskClosable={false} width={800} onCancel={this.hideModelHandler} visible={this.props.sta.showVisible} footer={<Button onClick={this.closeModal.bind(this)} key="cancel">取消</Button>}>
                    <RcInputGroup inputHeight={300} colNum={2}>
                        {[
                            <FormItem {...formItemLayout} label="岗位代码" key={1}>
                                {
                                    getFieldDecorator('code',{
                                        rules:[{}],
                                        initialValue: this.props.sta.selectedData == null ? "" : this.props.sta.selectedData.code,
                                    })
                                    (<Input disabled={true}/>)
                                }
                            </FormItem>,
                            <FormItem {...formItemLayout} label="岗位名称" key={2}>
                                {
                                    getFieldDecorator('name', {
                                        rules: [{}],
                                        initialValue: this.props.sta.selectedData == null ? "" : this.props.sta.selectedData == null ? "" : this.props.sta.selectedData.name,
                                    })(<Input disabled={true}/>)
                                }
                            </FormItem>,
                            <FormItem {...formItemLayout} label="状态" key={3}>
                                {
                                    getFieldDecorator('status', {
                                        rules: [ { required: true,message: '不能为空' } ],
                                        initialValue: this.props.sta.selectedData == null ? "" : this.props.sta.selectedData.status,
                                    })(
                                        <Select placeholder="请选择" disabled>
                                            {ResourceStateCD}
                                        </Select>
                                    )
                                }
                            </FormItem>,
                            <FormItem {...formItemLayout} label="备注" key={4}>
                                {
                                    getFieldDecorator('remarks', {
                                        rules: [{}],
                                        initialValue: this.props.sta.selectedData == null ? "" : this.props.sta.selectedData.remarks,
                                    })(<Input disabled={true}/>)
                                }
                            </FormItem>,
                            <FormItem {...formItemLayout} label="已选择" key={5}>
                                {
                                    getFieldDecorator('orgIdList',{
                                        rules: [{}],
                                    })

                                    (
                                        <span>{trees.length} 个</span>
                                    )
                                }
                            </FormItem>,
                            <FormItem {...formItemLayout} label="未选择" key={6}>
                                {
                                    getFieldDecorator('orgIdList',{
                                        rules: [{}],
                                    })

                                    (
                                        <span>{this.state.treeTotal-trees.length} 个</span>
                                    )
                                }
                            </FormItem>,
                            <FormItem {...formItemLayout} label="所属机构" key={5}>
                                {
                                    getFieldDecorator('orgIdList',{
                                        rules: [{}],
                                    })
                                    (
                                        <Tree checkable checkedKeys = {this.props.sta.selectedData != null ? this.props.sta.selectedData.orgIdList : [""]} defaultExpandAll={true}>
                                            {loop(this.state.orgTree)}
                                        </Tree>
                                    )
                                }
                            </FormItem>
                        ]}
                    </RcInputGroup>
                </Modal>
            </span>
        );
    }
}

export default Form.create()(PositionShow);