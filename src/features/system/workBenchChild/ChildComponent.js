/**
 * Created by zhl on 2017-7-18.
 */
import GrandsonComponent from './GrandsonComponent.js'
export default class ChildComponent extends React.Component{

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                我是孙子组件(第2层)：{this.context.state.nameContext}
                <GrandsonComponent></GrandsonComponent>
            </div>
        )
    }
}
ChildComponent.contextTypes = {
    state: React.PropTypes.object,
    setState: React.PropTypes.func
}