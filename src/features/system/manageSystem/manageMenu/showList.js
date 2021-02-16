import {Button, Checkbox, Col, Icon, message, Row, Select} from 'antd';
import Fetch from '../../subfetch';
import {RcTable} from 'testantd'
import Dictionary from '../../../../utils/dictionaryItem.js';
//弹出框引入
import EditAddModel from './editAddModel.js';

//定义一些常量变量
const ButtonGroup = Button.Group;

export default class ShowList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            scrolHeight: document.documentElement.clientHeight,     //浏览器可用高度
            editAddModelVisible: false,     //修改和新增的弹框
            assignModelVisible: false,      //修改的弹框

            selectedRowKeys: [],            // 当前有哪些行被选中, 这里只保存key
            selectedRows: [],             //选择的行
            addFlag: true,                  //用来标志修改和新增

            common_dictScope: []             //系统字典项
        };
    }

    componentWillMount() {
        //系统字典
        Dictionary.getInstance().init(["Common_DictScope"]).then((value)=> {
            this.setState({common_dictScope: value["Common_DictScope"]});
        })
    }

    //新增
    onClickInsert = () => {
        this.setState({
            editAddModelVisible: true,
            addFlag: true
        });
    }
    //修改
    onClickUpdate = () => {
        this.setState({
            editAddModelVisible: true,
            addFlag: false
        });
    }

    //删除
    onClickDelete = () => {
        if (confirm("确认要删除")) {
//            message.info('删除的ID为： '+this.state.selectedRowKeys, 5);
            let delData = {
                id: this.state.selectedRowKeys[0]
            }
            Fetch.getInstance().postWithRequestData("menu/deleteMenuData", {
                requestData: delData,
                urlType: "BASE_URL"
            }).then((data)=> {
              if (data.code == 200) {
                    message.success("删除成功");
                    this.props.getListData();
                    this.onResetSelectedRowKeys();
                }
            }), (error)=> {
                message.error('删除请求错误，请重试', 5);
            }
        }

    }

  onClickClean = () => {
    let delData = {
      id: 0
    }
    Fetch.getInstance().postWithRequestData("menu/cleanCache", {
      requestData: delData,
    }).then((data) => {
      if (data.code == 200) {
        message.success(data.data, 3);
      } else {
        message.error(data.message, 3);
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

    //排序
    updateOrgSort(menuId, type) {
        let date = {
            id: menuId,
            "type": type
        }
        Fetch.getInstance().postWithRequestData("menu/updateMenuSort", {
            requestData: date,
            urlType: "BASE_URL"
        }).then((data)=> {
            const {status} = data;
            if (status == 200) {
                this.props.getListData();

            }
        }), (error)=> {
            console.log("111...." + error);
        }

    }


    render() {
        const Option = Select.Option;
        const hasSelected = this.state.selectedRowKeys.length > 0;  // 是否选择
        const oneSelected = this.state.selectedRowKeys.length == 1; //是否仅仅选择了一项
        const multiSelected = this.state.selectedRowKeys.length > 1;  // 是否选择了多项

        const columns = [
            {
                title: '菜单名称',
                dataIndex: 'name',
                key: 'name',
                width: '20%',
                render: (text, record, index) => {
                    return text;
                }
            }, {
                title: '链接',
                dataIndex: 'to',
                key: 'to',

                render: (text, record, index) => {
                    return text;
                }
            }, {
                title: '系统',
                dataIndex: 'systemSign',
                key: 'systemSign',
                width: '13%',
                render: (text, record, index) => {
                    if (this.state.common_dictScope != null && this.state.common_dictScope != '') {
                        this.state.common_dictScope.forEach(function (val) {
                            if (val.value == text) {
                                text = val.label;
                            }
                        });
                        return text;
                    }
                }
            }, {
                title: '是否显示',
                dataIndex: 'isShow',
                key: 'isShow',
                width: '13%',
                render: (text, record, index) => {


                    return text == 0 ? '隐藏' : '显示';
                    /* Common_OrgManageScopeCd
                     return this.props.sta.updateId==record.orgId ? <input className="tableInput orgType" type="text" defaultValue={text}/> : text;*/
                }
            }, {
                title: '备注',
                dataIndex: 'remarks',
                width: '13%',
                key: 'remarks',
                render: (text, record, index) => {
                    return text;
                }
            }, {
                title: '排序',
                width: '13%',
                className: 'sortingCenter',
                render: (record)=> {
                    return <span className="curdStyle">
                    <a className="wards upwards" onClick={this.updateOrgSort.bind(this, record.menuId, "up")}> <Icon
                        style={{fontSize: '15px'}} type="up-circle-o"/> </a>
                    <a className="wards downwards" onClick={this.updateOrgSort.bind(this, record.menuId, "down")}> <Icon
                        style={{fontSize: '15px', paddingLeft: '4%'}} type="down-circle-o"/> </a>
                </span>;
                }
            }
        ];


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
                                    <Button type="primary" onClick={this.onClickInsert}>
                                        <Icon type="plus-circle-o"/> 新增
                                    </Button>
                                }{
                                <Button type="primary" disabled={!hasSelected || !oneSelected}
                                        onClick={this.onClickUpdate}>
                                    <Icon type="edit"/> 修改
                                </Button>
                            }{
                                <Button type="primary" disabled={!hasSelected}
                                        onClick={this.onClickDelete}>
                                    <Icon type="delete"/> {multiSelected ? '批量删除' : '删除'}
                                </Button>
                            } {
                                <Button type="primary"
                                        onClick={this.onClickClean}>
                                    <Icon type="plus-circle-o"/> 刷新缓存
                                </Button>
                            }
                            </ButtonGroup>
                        </Col>
                    </Row>
                </div>

                <RcTable rowKey={'menuId'} ref="rcTable" sta={this.state} setState={this.setState.bind(this)} rowSelection={"checkbox"}
                         columns={columns} dataSource={this.props.sta.data}/>
                <EditAddModel sta={this.state} setState={this.setState.bind(this)}
                              getListData={this.props.getListData.bind(this)}
                              onResetSelectedRowKeys={this.onResetSelectedRowKeys.bind(this)}/>
            </div>
        )
    }
}