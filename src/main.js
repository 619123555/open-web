import {render} from 'react-dom';
import {browserHistory, IndexRoute, Route, Router} from 'react-router';
import MyRouter from './router';
import Navigation from 'components/menu/menu'
import Login from 'components/login/login'
import 'font-awesome-webpack';
import Fetch from 'utils/fetch.js';
import {BackTop, Icon, Layout, Menu} from 'antd';
import './main.css';
import UpdatePassword from './updatePassword.js';
import Path from 'src/pathConfig'
import AuthorityControl from 'utils/authorityControl'

class Structure extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      login: 3,
      collapsed: false,
      userName: null,
      passwordModelVisible: false,//修改密码弹框
      menuCnText: '',
      userNo: "",
    }
  }

  componentWillMount() {
    Fetch.getInstance().postWithRequestData(Path.LOGIN_CHECK_URL).then(
        (data) => {
          if (data.code == 200) {
            this.setState(
                {login: 1, userName: data.data.name, userNo: data.data.no})
          } else {
            this.setState({login: 0})
          }
        }).catch(error => console.log(error))
  }

  changeLoginState(login, userName, userNo) {
    this.setState({login, userName, userNo});
  }

  logOut() {
    Fetch.getInstance().postWithRequestData(Path.LOGOUT_URL).then((data) => {
      if (data.code == 200) {
        location.reload(true)
      }
    }).catch(error => console.log(error))
  }

  skin() {
    document.body.className = "default1"
  }

  updatePassword = () => {
    this.setState({
      passwordModelVisible: true
    });
  }
  toggle = () => {
    let collapsed = this.state.collapsed
    if (!collapsed) {
      $(".layoutLayout").animate({marginLeft: "65px"})
      $(".layoutHeader").css("width", "calc(100% - 65px)")
    } else {
      $(".layoutLayout").css("margin-left", "200px")
      $(".layoutHeader").css("width", "calc(100% - 200px)")
    }
    this.setState({
      collapsed: !collapsed,
    });
  }

  render() {
    window._userNo = this.state.userNo
    const {Header, Content, Footer, Sider} = Layout;
    const SubMenu = Menu.SubMenu;
    return (
        <div>
          {
            this.state.login == 1 ? <Layout>
                  <Sider id="sider" style={{
                    overflow: 'auto',
                    height: '100vh',
                    position: 'fixed',
                    left: 0
                  }}
                         collapsible trigger={null}
                         collapsed={this.state.collapsed}>
                    <div className="logo">
                      <div className="logoFont">{Path.TITLE}</div>
                    </div>
                    <Navigation toggle={this.toggle.bind(this)}
                                collapsed={this.state.collapsed}
                                setState={this.setState.bind(this)}/>
                  </Sider>
                  <Layout className="layoutLayout" style={{marginLeft: 200}}>
                    <Header className="old-layoutHeader"
                            style={{background: '#fff', padding: 0}}>
                      <Menu mode="horizontal">
                        <Menu.Item key="1">
                          <Icon
                              className="trigger"
                              type={this.state.collapsed ? 'menu-unfold'
                                  : 'menu-fold'}
                              onClick={this.toggle}
                          />
                        </Menu.Item>
                        <Menu.Item key="2">
                          {this.state.menuCnText}
                        </Menu.Item>
                        <SubMenu title={<span><Icon
                            type="user"/>{this.state.userName}</span>}>
                          {/*<Menu.Item key="setting:1">*/}
                          {/*<a onClick={this.skin.bind(this)}>换肤</a>*/}
                          {/*</Menu.Item>*/}
                          <Menu.Item key="setting:2">
                            <a onClick={this.updatePassword.bind(this)}>修改密码</a>
                          </Menu.Item>
                          <Menu.Item key="setting:3">
                            <a onClick={this.logOut.bind(this)}>退出登录</a>
                          </Menu.Item>
                        </SubMenu>
                      </Menu>
                    </Header>
                    <Content className="old-layoutContent"
                             style={{padding: '5px 24px', background: '#fff'}}>
                      {this.props.children}
                    </Content>
                  </Layout>
                </Layout>
                : this.state.login == 0 ?
                <Login changeLoginState={this.changeLoginState.bind(this)}/>
                : <div></div>
          }
          <UpdatePassword sta={this.state} setState={this.setState.bind(this)}/>
          <div className="main-loading">
            <i className="loadingIcon fa fa-spinner fa-pulse fa-2x"></i>
          </div>
          <div>
            <BackTop/>
          </div>
        </div>
    )
  }
}

const authorityControl = (nextState, replace, next) => {
  let pathname = nextState.location.pathname.substring(1)
  AuthorityControl.getInstance().getTreeData(pathname).then(v => {
    if (v) {
      next()
    } else {
      replace("/manage")
      next()
      location.reload(true)
    }
  })
}
render((
    <Router history={browserHistory}>
      <Router path="/manage" component={Structure}>
        <IndexRoute getComponent={MyRouter.workBenchAM}/>
        {/*<Route path="/" getComponent={MyRouter.login}/>*/}
        <Route path="workbencham" getComponent={MyRouter.workBenchAM}/>
        <Route path="manageSystem/manageOrganization"
               getComponent={MyRouter.manageOrganization}
               onEnter={authorityControl}/>
        <Route path="manageSystem/manageUser" getComponent={MyRouter.manageUser}
               onEnter={authorityControl}/>
        <Route path="manageSystem/manageRole" getComponent={MyRouter.manageRole}
               onEnter={authorityControl}/>
        <Route path="manageSystem/managePosition"
               getComponent={MyRouter.managePosition}
               onEnter={authorityControl}/>
        <Route path="manageSystem/Menu" getComponent={MyRouter.manageMenu}
               onEnter={authorityControl}/>
        <Route path="manageSystem/dictType" getComponent={MyRouter.dictType}
               onEnter={authorityControl}/>
        <Route path="manageSystem/sysConfig" getComponent={MyRouter.sysConfig}
               onEnter={authorityControl}/>
        <Route path="order/paymentOrder" getComponent={MyRouter.paymentOrder}
               onEnter={authorityControl}/>
      </Router>
    </Router>
), document.getElementById('app'));
