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
  BASE_URL: "http://47.97.219.169/",
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
