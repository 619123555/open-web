import {Col, message, Row} from 'antd';
import Fetch from '../subfetch';
import {RcPagination} from 'testantd'
import Dictionary from '../../../utils/dictionaryItem.js';
//创建查询框按钮
import CreateForm from './searchForm.js';
// 创建列表组件
import ShowList from './showList.js';

export default class CouponManager extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            pageTotal: 0,             //当前数据的总条数
            data: [],
            Common_DictScope: []     //配置项域
        }
    }
    componentDidMount() {
        //配置项域
        Dictionary.getInstance().init(["Common_DictScope"]).then((value) => {
            this.setState({Common_DictScope: value["Common_DictScope"]});
        })
        this.getListData();
    }

    setLaunchDate = (date) => {
        this.setState({
            beginTime: date

        });
    }

    setEndTimeDate = (date) => {
        this.setState({
            endTime: date
        });
    }

    //把查询条件作为默认值传输
    getListData(keys = {}) {

        keys["pageSize"] = this.refs.paginationData.state.pageSize;
        keys["pageNo"] = this.refs.paginationData.state.pageCurrent;
        keys = Object.assign({}, keys, this.refs.createForm.getFieldsValue());
        // const createDateStartValue = this.refs["createForm"].getForm().getFieldValue(
        //     'startTime');
        // keys["startTime"] = createDateStartValue
        //     ? createDateStartValue.format('YYYY-MM-DD') : '';
        //
        // const createDateEndValue = this.refs["createForm"].getForm().getFieldValue(
        //     'endTime');
        // keys["endTime"] = createDateEndValue ? createDateEndValue.format(
        //     'YYYY-MM-DD') : '';
        Fetch.getInstance().postWithRequestData("terminalFactory/factoryList", {
            requestData: keys
        }).then((data) => {
            if (data.code === 200) {
                this.setState({
                    data: data.data.list,
                    pageTotal: Number(data.data.total),
                });
            } else {
                message.error('查询错误，请重试', 5);
            }
        });
    }
    render() {
        return (
            <Row type="flex" justify="start">
                <Col span={24}>
                    <CreateForm ref="createForm" sta={this.state}
                                getListData={this.getListData.bind(this)}
                                setLaunchDate={this.setLaunchDate.bind(this)}
                                setEndTimeDate={this.setEndTimeDate.bind(this)}/>
                </Col>
                <Col span={24}>
                    <ShowList sta={this.state}
                              getListData={this.getListData.bind(this)}/>
                </Col>
                <RcPagination ref="paginationData"
                              getListData={this.getListData.bind(this)}
                              pageTotal={this.state.pageTotal}/>
            </Row>
        )
    }
}
