/*
* 此配置文件为系统使用，请勿修改，否则可能无法正常使用
*
* 如需自定义配置请复制修改上一级help_default.js
*
* */
export const helpCfg = {
    title: 'GT帮助',
    subTitle: 'Yunzai-Bot & GT-Manual-Plugin',
    colCount: 3,
    colWidth: 265,
    theme: 'all',
    themeExclude: ['default'],
    bgBlur: true
  }
  
  export const helpList = [{
    group: 'GT功能',
    list: [{
      icon: 33,
      title: '#原神签到',
      desc: '调用逍遥插件的签到功能，并返回签到地址'
    }, {
      icon: 31,
      title: '体力过验证码',
      desc: '遇到验证码返回验证码地址'
    }, {
    }]
  }, {
    group: '管理命令，仅管理员可用',
    auth: 'master',
    list: [{
      icon: 95,
      title: '#GT(强制)更新',
      desc: '更新GT插件'
    }, {
      icon: 95,
      title: '#GT重连ws',
      desc: '重新连接ws地址'
}]
}]