import {message,Switch,Table,Button,Checkbox,Col,Icon, Row,Popconfirm,EditableCell,Pagination,Tree,Form} from 'antd';
import Fetch from '../../subfetch';
import globalConfig from '../../../../config.js'
import Dictionary from '../../../../utils/dictionaryItem.js';
import PositionForm from './positionForm.js';
import PositionShow from './positionShow.js';

const ButtonGroup = Button.Group;


export default class ShowList extends React.Component{
    constructor(props){
        super(props);
        this.state={
            flag:true,          //新增1，修改为数据ID
            ResourceStateCD:[], //状态
            pCode:null,    //新增时的岗位代码

            scrolHeight: document.documentElement.clientHeight - 370,
            editAddModelVisible: false,     //修改和新增的弹框
            assignModelVisible: false,      //修改的弹框
            showVisible:false,          // 展现对话框
            selectedRowKeys: [],        // 当前有哪些行被选中, 这里只保存key
            selectedRows: [],           //保存选中行中的对象
            selectedData:null,          //选中的数据展示

            checkedKeys:[],     //新增或编辑时选择的机构数
            treeTotal:[],        //机构总数
            indeterminate:true,    //设置 indeterminate 状态，只负责样式控制
            checkAll:false,         //指定当前全选是否选中
        }
    }

    componentWillMount() {
        //状态
        Dictionary.getInstance().init("ResourceStateCD").then((value)=> {
            this.setState({ResourceStateCD: value.ResourceStateCD});
        }), (error) => {
            message.error('字典项错误，请重试');
        }
    }

    getPositionCode(){
        Fetch.getInstance().postWithRequestData("position/getPositionCode",{urlType:"BASE_URL"}).then((data)=>{
            const {status} = data;
            if (status == 200) {
                this.setState({pCode:data.data.code});
            } else {
                message.error('获取岗位代码错误!');
            }
        }), (error) => {
            message.error('获取岗位代码错误!');
        }
    }

    //新增
    onClickInsert= () =>  {
        //查询并返回岗位代码
        this.getPositionCode();
        this.setState({
            editAddModelVisible: true,
            flag: true,
            showVisible: false,
            indeterminate:false,
        });
    }

    //修改
    onClickUpdate= () =>  {
        if(this.state.selectedRows[0].orgIdList.length == this.state.treeTotal.length){
            this.setState({checkAll:true});
        }
        this.setState({
            editAddModelVisible: true,
            flag: false,
            showVisible: false,
            checkedKeys:this.state.selectedRows[0].orgIdList,
        });
    }
    //删除
    onClickDelete = () => {
        if(confirm("确认要删除")) {
            //message.info('删除的ID为： '+this.state.selectedRowKeys, 5);
            // let delData = {
            //     id: this.state.selectedRowKeys[0]
            // }

            let dataScope=JSON.stringify(this.state.selectedRowKeys)
            dataScope=dataScope.substring(dataScope.indexOf("[") + 1, dataScope.lastIndexOf("]")).replace(/"/g, "");
            console.log("dataScope="+dataScope);
            Fetch.getInstance().postWithRequestData("position/deletePositions", {
                //requestData: delData,
                requestData: {'dataScope': dataScope},
                urlType: "BASE_URL"
            }).then((data)=> {
                const {status} = data;
                if (status == 200) {
                    message.success(data.data.message.object);
                    this.props.getListData();
                    this.setState({
                        selectedRowKeys: [],  // 当前有哪些行被选中, 这里只保存key
                        selectedRows: [],
                    });
                } else {
                    message.error('删除操作错误，请重试');
                }
            }), (error) => {
                message.error('删除请求错误，请重试');
            }
        }
    }

    /**
     * 处理表格的选择事件
     * @param selectedRowKeys
     */
    onTableSelectChange = (selectedRowKeys,selectedRows) => {
        this.setState({
            selectedRows:selectedRows,
            selectedRowKeys:selectedRowKeys,
        });
    }

    onResetSelectedRowKeys = () => {
        this.setState({
            selectedRowKeys: [],
            selectedRows: [],
        })
    }

    handleRowClick = (record) => {
        let selectedRowKeys = this.state.selectedRowKeys;
        let selectedRows = this.state.selectedRows;
        var index = selectedRowKeys.indexOf(record.id);
        if(index != -1) {
            selectedRowKeys.splice(index, 1);
            selectedRows.splice(index, 1);
            this.setState({
                selectedRowKeys:selectedRowKeys,
                selectedRows:selectedRows,
            });
        }else {
            selectedRowKeys.push(record.id);
            selectedRows.push(record);
            this.setState({
                selectedRows:selectedRows,
                selectedRowKeys:selectedRowKeys,
            });
        }
    }

    positionShow(record){
        this.setState({
            editAddModelVisible: false,
            flag: false,
            showVisible: true,
            selectedData: record,
        });
    }

    getListData(){
        this.props.getListData();
    }

    render(){
        let config = Object.assign({},globalConfig.DBTable.default);
        const hasSelected = this.state.selectedRowKeys.length > 0;  // 是否选择
        const oneSelected = this.state.selectedRowKeys.length == 1; //是否仅仅选择了一项
        const multiSelected = this.state.selectedRowKeys.length > 1;  // 是否选择了多项

        const columns=[{
            title:'岗位名称',
            dataIndex:'name',
            key:'name',
            width:'20%',
            render:(text,record,index)=>{
                return text;
            }
        },
        {
            title:'岗位代码',
            dataIndex:'code',
            key:'code',
            width:'20%',
            render:(text,record,index)=>{
                return text;
            }
        },
        {
            title:'状态',
            dataIndex:'status',
            key:'status',
            width:'18%',
            render: (text, record, index) => {
                let ResourceStateCD = this.state.ResourceStateCD.map(d => <Option title={d.value} key={d.value} value={d.value}>{d.label}</Option>);
                this.state.ResourceStateCD.forEach(function (val) {
                    if(val.value==text){
                        text=val.label;
                    }
                });
                return text;
            }
        },
        {
            title:'备注',
            dataIndex:'remarks',
            key:'remarks',
            width:'20%',
            render:(text,record,index)=>{
                return text;
            }
        },
        {
            title:'所属机构',
            dataIndex:'belong',
            key:'belong',
            width:'20%',
            render:(text,record,index) =>{
                return <span> <a href="javascript:;" onClick={this.positionShow.bind(this,record)} >已选择{record.orgIdList.length}个</a></span>;
            }
        }];

        const rowSelection = {
            selectedRowKeys: this.state.selectedRowKeys,
            onChange: this.onTableSelectChange,
        };

        return (
            <div>
                <div className="db-table-button">
                    <Row>
                        <Col span={24}>
                            <Checkbox checked={hasSelected} onChange={this.onResetSelectedRowKeys}>
                                <span >{hasSelected ? this.state.selectedRowKeys.length : ''}</span>
                            </Checkbox>
                            <ButtonGroup>
                                {
                                    config.showInsert &&
                                    <Button type="primary" onClick={this.onClickInsert}>
                                        <Icon type="plus-circle-o"/> 新增
                                    </Button>
                                }{
                                    config.showUpdate &&
                                    <Button type="primary" disabled={!hasSelected || !oneSelected}
                                            onClick={this.onClickUpdate}>
                                        <Icon type="edit"/> 修改
                                    </Button>
                                }{
                                    config.showDelete &&
                                    <Button type="primary" disabled={!hasSelected}
                                            onClick={this.onClickDelete}>
                                        <Icon type="delete"/> {multiSelected ? '批量删除' : '删除'}
                                    </Button>
                                }
                            </ButtonGroup>
                        </Col>
                    </Row>
                </div>
                <Table rowKey={'id'} ref="rcTable" columns={columns} pagination={false} rowSelection={rowSelection} onRowClick={this.handleRowClick} dataSource={this.props.sta.data}/>
                <PositionForm sta={this.state} setState = {this.setState.bind(this)} getListData = {this.props.getListData.bind(this)}/>
                <PositionShow sta={this.state} setState = {this.setState.bind(this)} />
            </div>
        )
    }


}