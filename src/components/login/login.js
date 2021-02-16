import React from 'react';
import {message} from 'antd';
import Fetch from 'src/utils/fetch'
import 'src/utils/jquery.slideunlock.js';
import Path from 'src/pathConfig';
import Regex from 'src/utils/Regex';
import './login.css';

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      count: 3,
      username: 1,
      password: 1,
      access: 0,
      channel: 1,
      channelData: [],
      channelCode: '',
    }
  }

  componentDidMount() {
    $('.ant-select-arrow').addClass('fa fa-chevron-left');
    $('.ant-select-selection-selected-value').attr('title', "");
    if (/MSIE/.test(navigator.userAgent)) {
      this.refs.loginAdvice.style.display = 'block';
    }
  }

  login() {
    this.slide();
    let requestData = {
      'username': $("#username").val(),
      'password': $("#password").val(),
      // 'validateCode': $("#validateCode").val()
    };
    if (requestData.username == "") {
      message.error("请填用户名", 3);
      return;
    }
    if (requestData.password == "") {
      message.error("请填写密码", 3);
      return;
    }
    // if (requestData.validateCode == "") {
    //   message.error("请填写动态口令", 3);
    //   return;
    // } else if (!Regex.reg_cardNumber(requestData.validateCode)) {
    //   message.error("动态口令输入不合法", 3);
    //   return;
    // }
    if (this.state.username + this.state.password + this.state.access
        + this.state.channel == this.state.count) {
      Fetch.getInstance().postWithRequestData(Path.LOGIN_URL, {
        "requestData": requestData
      }).then((data) => {
        if (data.code == 200) {
          message.success("登陆成功", 3);
          this.props.changeLoginState(true, data.data.name, data.data.no);
          return;
        } else {
          $("#password").val("");
          $("#validateCode").val("");
        }
        message.error(data.message, 3);
      }).catch((error) => {
        message.error("系统异常,请重试", 3);
        this.props.changeLoginState(false);
      })
    }
  }

  slide() {
    this.resetSlide();
    let slider = new SliderUnlock("#slider", {
      successLabelTip: "验证成功"
    }, function () {
      $('#labelTip').addClass("successLabelTip");
      $("#label").css("display", "none");
      $("#slider_bg").addClass("sliderAnimation");
      this.setState({access: 1});
    }.bind(this));
    slider.init();
  }

  resetSlide() {
    $('#labelTip').removeClass("successLabelTip");
    $("#label").css("display", "inline-block");
    $("#slider_bg").removeClass("sliderAnimation");
    $('#labelTip').text("请按住滑块，拖动到最右侧");
    this.setState({access: 0});
  }

  getChannelData() {
    let count = this.state.count;
    if ($('#validate').is(":visible")) {
      $('#validate').hide();
      this.setState({access: 0});
      count--;
    }
    this.setState({count: count});
  }

  autoLogin = (e) => {
    e.keyCode == 13 && this.login()
  }

  render() {
    return (
        <div className="login">
          <div className="login-logo">
          </div>
          <div>
            <div className="login-content">
              <div style={{"paddingBottom": "0"}}>
                <form id="login" className="no-margin">
                  <h3 className="form-title">{Path.TITLE}</h3>
                  <fieldset>
                    <div className="form-group has-feedback">
                      <input autoFocus type="text" onKeyUp={this.autoLogin}
                             onInput={this.getChannelData.bind(this)}
                             id="username" name="username"
                             className="form-control" autoComplete="off"
                             placeholder="帐号/邮箱/手机"
                             required/>
                      <span
                          className="glyphicon fa fa-user form-control-feedback input-fa-icon"></span>
                    </div>
                    <div className="form-group has-feedback">
                      <input onKeyUp={this.autoLogin} type="password"
                             id="password" name="password"
                             className="form-control" placeholder="密码"
                             required/>
                      <span
                          className="glyphicon fa fa-lock form-control-feedback input-fa-icon"></span>
                    </div>
                    {/*<div className="form-group has-feedback">*/}
                    {/*  <input onKeyUp={this.autoLogin} type="text" maxLength="6"*/}
                    {/*         id="validateCode" name="validateCode"*/}
                    {/*         className="form-control" placeholder="动态口令"*/}
                    {/*         required/>*/}
                    {/*  <span*/}
                    {/*      className="glyphicon fa fa-lock form-control-feedback input-fa-icon"></span>*/}
                    {/*</div>*/}
                    <div className="form-group has-feedback" id="validate">
                      <div id="slider">
                        <div id="slider_bg" style={{"width": "0px"}}></div>
                        <span id="label" className="fa fa-angle-double-right"
                              style={{"left": "0px"}}></span><span
                          id="labelTip">请按住滑块，拖动到最右侧</span>
                      </div>
                    </div>
                    <div className="form-loginBtn">
                      <input type="button" onClick={this.login.bind(this)}
                             value="登录"
                             className="login-btn"/>
                    </div>
                    <p ref='loginAdvice' className='loginAdvice'>
                      推荐您使用Chrome浏览，<a
                        href='http://www.google.cn/chrome/browser/desktop/index.html'
                        target="_blank">点此下载</a></p>
                  </fieldset>
                </form>
              </div>
            </div>
          </div>
        </div>
    )
  }
}

export default Login