import setting from "./model/setting.js";
import lodash from "lodash";
import { pluginResources } from "./model/path.js";
import path from 'path'


// 支持锅巴
export function supportGuoba() {

  let allGroup = [];
  Bot.gl.forEach((v, k) => { allGroup.push({label: `${v.group_name}(${k})`, value: k}); });

  return {
    pluginInfo: {
      name: 'gt-Manual-plugin',
      title: 'GT-Manual-Plugin',
      author: '@shiwuliya',
      authorLink: 'https://github.com/shiwuliya',
      link: 'https://github.com/wuliya336/GT-Manual-Plugin',
      isV3: true,
      isV2: false,
      description: '米游社手动验证',
      // 显示图标，此为个性化配置
      // 图标可在 https://icon-sets.iconify.design 这里进行搜索
      icon: 'el:ok-sign',
      // 图标颜色，例：#FF0000 或 rgb(255, 0, 0)
      iconColor: '#d19f56',
      // 如果想要显示成图片，也可以填写图标路径（绝对路径）
      iconPath: path.join(pluginResources, '/images/icon.ico'),
    },
    // 配置项信息
    configInfo: {
      // 配置项 schemas
      schemas: [
        {
          field: 'gt.verify',
          label: '手动验证',
          helpMessage: '0-关闭 1-开启 2-仅原神 3-仅星铁',
          bottomHelpMessage: '是否开启手动验证功能',
          component: 'Select',
          componentProps: {
            options: [
              {label: '关闭', value: 0},
              {label: '开启', value: 1},
              {label: '仅原神', value: 2},
              {label: '仅星铁', value: 3},
            ],
            placeholder: '请选择手动验证模式',
          },
        },
        {
          field: 'gt.sign',
          label: '手动签到',
          helpMessage: '0-关闭 1-开启',
          bottomHelpMessage: '是否开启手动签到功能',
          component: 'Select',
          componentProps: {
            options: [
              {label: '关闭', value: 0},
              {label: '开启', value: 1},
            ],
            placeholder: '请选择开启手动签到功能',
        },
        },
        {
          field: 'gt.verifyAddr',
          label: '手动验证API',
          helpMessage: '用于注册和验证的API地址',
          bottomHelpMessage: '请输入手动验证API地址',
          component: 'Input',
          required: true,
          componentProps: {
            placeholder: '请输入手动验证API地址',
          },
        },
        {
          field: 'gt.signAddr',
          label: '手动签到API',
          helpMessage: '用于签到的API地址,仅发送uid、gt验证码信息,不发送qq、cookie等敏感信息',
          bottomHelpMessage: '请输入手动签到API地址',
          component: 'Input',
          required: true,
          componentProps: {
            placeholder: '请输入手动签到API地址',
          },
        },
        {
          field: 'gt.blackList',
          label: '黑名单QQ',
          helpMessage: '不使用手动过码,有其他过码插件会next下一个过码服务',
          bottomHelpMessage: '请输入黑名单QQ号,用逗号分隔',
          component: 'Input',
          componentProps: {
            placeholder: '请输入黑名单QQ号',
            allowAdd: true,
            allowDel: true,
            showPrompt: true,
            valueFormatter: ((value) => Number.parseInt(value)).toString(),
          },
        },
      ],
      getConfigData () {
        return setting.merge()
      },
      // 设置配置的方法（前端点确定后调用的方法）
      setConfigData (data, { Result }) {
        let config = {}
        for (let [keyPath, value] of Object.entries(data)) {
          lodash.set(config, keyPath, value)
        }
        config = lodash.merge({}, setting.merge, config)
        setting.analysis(config)
        return Result.ok({}, '保存成功~')
      }
    }
  }
}