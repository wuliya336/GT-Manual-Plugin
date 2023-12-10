// 导入 YAML, chokidar, fs 和 path 模块
import YAML from 'yaml'
import chokidar from 'chokidar'
import fs from 'node:fs'
import { _path, pluginResources, pluginRoot } from "./path.js";

// 定义 Setting 类
class Setting {
  // 构造函数，初始化一些属性
  constructor () {
    /** GT 配置文件 */
    this.configPath = `${_path}/plugins/GT-Manual-Plugin/config/gt.yaml`
    this.config = {}

    /** 监听文件 */
    this.watcher = null
  }

  // 配置对象化 用于锅巴插件界面填充
  merge () {
    // 直接返回配置对象
    return this.getConfig()
  }

  // 配置对象分析 用于锅巴插件界面设置
  analysis(config) {
    // 直接设置配置对象
    this.setConfig(config)
  }


  // 获取 GT 配置
  getConfig () {
    // 返回 YAML 文件的解析结果
    return this.getYaml()
  }

  // 设置 GT 配置
  setConfig (Object) {
    // 将对象写入 YAML 文件
    return this.setYaml(Object)
  }

  // 将对象写入 YAML 文件
  setYaml (Object){
    // 获取文件路径
    let file = this.configPath
    try {
      // 将对象转换为 YAML 格式并写入文件
      fs.writeFileSync(file, YAML.stringify(Object),'utf8')
    } catch (error) {
      // 如果出现错误，打印日志并返回 false
      logger.error(`[GT-Manual-Plugin] 写入失败 ${error}`)
      return false
    }
  }

  // 读取 YAML 文件 返回对象
  getYaml () {
    // 获取文件路径
    let file = this.configPath
    // 如果已经有缓存的对象，直接返回
    if (this.config) return this.config

    try {
      // 否则，读取文件并解析为对象
      this.config = YAML.parse(fs.readFileSync(file, 'utf8'))
    } catch (error) {
      // 如果出现错误，打印日志并返回 false
      logger.error(`[GT-Manual-Plugin] 格式错误 ${error}`)
      return false
    }
    // 监视文件变化
    this.watch(file)
    // 返回对象
    return this.config
  }

  //重新加载插件
  reloadPlugin() {
    location.reload();
  }

  //监视文件变化的函数
  watch(file) {
    //如果已经有一个监视器，就不需要再创建一个
    if (this.watcher) return;

    //创建一个监视器，使用 chokidar 库
    const watcher = chokidar.watch(file);
    //当文件发生变化时，执行一些操作
    watcher.on('change', path => {
      //删除当前的配置对象
      delete this.config;
      //打印一些日志信息
      logger.mark(`[自动化插件][修改配置文件][GT]`);
      //重新加载插件
      reloadPlugin();
    });
    //将监视器保存到 this.watcher 属性中
    this.watcher = watcher;
  }
}

// 导出 Setting 类的实例
export default new Setting()
