import { message, Row, Col, Pagination} from 'antd';
import Fetch from '../../subfetch';
import {RcPagination} from 'testantd'
//创建查询框按钮
import CreateForm from './searchForm.js';

// 创建列表组件
import ShowList from './showList.js';

export default class ManageInformation extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            pageTotal: 0,       //当前数据的总条数
            data: [],
        }
    }

    componentDidMount() {
        this.getListData();
    }

    getListData(keys={}){

        const rangeValue = this.refs["createForm"].getForm().getFieldValue('range-picker');
        if(rangeValue != undefined && rangeValue != "") {
            keys["startDate"] = rangeValue[0].format('YYYY-MM-DD');
            keys["endDate"] = rangeValue[1].format('YYYY-MM-DD');
        }
        keys["pageSize"] = this.refs.paginationData.state.pageSize;
        keys["pageNo"] = this.refs.paginationData.state.pageCurrent;

        const selectValue = this.refs["createForm"].getForm().getFieldValue('select-picker');
        if(selectValue != undefined && selectValue != ""){
            keys["isSend"] = selectValue;
        }
        // console.log(keys);
        Fetch.getInstance().postWithRequestData("information/getPageListData",{
            requestData: keys,
            urlType:"BASE_URL"
        }).then((data)=>{
            if(data.status == 200){
                this.setState({
                    data: data.data.list,
                    pageTotal: data.data.count,       //每页的数据总条数
                });
            }else {
                message.error('查询错误，请重试', 5);

            }
        }),(error)=>{
            console.log("系统内部错误:"+error);
        }
    }

    render() {
        return (
            <Row type="flex" justify="start">
                {/*<Col>*/}
                    {/*站内信管理*/}
                {/*</Col>*/}
                {/*form 查询框*/}
                <Col span={24}>
                    <CreateForm ref="createForm" setState={this.setState.bind(this)} sta={this.state} getListData={this.getListData.bind(this)}/>
                </Col>
                {/*数据列表*/}
                <Col span={24}>
                    <ShowList sta={this.state} getListData={this.getListData.bind(this)}/>
                </Col>
                {/*分页*/}
                <RcPagination ref="paginationData" getListData={this.getListData.bind(this)} pageTotal={this.state.pageTotal}/>
            </Row>
        )
    }

}