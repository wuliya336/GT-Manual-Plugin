/*
* 此配置文件为系统使用，请勿修改，否则可能无法正常使用
*
* 如需自定义配置请复制修改上一级help_default.js
*
* */

export const helpCfg = {
  title: 'GT帮助',
  subTitle: '米游社手动验证/签到',
  columnCount: 3,
  colWidth: 265,
  theme: 'all',
  themeExclude: ['default'],
  style: {
    fontColor: '#d3bc8e',
    descColor: '#eee',
    contBgColor: 'rgba(6, 21, 31, .5)',
    contBgBlur: 3,
    headerBgColor: 'rgba(6, 21, 31, .4)',
    rowBgColor1: 'rgba(6, 21, 31, .2)',
    rowBgColor2: 'rgba(6, 21, 31, .35)'
  }
}

export const helpList = [{
  group: '功能',
  list: [{
    icon: 71,
    title: '#签到',
    desc: '返回原神星铁签到地址'
  }, {
    icon: 71,
    title: '体力过验证码',
    desc: '遇到验证码返回验证码地址'
  }, {
    icon: 71,
    title: '#GT刷新验证',
    desc: '刷新米游社验证'
  }, {
  }]
}, {
  group: '管理命令，仅管理员可用',
  auth: 'master',
  list: [{
    icon: 85,
    title: '#GT(强制)更新',
    desc: '更新GT插件'
  }, {
    icon: 85,
    title: '#GT使用接口(1|2|3)',
    desc: '切换第三方服务接口'
  }, {
    icon: 85,
    title: '#GT重连ws',
    desc: '重新连接ws地址'
  }]
}]

export const isSys = true