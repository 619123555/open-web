import {Col, Row} from 'antd';
import '../../../../css/workBench.css';
import Fetch from '../../subfetch';
import echarts from 'echarts/lib/echarts';
import 'echarts/lib/chart/bar';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';
import 'echarts/lib/component/legend';

export default class AssetGap extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      titleList: [],
      listData: [],
      thisDate: "",       //当前报表数据日期
    };
  }

  componentWillMount() {
    //加载字典

  }

  componentDidMount() {
    this.getList();
  }

  getList(value) {
    Fetch.getInstance().postWithRequestData("workBench/assetGap", {
      requestData: {"capPty": value}
    }).then((data) => {
      if (data.code == 200) {
        this.setState({
          titleList: data.data.listTitle,
          listData: data.data.listData,
          thisDate: data.data.date,
        }, function () {
          this.myChart();
        });
      }
    })
  }

  myChart() {
    if (this.state.listData.length > 0) {
      echarts.dispose(document.getElementById('report-pool-gap'));
      var myChart = echarts.init(document.getElementById('report-pool-gap'));
      myChart.setOption({

        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        grid: {
          left: '1%',
          right: '4%',
          bottom: '7%',
          top: "5%",
          containLabel: true
        },
        xAxis: {
          name: '（次）',
          nameLocation: 'start',
          type: 'value',
        },
        yAxis: {
          type: 'category',
          data: this.state.titleList
        },
        series: [

          {
            name: '操作次数',
            type: 'bar',
            stack: '总量',
            barWidth: "45%",
            label: {
              normal: {
                show: true,
                position: 'right'
              }
            },
            color: ['#40b1fc'],
            data: this.state.listData
          }
        ]
      });
    }
  }

  render() {
    return (
        <Row gutter={24}>
          <Col span={24}>
            <Row justify="space-between">
              <Col span={8} className={"report-title"}>{this.state.thisDate}
                活跃用户榜</Col>
            </Row>
          </Col>
          <Col span={24}>
            <div id="report-pool-gap" style={{height: '211%'}}>
              {this.state.listData.length < 1 ?
                  <div style={{paddingTop: 80, paddingLeft: "45%"}}>暂无数据</div>
                  : ""}
            </div>
          </Col>
        </Row>
    )
  }
}