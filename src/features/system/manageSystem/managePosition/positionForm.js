import {message,Checkbox,Input,Col,Select, Row,Button,Tree,Modal,Form} from 'antd';
import Fetch from '../../subfetch';
import {RcInputGroup} from 'testantd'
const FormItem = Form.Item;
const Option = Select.Option;
const TreeNode = Tree.TreeNode;

class PositionForm extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            pData:null,
            orgTree: [],        //新增时加载机构树
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
        this.props.setState({treeTotal:data});
    }

    hideModelHandler =()=>{
        this.props.setState({
            editAddModelVisible: false,
            checkedKeys:[],
            orgTree: [],
            checkAll:false,
        })
    }

    //校验岗位选择是否为空
    checkElements(){
        if(this.props.sta.checkedKeys.length == 0 || this.props.sta.checkedKeys == ""){
            message.error("请选择岗位所属机构！");
            return false;
        }
        return true;
    }

    //点击确定进行保存岗位数据
    okHandler(){
        this.props.form.validateFields((err, values) => {
            if(!this.checkElements()){
                return false;
            }
            if (!err) {
                console.log('数据为', values);
                this.props.setState({
                    editAddModelVisible: false
                })
                const gData = values;
                gData.orgList= this.props.sta.checkedKeys;
                console.log("gData = "+gData);
                if(this.props.sta.flag){
                    //新增
                    Fetch.getInstance().postWithRequestData("position/addPositionData",{requestData:values,urlType:"BASE_URL"}).then((data)=>{
                        const {status} = data;
                        if (status == 200) {
                            message.success(data.data.message.object,3,null);
                            this.props.getListData();
                            this.props.form.resetFields();
                            this.props.setState({checkedKeys:[]});
                        } else {
                            message.error(data.data.message.message);
                        }
                    }), (error) => {
                        message.error('新增岗位信息失败!');
                    }
                }else{
                    //修改
                    const gData = values;
                    if(this.props.sta.checkedKeys.length > 0){
                        gData.orgList = this.props.sta.checkedKeys;
                    }else{
                        gData.orgList = this.props.sta.selectedRows[0].orgIdList;
                    }
                    gData.id = this.props.sta.selectedRows[0].id;

                    Fetch.getInstance().postWithRequestData("position/editPositionData",{requestData:values,urlType:"BASE_URL"}).then((data)=>{
                        const {status} = data;
                        if (status == 200) {
                            message.success(data.data.message.object);
                            this.props.getListData();
                            this.props.form.resetFields();
                            this.props.setState({checkedKeys:[]});
                        } else {
                            message.error(data.data.message.message);
                        }
                    }), (error) => {
                        message.error('更新岗位信息失败!');
                    }
                }
            } else {
                message.warn('数据格式有误');
            }
        });
    }

    onCheck = (checkedKeys) => {
        // if(checkedKeys.length != this.props.sta.treeTotal.length){
        //     this.props.setState({checkFlag:false});
        // }else{
        //     this.props.setState({checkFlag:true});
        // }
        // this.props.setState({checkedKeys:checkedKeys});
        //
        this.props.setState({
            checkedKeys:checkedKeys,
            indeterminate: !!checkedKeys.length && (checkedKeys.length < this.props.sta.treeTotal.length),
            checkAll: checkedKeys.length === this.props.sta.treeTotal.length,
        });
    }

    onCheckAllChange = (e) => {
        // if(!e.target.checked){
        //     this.props.setState({checkedKeys:[]});
        // }else{
        //     this.props.setState({checkedKeys:this.props.sta.treeTotal});
        // }
        this.props.setState({
            checkedKeys: e.target.checked ? this.props.sta.treeTotal : [],
            indeterminate: false,
            checkAll: e.target.checked,
        });
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

        let trees = this.props.sta.checkedKeys;
        if(trees == null || trees.length == 0){
            trees = [];
        }

        return(
            <span>
                <Modal title={this.props.sta.flag ? "新增岗位":"修改岗位"}
                    /* 点击对话框外是否允许关闭 false:不予许关闭 */
                       maskClosable={false}
                       visible={this.props.sta.editAddModelVisible} width={800}  onOk={this.okHandler.bind(this)} onCancel={this.hideModelHandler} >
                    <RcInputGroup inputHeight={300} colNum={2}>
                        {[
                            <FormItem {...formItemLayout} label="岗位代码" key={1}>
                                {
                                    getFieldDecorator('code',{
                                        rules:[{}],
                                        initialValue: !this.props.sta.flag ?
                                            this.props.sta.selectedRows.length > 0 ? this.props.sta.selectedRows[0].code : ''
                                            : this.props.sta.pCode,
                                    })
                                    (<Input disabled={true}/>)
                                }
                            </FormItem>,
                            <FormItem {...formItemLayout} label="岗位名称" key={2}>
                                {
                                    getFieldDecorator('name', {
                                        rules: [ { required: true, message: '岗位名称不可为空!'},
                                            {max: 95, message: '岗位名称过长' },
                                            {pattern: /^([A-Za-z]|[\u4E00-\u9FA5]|[0-9])+$/, message: '岗位名称输入有误！'} ],
                                        initialValue: !this.props.sta.flag ?
                                            this.props.sta.selectedRows.length > 0 ? this.props.sta.selectedRows[0].name : ''
                                            : '',
                                    })(<Input />)
                                }
                            </FormItem>,
                            <FormItem {...formItemLayout} label="状态" key={3}>
                                {
                                    getFieldDecorator('status', {
                                        rules: [ { required: true,message: '不能为空' } ],
                                        initialValue: !this.props.sta.flag ?
                                            this.props.sta.selectedRows.length > 0 ? this.props.sta.selectedRows[0].status : ''
                                            : '',
                                    })(
                                        <Select placeholder="请选择">
                                            {ResourceStateCD}
                                        </Select>
                                    )
                                }
                            </FormItem>,
                            <FormItem {...formItemLayout} label="备注" key={4}>
                                {
                                    getFieldDecorator('remarks', {
                                        rules: [ { required: false, message: ''},
                                            {max: 250, message: '备注输入过长' }],
                                        initialValue: !this.props.sta.flag ?
                                            this.props.sta.selectedRows.length > 0 ? this.props.sta.selectedRows[0].remarks : ''
                                            : '',
                                    })(<Input />)
                                }
                            </FormItem>,
                            <FormItem {...formItemLayout} label="已选择" key={5}>
                                {
                                    getFieldDecorator('checked',{
                                        rules: [{}],
                                    })

                                    (
                                        <span>{trees.length} 个</span>
                                    )
                                }
                            </FormItem>,
                            <FormItem {...formItemLayout} label="未选择" key={6}>
                                {
                                    getFieldDecorator('unchecked',{
                                        rules: [{}],
                                    })

                                    (
                                        <span>{this.props.sta.treeTotal.length-trees.length} 个</span>
                                    )
                                }
                            </FormItem>,
                            <FormItem {...formItemLayout} label="所属机构" key={7}>
                                {getFieldDecorator('orgIdList', {
                                })(
                                    <Checkbox onChange={this.onCheckAllChange} indeterminate={this.props.sta.indeterminate} checked={this.props.sta.checkAll}>全选</Checkbox>
                                )}

                                {
                                    <Tree checkable onCheck={this.onCheck.bind(this)} defaultExpandAll={true} checkedKeys={trees}>
                                        {loop(this.state.orgTree)}
                                    </Tree>
                                }
                            </FormItem>
                        ]}
                    </RcInputGroup>
                </Modal>
            </span>
        );
    }
}

export default Form.create()(PositionForm);