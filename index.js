import { Version } from './components/index.js'
import fs from 'node:fs'
import chalk from 'chalk'

let ret = []

logger.info(chalk.rgb(120, 255, 108)(`---------=.=---------`))
logger.info(chalk.rgb(120, 255, 108)(`GT插件${Version.version}载入成功^_^`))
logger.info(chalk.rgb(120, 255, 108)(`作者-wuliya`))
logger.info(chalk.rgb(120, 255, 108)(`---------------------`));

const files = fs
  .readdirSync('./plugins/GT-Manual-Plugin/apps')
  .filter((file) => file.endsWith('.js'))

files.forEach((file) => {
  ret.push(import(`./apps/${file}`))
})

ret = await Promise.allSettled(ret)

let apps = {}
for (let i in files) {
  let name = files[i].replace('.js', '')

  if (ret[i].status != 'fulfilled') {
    logger.error(`载入插件错误：${logger.red(name)}`)
    logger.error(ret[i].reason)
    continue
  }
  apps[name] = ret[i].value[Object.keys(ret[i].value)[0]]
}
export { apps }
