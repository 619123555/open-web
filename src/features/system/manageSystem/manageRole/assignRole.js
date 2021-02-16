import {
  Button,
  Col,
  Form,
  Icon,
  Input,
  message,
  Modal,
  Pagination,
  Popconfirm,
  Row,
  Table
} from 'antd';
import Fetch from '../../subfetch';
import {RcCol, RcInputGroup} from 'testantd'
import '../../../../css/manageRole.css';
import AssignUserRole from './assignUserRole.js'

const FormItem = Form.Item;
const ButtonGroup = Button.Group;

class AssignRole extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            userList: [],
            page:{} //分页
        }
    }

    hideModelHandler = ()=> {
        this.props.setState({
            assignModelVisible: false
        })
    };
    componentWillReceiveProps() {
        this.showRoleUser(0);
    }
    refreshAssignUserList(pageNumber) {
        this.showRoleUser(pageNumber);
    }

    okHandler() {
        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log('数据为', values);
                this.hideModelHandler();
            } else {
                message.warn('数据格式有误', 5);
            }
        });
    };

    onDelUserRole(uid) {
        let rid = this.props.sta.selectedRows[0].id;
        Fetch.getInstance().postWithRequestData("role/outRoleData", {
            requestData: {'roleId': rid, 'userId': uid},
            urlType: "BASE_URL"
        }).then((data)=> {
          if (data.code == 200) {
                message.success('用户删除成功!', 5);
                this.showRoleUser(0);

            }
        }), (error)=> {
            console.log("错误信息:" + error);
        }
    }

    showRoleUser(pageNumber) {
        let rid = this.props.sta.selectedRows[0].id;
        let sData = {"id": rid,"pageNo":pageNumber,"pageSize":10};
        Fetch.getInstance().postWithRequestData("role/assignRoleData", {
          requestData: sData
        }).then((data)=> {
            this.setState({
                userList: data.data.page.list,
                page:data.data.page
            });
        }), (error)=> {
            console.log("错误信息:" + error);
        }
    }


    render() {
        const {getFieldDecorator} = this.props.form;
        const formItemLayout = {
            labelCol: {span: 9},
            wrapperCol: {span: 15},
        };
        return (
                <span>
                <Modal title="分配"
                       maskClosable={false}
                       visible={this.props.sta.assignModelVisible} width={1200}
                       onOk={this.okHandler.bind(this)} onCancel={this.hideModelHandler}>
                    <RcInputGroup inputHeight={700} colNum={2}>
                        {[
                            <FormItem {...formItemLayout} label="角色名称" key={1}>
                                {
                                    getFieldDecorator('name', {
                                        initialValue: this.props.sta.selectedRows[0].name
                                    })
                                    (<Input disabled={true}/>)
                                }
                            </FormItem>,
                            <FormItem {...formItemLayout} label="角色编号" key={2}>
                                {
                                    getFieldDecorator('code', {
                                        rules: [{}],
                                        initialValue: this.props.sta.selectedRows[0].code
                                    })(
                                        <Input disabled={true}/>
                                    )
                                }
                            </FormItem>,
                            <RcCol rcSpan={24}  rcLayout="singleRow" key={3}>
                                <ShowAssignUserRole sta={this.state} rid={this.props.sta.selectedRows[0].id} showRoleUser={this.showRoleUser.bind(this)}
                                                    onDelUserRole={this.onDelUserRole.bind(this)}/>
                            </RcCol>
                        ]}
                    </RcInputGroup>
                </Modal>
            </span>
        );
    }
}
class ShowAssignUserRole extends React.Component {
    constructor(props) {
        super(props);
        this.state={
          assignUserRoleVisible: false
        }
    }

    //分配
    assignUser= () =>  {
        this.setState({
            assignUserRoleVisible: true
        });
    }
    refreshAssignUserList() {
        this.props.showRoleUser();
    }
    render() {
        const columns = [{
            title: '归属公司',
            dataIndex: 'company.name',
            key: 'company.name',
        }, {
            title: '归属部门',
            dataIndex: 'office.name',
            key: 'office.name',
        }, {
            title: '工号',
            dataIndex: 'no',
            key: 'no',
        }, {
            title: '姓名',
            dataIndex: 'name',
            key: 'name',
        }, {
            title: '手机',
            dataIndex: 'mobile',
            key: 'mobile',
        }, {
            title: '操作',
            key: 'action',
            render: (text, record) => (
                <span className="curdStyle">
					{
                        <span>
                            {
                                this.props.sta.userList.length >= 1 ?
                                    (
                                        <Popconfirm placement="left" title="是否删除" okText="是" cancelText="否"
                                                    onConfirm={this.props.onDelUserRole.bind(this, record.id)}>
                                            <a className="delTrClass" href="javascript:;">删除</a>
                                        </Popconfirm>
                                    ) : null
                            }
                                </span>
                    }
				</span>
            )
        }];
        return (
            <div >
                <div className="db-table-button">
                    <Row>
                        <Col   style={{textAlign: 'left'}}>
                            <ButtonGroup>
                                {
                                    <Button type="primary" onClick={this.assignUser}>
                                        <Icon type="edit"/> 分配
                                    </Button>
                                }
                            </ButtonGroup>
                        </Col>
                    </Row>
                </div>
                <div>
                   <Table rowKey="id" pagination={false} columns={columns} dataSource={this.props.sta.userList}/>
               </div>
                <div style={{"textAlign":"right"}}>
                    <Pagination current={Number(this.props.sta.page.pageNum)}
                                total={Number(this.props.sta.page.total)}
                                showTotal={total => `总数: ${total} 条`}
                                onChange={this.props.showRoleUser.bind(this)}
                                pageSize={10}/>
                    </div>
                <AssignUserRole refreshAssignUserList={this.refreshAssignUserList.bind(this)}  setState = {this.setState.bind(this)}  sta={this.state} rid={this.props.rid}/>
                </div>

        )
    }
}
export default Form.create()(AssignRole);