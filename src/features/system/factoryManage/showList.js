import {Button, Checkbox, Col, Icon, message, Row, Select} from 'antd';
import {RcTable, RcTableData} from 'testantd'
import Fetch from '../subfetch';
import globalConfig from '../../../config';
import CommonTools from 'src/utils/commonTools.js';
import AddModal from './addModel.js';
import EditProduct from "./editModel.js";

const ButtonGroup = Button.Group;

export default class ShowList extends RcTableData {
    constructor(props) {
        super(props);
        this.state = {
            selectedRowKeys: [],             // 当前有哪些行被选中, 这里只保存key
            selectedRows: [],                //选择的行
            editAddModelVisible: false,     //修改和新增的弹框
            editModelVisible: false,//修改的弹框
            assignModelVisible: false, //修改的弹框
            addModelVisible: false,
            addFlag: true,                  //用来标志修改和新增
            genderPCode: [],                 //性别
            UserTypeCd: [],                  //用户类型
            config: {},  //配置管理
        };
    }

    componentWillMount() {

    }
    //新增
    onClickInsert = () => {
        this.setState({
            editAddModelVisible: true,
            addFlag: true
        });
    }
    //绑定代理商
    onClickBindAgent = () => {
        this.setState({
            bindAgentVisible: true,
            addFlag: true
        });
    }
    //修改
    onClickUpdate = () => {
        console.log(this.state.selectedRows[0].id);
        this.setState({
            editModelVisible: true,
            addFlag: false
        });

    }

    //删除
    onClickDelete = () => {
        let delData = {
            id: this.state.selectedRowKeys[0]
        }
        console.log(delData);
        Fetch.getInstance().postWithRequestData("coupon/delteCoupon", {
            requestData: delData
        }).then((data) => {
            if (data.code == 200) {
                message.success(data.data);
                this.props.getListData();
                this.onResetSelectedRowKeys();
            }
        })
    }

    //重置已选择的数据
    onResetSelectedRowKeys = () => {
        this.setState({
            selectedRowKeys: [],
            selectedRows: [],
        })
    }

    render() {
        const Option = Select.Option;
        let config = Object.assign({}, globalConfig.DBTable.default);
        const hasSelected = this.state.selectedRowKeys.length > 0;  // 是否选择
        const oneSelected = this.state.selectedRowKeys.length == 1;
        const multiSelected = this.state.selectedRowKeys.length > 1;  // 是否选择了多项
        const columns = [
            {
                title: '机具型号',
                dataIndex: 'modelNo',
                key: 'modelNo',
                render: (text, record, index) => {
                    return text;
                }
            }, {
                title: '机具名称',
                dataIndex: 'modelName',
                key: 'modelName',
                render: (text, record, index) => {
                    return text;
                }
            }, {
                title: '组件名称',
                dataIndex: 'componentName',
                key: 'componentName',
                render: (text, record, index) => {
                    return text;
                }
            }, {
                title: '厂商编号',
                dataIndex: 'factoryCode',
                key: 'factoryCode',
                render: (text, record, index) => {
                    return text;
                }
            }, {
                title: '厂商简称',
                dataIndex: 'factoryShortName',
                key: 'factoryShortName',
                render: (text, record, index) => {
                    return text;
                }
            }, {
                title: '厂商全称',
                dataIndex: 'factoryFullName',
                key: 'factoryFullName',
                render: (text, record, index) => {
                    return text;
                }
            }, {
                title: '类型',
                dataIndex: 'commuType',
                key: 'commuType',
                render: (text, record, index) => {
                    if (record.commuType === 'GPRS') {
                        return '中国电信';
                    } else if (record.commuType === 'TD') {
                        return '移动联通2g';
                    } else if (record.commuType === 'BLUETOOTH') {
                        return '蓝牙';
                    }
                }
            }, {
                title: '终端版本号',
                dataIndex: 'posVersion',
                key: 'posVersion',
                render: (text, record, index) => {
                    return text;
                }
            },
            // {
            //     title: '创建日期',
            //     dataIndex: 'createTime',
            //     key: 'createTime',
            //     className: 'menu-system-td',
            //     render: (text, record, index) => {
            //         return CommonTools.fmtTimeStampToDateLong(text);
            //     }
            // }, {
            //     title: '最近修改日期',
            //     dataIndex: 'updateTime',
            //     key: 'updateTime',
            //     className: 'menu-system-td',
            //     render: (text, record, index) => {
            //         return CommonTools.fmtTimeStampToDateLong(text);
            //     }
            // }
        ];
        const rowSelection = {
            selectedRowKeys: this.state.selectedRowKeys,
            onChange: this.onTableSelectChange,
        };
        return (
            <div>
                <div className="db-table-button">
                    <Row>
                        <Col span={24}>
                            <Checkbox checked={hasSelected}
                                      onChange={this.onResetSelectedRowKeys}>
                  <span>{hasSelected ? this.state.selectedRowKeys.length
                      : ''}</span>
                            </Checkbox>
                            <ButtonGroup>
                                {
                                    config.showInsert &&
                                    <Button type="primary" onClick={this.onClickInsert}>
                                        <Icon type="plus-circle-o"/> 新增
                                    </Button>
                                }
                                {
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
                <RcTable rowKey={'id'} ref="rcTable" sta={this.state}
                         setState={this.setState.bind(this)} rowSelection={"checkbox"}
                         columns={columns} dataSource={this.props.sta.data}
                         scrollWidthX={1500}/>

                <AddModal sta={this.state} setState={this.setState.bind(this)}
                          getListData={this.props.getListData.bind(this)}
                          onResetSelectedRowKeys={this.onResetSelectedRowKeys.bind(
                              this)}/>
                {
                    hasSelected &&
                    <EditProduct sta={this.state} setState={this.setState.bind(this)}
                                 getListData={this.props.getListData.bind(this)}/>
                }
            </div>
        )
    }
}