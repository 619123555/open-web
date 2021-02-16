import {Col, message, Row} from 'antd';
import Fetch from '../../subfetch';

import '../../../../css/workBench.css';
import echarts from 'echarts/lib/echarts';
import 'echarts/lib/chart/pie';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';

export default class AssetPool extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            already: 0,
            alreadyPro: "",
            await: 0,
            awaitPro: 0,
            thisDate: "",

        };
    }

    componentWillMount() {

    }

    componentDidMount() {
        Fetch.getInstance().postWithRequestData("workBench/assetUseMonitor", {
            urlType: "BASE_URL"
        }).then((data) => {
            if (data.code == 200) {
                this.setState({
                    await: parseFloat(data.data.amtMap.totalAmt),
                    already: parseFloat(data.data.amtMap.matchAmt),
                    tradeCount: parseFloat(data.data.amtMap.tradeCount),
                    thisDate: data.data.date,
                }, function () {
                    this.myChart();
                });
            } else {
                message.error('查询资产池交易情况错误，请重试', 5);
            }
        })
    }

    myChart() {
        var myChart = echarts.init(document.getElementById('report-pool-ech'));
        myChart.setOption({
            legend: {
                orient: 'vertical',
                left: 'left',
            },
            tooltip: {
                trigger: 'item',
                formatter: "{b} : {c}（元） ({d}%)"
            },
            series: [
                {
                    name: '',
                    type: 'pie',
                    radius: '75%',
                    center: ['50%', '50%'],
                    label: {
                        normal: {
                            formatter: '{c}',
                            position: 'inside'
                        }
                    },
                    data: [
                        {value: this.state.already, name: '结算金额'},
                        {value: this.state.await, name: '交易金额'}
                    ],
                    itemStyle: {
                        emphasis: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    },
                    color: ['#ffcc33', '#11a8ae']
                }
            ]
        });
    }

    render() {
        return (
            <Row gutter={24}>
                <Col span={12}>
                    <Row justify="space-between">
                        <Col span={24} className={"report-title"}> {this.state.thisDate}
                            交易情况</Col>
                    </Row>
                    <Row className={"report-pool"}>
                        <Col span={7} offset={1}
                             className={"report-pool-title"}>交易金额（元）</Col>
                        <Col span={16}>
                            <div className={"report-pool-sum"} style={{width: "100%"}}></div>
                            <span>{this.state.await}</span>
                        </Col>
                    </Row>
                    <Row className={"report-pool"}>
                        <Col span={7} offset={1}
                             className={"report-pool-title"}>结算金额（元）</Col>
                        <Col span={16}>
                            <div className={"report-pool-already"} style={{
                                width: this.state.already / this.state.await * 100 + "%"
                            }}></div>
                            <span>{this.state.already}</span>
                        </Col>
                    </Row>
                    <Row className={"report-pool"}>
                        <Col span={7} offset={1}
                             className={"report-pool-title"}>交易笔数（笔）</Col>
                        <Col span={16}>
                            <div className={"report-pool-await"} style={{
                                width: "100%"
                            }}></div>
                            <span>{this.state.tradeCount}</span>
                        </Col>
                    </Row>
                </Col>
                <Col span={11}>
                    <div id="report-pool-ech" style={{height: '250%'}}>
                        {/*这里是饼图*/}
                    </div>
                </Col>
            </Row>
        )
    }
}