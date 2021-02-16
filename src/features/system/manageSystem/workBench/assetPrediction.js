import {Col, message, Row, Select} from 'antd';
import '../../../../css/workBench.css';
import Fetch from '../../subfetch';
import echarts from 'echarts/lib/echarts';
import 'echarts/lib/chart/bar';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';
import 'echarts/lib/component/legend';

export default class AssetPrediction extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            titleList: [],
            listData: [],    //数据列表
            DateList: [],    //日期list

        };
    }

    componentWillMount() {

    }

    getList(value) {
        Fetch.getInstance().postWithRequestData("workBench/assetPrediction",
            {
                requestData: {"capPty": value}
            }).then((data) => {
            if (data.code == 200) {
                this.setState({
                    titleList: data.data.listTitle,
                    listData: data.data.listData,
                    DateList: data.data.listDate,
                    thisDate: data.data.date,

                }, function () {
                    this.myChart();
                });
            } else {
                message.error('查询资产池交易情况错误，请重试', 5);
            }
        })
    }

    capChange(value) {
        this.getList(value);

    }

    componentDidMount() {
        this.getList();
    }

    myChart() {
        let seriesData = [];
        let dataArr = this.state.listData;
        let title = this.state.titleList;
        let date = this.state.DateList;
        for (let i = 0; i < dataArr.length; i++) {
            let data = dataArr[i];
            let dataD = data.splice(1, data.length - 1);
            let obj = {};
            obj.name = data[0] + "（元）";
            obj.type = "bar";
            obj.data = dataD;
            obj.barWidth = "10%";
            seriesData.push(obj);
        }

        if (this.state.listData.length > 0) {
            echarts.dispose(document.getElementById('report-pool-pre'));
            var myChart = echarts.init(document.getElementById('report-pool-pre'));
            myChart.setOption({
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                        type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                    }
                },
                legend: {

                    bottom: "2%",
                    data: this.state.titleList,
                },
                grid: {
                    height: "67%",
                    top: '10%',
                    left: '3%',
                    right: '4%',
                    bottom: "7%",
                    containLabel: true,

                },
                xAxis: [
                    {
                        name: '（元）',
                        nameLocation: 'start',
                        type: 'category',
                        data: this.state.DateList
                    }
                ],
                yAxis: [
                    {
                        type: 'value'
                    }
                ],
                series: seriesData
            });
        }

    }

    render() {
        const Option = Select.Option;
        let capitalCDs = this.props.sta.capitalCD != null
        && this.props.sta.capitalCD.length > 0 ? this.props.sta.capitalCD.map(
            d => <Option
                key={d.value} value={d.value}>{d.label}</Option>) : null;
        return (
            <Row gutter={24}>
                <Col span={24}>
                    <Row justify="space-between">
                        <Col span={8} className={"report-title"}>交易预测(开发中)</Col>
                        <Col span={7} offset={9} className={"report-title"}>
                            <Select
                                showSearch
                                allowClear
                                style={{width: "86%"}}
                                onChange={this.capChange.bind(this)}
                                placeholder="点击输入或选择"
                            >
                                {capitalCDs}
                            </Select>
                        </Col>
                    </Row>
                </Col>
                <Col span={24}>
                    <div id="report-pool-pre" style={{height: "211%"}}>
                        {this.state.listData.length < 1 ?
                            <div style={{paddingTop: 80, paddingLeft: "45%"}}>暂无数据</div>
                            : ""}
                    </div>
                </Col>
            </Row>
        )
    }
}