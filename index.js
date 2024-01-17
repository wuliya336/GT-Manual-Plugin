import fs from 'node:fs'
import { Version, Plugin_Path } from './components/index.js'

const files = fs.readdirSync(`${Plugin_Path}/apps`).filter(file => file.endsWith('.js'))

let ret = []

files.forEach((file) => {
  ret.push(import(`./apps/${file}`))
})

ret = await Promise.allSettled(ret)
let ver = Version.ver;

logger.info(`---------^_^---------`)
logger.info(`GT插件${ver}：初始化~`)

if (Version.yunzai[0] != '3') {
  logger.error(`GT插件${ver}：初始化失败，本插件仅支持Yunzai-Bot v3！`)
} else {
  logger.info(`小GT插件${ver}：初始化完成！`)
}
logger.info(`---------------------`)
export { apps }