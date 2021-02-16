import {Col, Row} from 'antd';
import '../../../../../css/rule.css';
import CreateForm from './CreateForm.js';

/**
 * 再利用react来开发项目是的时候，建议大家查看一下ES6 的一些基本语法，如： 箭头函数，解构赋值，default ，export default，延展操作符  等等
 * 特别需要注意的一点就是要注意 组件  this的引用
 * */
export default class SetIndex extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pageTotal: 0,       //当前数据的总条数
      data: [],
    }
  }

  componentDidMount() {

  }

  render() {
    return (
        <Row>
          <Col span={14}>
            <CreateForm ref="createForm" sta={this.state}/>
          </Col>
          <Col span={10}></Col>
        </Row>
    )
  }
}
