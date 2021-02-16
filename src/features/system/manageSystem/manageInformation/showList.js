/**
 * Created by Tan on 2017-6-7.
 */
import {message, Popconfirm, Select, Table, Button, Col, Row, Icon,Checkbox  } from 'antd';
import Fetch from '../../subfetch';
import globalConfig from '../../../../config.js';
//弹出框引入
import EditAddModel from './editAddModel.js';

//定义一些常量变量
const ButtonGroup = Button.Group;

export default class ShowList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            scrolHeight: document.documentElement.clientHeight,     //浏览器可用高度
            addModelVisible: false,     //新增的弹框
            // addRecipientsVisible:false,  //接收人弹框
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
    }
    //删除
    onClickDelete = () => {
        // message.info('删除的ID为： '+this.state.selectedRowKeys, 5);
        let dataScope=JSON.stringify(this.state.selectedRowKeys)
        dataScope=dataScope.substring(dataScope.indexOf("[") + 1, dataScope.lastIndexOf("]")).replace(/"/g, "");
        console.log("dataScope:"+dataScope);
        Fetch.getInstance().postWithRequestData("information/delete", {
            requestData: {'mid': dataScope},
            urlType: "BASE_URL"
        }).then((data)=> {
            const {status} = data;
            if (status == 200) {
                console.log("删除站内信成功");
                //重新清空输入框
                this.props.getListData();
                this.setState({
                    selectedRowKeys: [],
                    selectedRows: [],
                });
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
        var index = selectedRowKeys.indexOf(record.mid);
        if(index != -1) {
            selectedRowKeys.splice(index, 1);
            selectedRows.splice(index, 1);
            this.setState({
                selectedRowKeys:selectedRowKeys,
                selectedRows:selectedRows,
            });
        }else {
            selectedRowKeys.push(record.mid);
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
        const columns = [{
            title: '主题',
            dataIndex: 'title',
            key: 'title',
        }, {
            title: '发送人',
            dataIndex: 'sendPersonName',
            key: 'sendPersonName',
            width:'10%',
        }, {
            title: '归属公司',
            dataIndex: 'company.name',
            key: 'company',
            width:'15%',
        }, {
            title: '归属部门',
            dataIndex: 'office.name',
            key: 'office',
            width:'15%',
        }, {
            title: '接收人（部门）',
            dataIndex: 'repectionPerson',
            key: 'repectionPerson',
            width:'10%',
        }, {
            title: '发送时间',
            dataIndex: 'createDate',
            key: 'createDate',
            width:'15%',
        },{
            title: '是否发送',
            dataIndex: 'isSend',
            key: 'isSend',
            width:'10%',
            render:( text )=>{
                return text == '1' ? ('已发送'):('未发送') ;
            }
        }];

        //加载按钮的默认配置 es6中面向对象
        let  tableConfig = Object.assign({}, globalConfig.DBTable.default);

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
                                        <Icon type="plus-circle-o"/> 发送站内信
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

                <Table rowSelection={rowSelection} columns={columns} pagination={false}  onRowClick={this.handleRowClick} dataSource={this.props.sta.data}
                       scroll={{x:false, y: this.state.scrolHeight - 450}} rowKey="mid"/>
                <EditAddModel sta={this.state} setState = {this.setState.bind(this)} getListData={this.props.getListData.bind(this)} />
            </div>
        )
    }
}
