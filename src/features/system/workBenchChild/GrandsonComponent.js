/**
 * Created by zhl on 2017-7-19.
 */
import GreatGrandsonComponent from './GreatGrandsonComponent.js'

export default class GrandsonComponent extends React.Component{

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                我是重孙子组件(第3层)：：{this.context.state.nameContext}
                <GreatGrandsonComponent></GreatGrandsonComponent>
            </div>
        )
    }
}
GrandsonComponent.contextTypes = {
    state : React.PropTypes.object,
    setState: React.PropTypes.func
}