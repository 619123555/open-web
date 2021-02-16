
import { Button } from 'antd';
/**
 * Created by zhl on 2017-7-19.
 */
export default class GreatGrandsonComponent extends React.Component{

    constructor(props) {
        super(props);
    }
    onClickBtn = () => {
        this.context.setState({
            nameContext: '再孙子组件中修改值'
        })
    }
    render() {
        return (
            <div>
                我是重重孙子组件(第4层)：：{this.context.state.nameContext}
                <div>
                    <Button type="primary" onClick={this.onClickBtn}>最底层组件中，修改数据源</Button>
                </div>
            </div>

        )
    }
}
GreatGrandsonComponent.contextTypes = {
    state : React.PropTypes.object,
    setState: React.PropTypes.func
}