import {Col, EditableCell, message, Row} from 'antd';
import Fetch from '../../subfetch';
import ShowList from './showList.js';

export default class ManageOrganization extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          pageTotal: 0,//每页的数据总条数
            data: [],
        }
    }

    componentDidMount() {
        this.getListData();
    }

    //把查询条件作为默认值传输
    getListData() {
        Fetch.getInstance().postWithRequestData("organization/showOrgListData").then((data) => {
          if (data.code == 200) {
                this.setState({
                  data: data.data.data,
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
                    <ShowList sta={this.state} getListData={this.getListData.bind(this)}/>
                </Col>
            </Row>
        )
    }
}
