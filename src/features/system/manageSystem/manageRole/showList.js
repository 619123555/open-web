import {
  Button,
  Checkbox,
  Col,
  Icon,
  message,
  Popconfirm,
  Row,
  Table
} from 'antd';
import Fetch from '../../subfetch';
import globalConfig from '../../../../config.js';
import AddRole from './addRole.js';
import EditRole from './editRole'
import AssignRole from './assignRole'

const ButtonGroup = Button.Group;

export default class ShowList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            scrolHeight: document.documentElement.clientHeight,     //浏览器可用高度
            addModelVisible: false,     //新增的弹框
            editModelVisible: false,     //修改的弹框
            assignModelVisible: false,      //修改的弹框
            selectedRowKeys: [],            // 当前有哪些行被选中, 这里只保存key
            selectedRows: [],             //选择的行
        };
    }
    componentWillMount() {

    }
    //新增
    onClickInsert= () =>  {
        this.setState({
            addModelVisible: true
        });
        this.refs['AddRole'].setState({
            selectedKeys:[]
        })
    }
    //修改
    onClickUpdate= () =>  {
        this.setState({
            editModelVisible: true
        });
    }
    //分配
    onClickAssign= () =>  {
        this.setState({ assignModelVisible: true });
    }
    //删除
    onClickDelete = () => {
        //message.info('删除的ID为： '+this.state.selectedRowKeys, 5);
        let dataScope=JSON.stringify(this.state.selectedRowKeys)
        dataScope=dataScope.substring(dataScope.indexOf("[") + 1, dataScope.lastIndexOf("]")).replace(/"/g, "");
        console.log("dataScope:"+dataScope);
        Fetch.getInstance().postWithRequestData("role/deleteRoleData", {
            requestData: {'dataScope': dataScope},
            urlType: "BASE_URL"
        }).then((data)=> {
          if (data.code == 200) {
                console.log("删除角色信息成功");
                //重新清空输入框
                this.props.getListData();
                this.onResetSelectedRowKeys();
            }
        }), (error)=> {
            console.log("错误信息:" + error);
        }
        this.props.getListData();

    }


    /**
     * 处理表格的选择事件
     */
    onTableSelectChange = (selectedRowKeys,selectedRows) => {
        this.setState({
            selectedRows:selectedRows,
            selectedRowKeys:selectedRowKeys,
        });
    };

    //重置已选择的数据
    onResetSelectedRowKeys = () => {
        this.setState({
            selectedRowKeys: [],
            selectedRows: []
        })
    }

    /**
     * 点击行，选中复选框
     * @param record  当前行的记录
     * @param index  选择的第几行（只是一个序号问题）
     */
    handleRowClick = (record) => {
        //此处需要使用 column中的key
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

    render() {
        const hasSelected = this.state.selectedRowKeys.length > 0;  // 是否选择
        const oneSelected = this.state.selectedRowKeys.length == 1; //是否仅仅选择了一项
        const multiSelected = this.state.selectedRowKeys.length > 1;  // 是否选择了多项
        const columns = [
            {
                title: '角色名称',
                dataIndex: 'name',
                key: 'name',
                width: '30%',
                render: (text, record, index) => {
                    return text;
                }
            }, {
                title: '角色编号',
                dataIndex: 'code',
                key: 'code',
                width: '30%',
                render: (text, record, index) => {
                    return text;
                }
            },  {
                title: '状态',
                dataIndex: 'status',
                key: 'status',
                render: (text, record, index) => {
                    return record.status == 1 ? "正常" : "停用";
                }
            }
        ];

        //加载按钮的默认配置 es6中面向对象
        let tableConfig;
        try {
            let tmp = require(`./tableConfig.schema.js`);  // 个性化配置加载失败也没关系
            tableConfig = Object.assign({}, globalConfig.DBTable.default, tmp);  // 注意合并默认配置
        } catch (e) {
            message.error('配置加载失败', 5);
            tableConfig = Object.assign({}, globalConfig.DBTable.default);
        }
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
                                    tableConfig.showInsert &&
                                    <Button type="primary" onClick={this.onClickInsert}>
                                        <Icon type="plus-circle-o"/> 新增
                                    </Button>
                                }{
                                tableConfig.showUpdate &&
                                <Button type="primary" disabled={!hasSelected || !oneSelected}
                                        onClick={this.onClickUpdate}>
                                    <Icon type="edit"/> 修改
                                </Button>
                            }{
                                tableConfig.showAssign &&
                                <Button type="primary" disabled={!hasSelected || !oneSelected}
                                        onClick={this.onClickAssign}>
                                    <Icon type="edit"/> 分配
                                </Button>
                            }{
                                tableConfig.showDelete &&
                                <Popconfirm title= {multiSelected ? '是否批量删除所选' : '是否删除'} onConfirm={this.onClickDelete}>
                                    <Button type="primary" disabled={!hasSelected}>
                                        <Icon type="delete"/> {multiSelected ? '批量删除' : '删除'}
                                    </Button>
                                </Popconfirm>

                            }
                            </ButtonGroup>
                        </Col>
                    </Row>
                </div>
                <Table rowSelection={rowSelection} columns={columns}
                       pagination={false} onRowClick={this.handleRowClick}
                       dataSource={this.props.sta.data}
                       rowKey="id"/>
                <AddRole ref="AddRole" sta={this.state} setState = {this.setState.bind(this)} getListData={this.props.getListData.bind(this)} />
                {
                    hasSelected &&
                    <EditRole sta={this.state} setState = {this.setState.bind(this)} getListData={this.props.getListData.bind(this)} />
                }
                {
                    hasSelected &&
                    <AssignRole sta={this.state} setState = {this.setState.bind(this)} />
                }
            </div>
        )
    }
}