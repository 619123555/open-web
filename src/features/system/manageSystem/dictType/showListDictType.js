/**
 * Created by zhl on 2017-6-5.
 */
import {Button, Checkbox, Col, Icon, message, Row, Switch} from 'antd';
import {RcTable, RcTableData} from 'testantd'
import Fetch from '../../subfetch';
import globalConfig from '../../../../config.js';
import EditAddModelDictType from './editAddModelDictType.js';
import Dictionary from './../../../../utils/dictionaryItem.js';

const ButtonGroup = Button.Group;

export default class ShowList extends RcTableData {
    constructor(props) {
        super(props);
        this.state = {
            dictLabelModelVisible: false,      //修改的弹框
            Common_DictScope: [],
            ...this.state
        };
    }

    componentWillMount() {
        Dictionary.getInstance().init("Common_DictScope").then((value) => {
            this.setState({
                Common_DictScope: value.Common_DictScope
            });
        })
    }

    //更改状态
    onDeleteDict(id, status) {
        Fetch.getInstance().postWithRequestData("dict/type/enableDictTypeData", {
          requestData: {'id': id, 'status': status}
        }).then((data) => {
          if (data.code == 200) {
                this.onResetSelectedRowKeys.bind(this);
            } else {
                message.info("处理错误，请刷新重试", 5);
                this.getListDataDictType();
            }
        })
    }

    onClickDictLabel = () => {
      console.log(this.state.selectedRows[0]);
        this.props.changeTabsLabel('dictEntry', this.state.selectedRows[0])
    }

    render() {
        const hasSelected = this.state.selectedRowKeys.length > 0;  // 是否选择
        const oneSelected = this.state.selectedRowKeys.length == 1; //是否仅仅选择了一项
        const columns = [
            {
                title: '字典类型名',
                dataIndex: 'label',
                key: 'label',
                width: '20%',
                render: (text, record, index) => {
                    return text;
                }
            }, {
                title: '字典类型值',
                dataIndex: 'value',
                key: 'value',
                width: '20%',
                render: (text, record, index) => {
                    return text;
                }
            }, {
                title: '适用范围',
                dataIndex: 'scope',
                key: 'scope',
                width: '20%',
                className: 'menu-system-td',
                render: (text, record, index) => {
                    this.state.Common_DictScope != null &&
                    this.state.Common_DictScope.forEach(function (val) {
                        if (val.value == record.scope) {
                            text = val.label;
                        }
                    });
                    return text;
                }
            }, {
                title: '描述',
                dataIndex: 'description',
                key: 'description',
                render: (text, record, index) => {
                    return text;
                }
            }, {
                title: '状态',
                dataIndex: 'status',
                key: 'status',
                width: '20%',
                render: (text, record, index) => {
                    return <Switch checkedChildren={'正常'} unCheckedChildren={'停用'}
                                   defaultChecked={record.status == 0 ? false : true}
                                   onChange={this.onDeleteDict.bind(this, record.id, record.status == '0' ? '1' : '0')}
                    />;
                }
            }
        ];
        //加载按钮的默认配置 es6中面向对象
        let tableConfig;
        try {
            let tmp = require(`./dictype.schema.js`);  // 个性化配置加载失败也没关系
            tableConfig = Object.assign({}, globalConfig.DBTable.default, tmp.DBTable);  // 注意合并默认配置
        } catch (e) {
            message.error('配置加载失败', 5);
            tableConfig = Object.assign({}, globalConfig.DBTable.default);
        }

        return (
            <div>
                <div>
                    <div className="db-table-button">
                        <Row>
                            <Col span={24}>
                                <Checkbox checked={hasSelected} onChange={this.onResetSelectedRowKeys.bind(this)}>
                                    <span >{hasSelected ? this.state.selectedRowKeys.length : ''}</span>
                                </Checkbox>
                                <ButtonGroup>
                                    {
                                        tableConfig.showInsert &&
                                        <Button type="primary" onClick={this.onClickInsert.bind(this)}>
                                            <Icon type="plus-circle-o"/> 新增类型
                                        </Button>
                                    }{
                                    tableConfig.showUpdate &&
                                    <Button type="primary" disabled={!oneSelected}
                                            onClick={this.onClickUpdate.bind(this)}>
                                        <Icon type="edit"/> 修改
                                    </Button>
                                }{
                                    tableConfig.showDictLabel &&
                                    <Button type="primary" disabled={!oneSelected}
                                            onClick={this.onClickDictLabel}>
                                        <Icon type="file-text"/> 字典项
                                    </Button>
                                }
                                </ButtonGroup>
                            </Col>
                        </Row>
                    </div>
                </div>

                <RcTable rowKey={'id'} sta={this.state} setState={this.setState.bind(this)} columns={columns} rowSelection={"checkbox"}
                         dataSource={this.props.sta.dataDictType}/>
                <EditAddModelDictType sta={this.state} setState={this.setState.bind(this)}
                                      getDictKey = {this.props.getDictKey.bind(this)}
                                      getListData={this.props.getListData.bind(this)}/>
            </div>
        )
    }
}