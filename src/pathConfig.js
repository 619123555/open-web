const path = {
  /**
   * (-----dev 默认是本地开发环境，请不要修改该值------)
   * 系统相关配置：包括服务请求地址、项目名及打包后的文件夹名
   *
   */
  //true 本地开发环境  false 服务器
  DEV: false,
  MODULE: "platform",
  PROJECTNAME: "/manage",
  //logo
  TITLE: "运营平台",
  //网站标题
  WEBTITLE: "运营平台",
  // 本地 http://127.0.0.1:8092/
  // 测试内网 http://10.10.20.106:5000/
  // 测试外网 http://118.26.192.195:5000/
  // 生产内网 http://10.30.10.114:8092/
  // 生产外网 http://118.26.192.195:5001/
  BASE_URL: "http://127.0.0.1:8090/",
  //菜单
  MENU_URL: "system/menu/treeMenuData",
  //登录
  LOGIN_URL: "system/login",
  //登出
  LOGOUT_URL: "system/logout",
  //登录检查
  LOGIN_CHECK_URL: "system/checkLogin"
};
export default path