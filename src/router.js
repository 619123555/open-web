const routePath = {
  //工作台  临时使用
  workBenchAM: (location, cb) => {
    require.ensure([], require => {
      cb(null, require('features/system/manageSystem/workBench/index').default)
    }, 'workBenchAM')
  },
  //机构管理
  manageOrganization: (location, cb) => {
    require.ensure([], require => {
      cb(null, require(
          'features/system/manageSystem/manageOrganization/index').default)
    }, 'manageOrganization')
  },
  //用户管理
  manageUser: (location, cb) => {
    require.ensure([], require => {
      cb(null, require('features/system/manageSystem/manageUser/index').default)
    }, 'manageUser')
  },
  //角色管理
  manageRole: (location, cb) => {
    require.ensure([], require => {
      cb(null, require('features/system/manageSystem/manageRole/index').default)
    }, 'manageRole')
  },
  //岗位管理
  managePosition: (location, cb) => {
    require.ensure([], require => {
      cb(null,
          require('features/system/manageSystem/managePosition/index').default)
    }, 'managePosition')
  },
  //菜单管理
  manageMenu: (location, cb) => {
    require.ensure([], require => {
      cb(null, require('features/system/manageSystem/manageMenu/index').default)
    }, 'manageMenu')
  },
  //字典管理
  dictType: (location, cb) => {
    require.ensure([], require => {
      cb(null, require('features/system/manageSystem/dictType/index').default)
    }, 'dictType')
  },
  //配置管理
  sysConfig: (location, cb) => {
    require.ensure([], require => {
      cb(null,
          require('features/system/manageSystem/manageConfig/index').default)
    }, 'sysConfig')
  },
  paymentOrder: (location, cb) => {
    require.ensure([], require => {
      cb(null,
          require('features/platform/order/paymentOrder/index').default)
    }, 'paymentOrder')
  }
  // //登录
  // login: (location, cb) => {
  //   require.ensure([], require => {
  //     cb(null,
  //         require('components/login/login').default)
  //   }, 'login')
  // }
}

export default routePath
