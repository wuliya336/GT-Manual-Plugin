/*
* 请注意，系统不会读取help_default.js ！！！！
* 【请勿直接修改此文件，且可能导致后续冲突】
*
* 如需自定义可将文件【复制】一份，并重命名为 help.js
*
* */

// 帮助配置
export const helpCfg = {
    // 帮助标题
    title: 'GT帮助',
  
    // 帮助副标题
    subTitle: '米游社手动验证',
  
    // 帮助表格列数，可选：2-5，默认3
    // 注意：设置列数过多可能导致阅读困难，请参考实际效果进行设置
    colCount: 3,
  
    // 单列宽度，默认265
    // 注意：过窄可能导致文字有较多换行，请根据实际帮助项设定
    colWidth: 265,
  
    // 皮肤选择，可多选，或设置为all
    // 皮肤包放置于 resources/help/theme
    // 皮肤名为对应文件夹名
    // theme: 'all', // 设置为全部皮肤
    // theme: ['default','theme2'], // 设置为指定皮肤
    theme: 'all',
  
    // 排除皮肤：在存在其他皮肤时会忽略该项内设置的皮肤
    // 默认忽略default：即存在其他皮肤时会忽略自带的default皮肤
    // 如希望default皮肤也加入随机池可删除default项
    themeExclude: ['default'],
  
    // 是否启用背景毛玻璃效果，若渲染遇到问题可设置为false关闭
    bgBlur: true
  }
  
  // 帮助菜单内容
  export const helpList = [{
    group: '功能',
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