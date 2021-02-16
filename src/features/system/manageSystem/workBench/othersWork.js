import {Button, Col, Input, Row} from 'antd';
import echarts from 'echarts';
import 'src/css/workBench.css';

export default class AdminWork extends React.Component{
	constructor(props){
        super(props);
        this.state = {
            orderData:{
                date:['1','2','3','4','5','6','7','8','9','10','11'],
                num:[2, 3, 4, 6, 3, 2.5, 4,8,9,8,6,5],
                money:[2, 5, 8, 4,3, 4, 8,11,10,8,5,3]
            },
            data:{
                "owner":"资产推荐方简称（BJ0001）",
                "name":"张三",
                "status":"初审",
                "time":"2017-06-29 00:00:00",
                "joinStatus":"合作中",
                "websit":"www.websit.com",
                "tel":"13333333333",
                "mail":"example@abc.com",
                "config":true,
            },
        }
    }
    componentDidMount(){
        let reportChart=echarts.init(document.getElementById('reportChart'));
        let option = {
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'line'
                }
            },
            legend: {
                top:'20',
                data: ['进件数', '放款金额'],
            },
            xAxis: {
                type: 'category',
                boundaryGap : false,
                data: this.state.orderData.date,
                axisLine: {
                    lineStyle: {
                        color: '#'
                    }
                }
            
            },
            yAxis: {
                type: 'value',
                show: false
            },
            grid: {
                left: 10,
                right:20
            },
            series: [
                {
                    name: '放款金额',
                    type: 'line',
                    data: this.state.orderData.num,
                    smooth: true,
                    showSymbol: false,
                    lineStyle: {
                        normal:{
                            width:5,
                            shadowColor: 'rgba(0,0,0,0.1)',
                            shadowBlur: 10,
                            shadowOffsetY: 15
                        }
                    },
                    itemStyle: {
                        normal: {
                            color: 'rgb(228, 178, 242)',
                            
                        }
                    },
                    areaStyle: {
                        normal: {
                            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                offset: 0,
                                color: 'rgba(228, 178, 242,0.7)'
                            }, {
                                offset: 1,
                                color: 'rgba(228, 178, 242,0.01)'
                            }])
                        }
                    },
                },
                {
                    name: '进件数',
                    type: 'line',
                    data: this.state.orderData.money,
                    smooth: true,
                    showSymbol: false,
                    lineStyle: {
                        normal:{
                            width:5,
                            shadowColor: 'rgba(0,0,0,0.1)',
                            shadowBlur: 10,
                            shadowOffsetY: 15
                        }
                    },
                    itemStyle: {
                        normal: {
                            color: 'rgb(120, 195, 253)',
                            
                        }
                    },
                    areaStyle: {
                        normal: {
                            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                offset: 0,
                                color: 'rgba(120, 195, 253,0.7)'
                            }, {
                                offset: 1,
                                color: 'rgba(120, 195, 253,0.01)'
                            }])
                        }
                    },
                },
            ]
        };
        reportChart.setOption(option);
    }

    render(){
    	return (
        <div>
            <Row>
                <Row>
                    <Row gutter={32}>
                        <Col className="topTarget-item" span={6}>
                            <div>
                                风险或者业务指标1
                            </div>
                        </Col>
                        <Col className="topTarget-item" span={6}>
                            <div >
                                风险或者业务指标2
                            </div>
                        </Col>
                        <Col className="topTarget-item" span={6}>
                            <div>
                                风险或者业务指标3
                            </div>
                        </Col>
                    </Row>
                    <Row className="table-box">
                        <div>
                            <p>我的申请</p>
                            <div className="apply-main">
                                {
                                this.state.data==null ? 
                                <div className="apply-btnBox">
                                    <Button type="primary" className="apply-btn">开始申请</Button>
                                </div>
                                :
                                <div>
                                    <div className="applyTable-top">
                                        <p>{this.state.data.owner}</p>
                                        <div>
                                            <span>申请人：{this.state.data.name}</span><span>状态：{this.state.data.status}</span><span>申请时间：{this.state.data.time}</span>
                                        </div>
                                    </div>
                                    <Row className="applyTable-mid" gutter={32}>
                                        <Col span={12}>
                                            <Row className="apply-midRow" gutter={8}>
                                                <Col span={2}>合作状态</Col>
                                                <Col span={12}>{this.state.data.joinStatus}</Col>
                                            </Row>
                                            <Row className="apply-midRow" gutter={8}>
                                                <Col span={2}>网站地址</Col>
                                                <Col span={12}><Input defaultValue={this.state.data.websit} /></Col>
                                            </Row>
                                        </Col>
                                        <Col span={12}>
                                            <Row className="apply-midRow" gutter={8}>
                                                <Col span={2}>联系电话</Col>
                                                <Col span={12}><Input defaultValue={this.state.data.tel} /></Col>
                                            </Row>
                                            <Row className="apply-midRow" gutter={8}>
                                                <Col span={2}>邮箱地址</Col>
                                                <Col span={12}><Input defaultValue={this.state.data.mail} /></Col>
                                            </Row>
                                        </Col>
                                    </Row>
                                    <div className="applyTable-bottom">
                                        <Button disabled={this.state.data.config}>配置匹配规则</Button><Button>查看详细信息</Button>
                                    </div>
                                </div>
                                }
                            </div>
                        </div>
                    </Row>
                    <Row className="table-box">
                        <div>
                            <div className="order-title">订单情况
                                <div><a onClick={this.orderTabChange} className="order-tab order-tab-active">月</a><a
                                    onClick={this.orderTabChange} className="order-tab">天</a></div>
                            </div>
                            <div id="reportChart" style={{width:"100%",height:"600px"}}>
                            </div>
                        </div>
                    </Row>
                    <Row>
                        <Col span={12}>占位</Col>
                        <Col span={12}>占位</Col>
                    </Row>
                </Row>
            </Row>
        </div> 
    )
    }
}
