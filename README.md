# GT-Manual-Plugin
![动态访问量](https://count.kjchmc.cn/get/@GT-Manual-Plugin?theme=rule34)<br>
[![Gitee](https://img.shields.io/badge/GT--Manual--Plugin-1?style=for-the-badge&logo=gitee&color=rgb(218%2C16%2C30))](https://gitee.com/wuliya336/GT-Manual-Plugin)[![Github](https://img.shields.io/badge/GT--Manual--Plugin-1?style=for-the-badge&logo=github&color=rgb(0%2C0%2C0))](https://github.com/wuliya336/GT-Manual-Plugin)[![Gitee Version](https://img.shields.io/github/package-json/v/shiwuliya/GT-Manual-Plugin/main?logo=gitee&label=GT-Manual-Plugin)](https://gitee.com/wuliya336/GT-Manual-Plugin)[![GitHub Version](https://img.shields.io/github/package-json/v/shiwuliya/GT-Manual-Plugin/main?logo=github&label=GT-Manual-Plugin)](https://github.com/wuliya336/GT-Manual-Plugin)<br>
`GT-Manual-Plugin`是一个`Yunzai-Bot`的扩展插件，提供米游社手动签到,手动验证功能<br>

---
# 前提
* 本服务需要自行部署后端<br>
* 本服务也提供后端地址,如下:<br>
  接口1: 感谢由[@XMORANGE](https://gitee.com/XMORANGE)提供的服务器(QQ内可直接访问),请尽量使用本接口<br>
  接口2: 来自[@XxxX](https://gitee.com/haanxuan)部署的服务<br>
  接口3: 来自[@Yummy-cookie](https://gitee.com/Yummy-cookie)部署的服务<br>
---

---
## 安装与更新

### 使用Git安装（推荐）

请将 `GT-Manual-Plugin` 放置在 Yunzai-Bot 的 plugins 目录下，重启 Yunzai-Bot 后即可使用<br>

请使用 git 进行安装，以方便后续升级。在 Yunzai-Bot 根目录夹打开终端，运行下述指令之一<br>

// 使用gitee
```
git clone --depth=1 https://gitee.com/wuliya336/GT-Manual-Plugin.git ./plugins/GT-Manual-Plugin/
pnpm install --filter=GT-Manual-plugin
```
// 使用github


```
git clone --depth=1 https://github.com/wuliya336/GT-Manual-Plugin.git ./plugins/GT-Manual-Plugin/
pnpm install --filter=GT-Manual-plugin
```


### 手工下载安装（不推荐）

手工下载安装包，解压后将`GT-Manual-Plugin-master`更名为`GT-Manual-Plugin`，然后放置在Yunzai的plugins目录内<br>

虽然此方式能够使用，不利于后续升级，故不推荐使用<br>

---

# 使用教程
* 对着机器人发送`#GT帮助`可查看功能<br>
![帮助图](https://www.freeimg.cn/i/2024/01/22/65ae4e891edb6.jpg)<br>

## 使用第三方接口
对着机器人发送`#GT使用接口(1|2|3)`即可，目前仅有三个接口<br>
接下来重启机器人生效<br>
# 说明
- 不支持[Yunzai-Bot](https://gitee.com/yoimiya-kokomi/Yunzai-Bot)<br>
- 支持[Miao-Yunzai](https://gitee.com/yoimiya-kokomi/Miao-Yunzai)<br>
- 支持[TRSS-Yunzai](https://gitee.com/TimeRainStarSky/Yunzai)<br>

如不可用，请确保本体为最新版<br>

# 免责声明
1. `GT-Manual-Plugin`自身的代码均开放，无需征得特殊同意<br>
2. 本过码服务插件和后端都是开源,如果您是交易所得则是被骗,请及时退款并举报<br>
3. 以上声明但仅代表`GT-Manual-Plugin`自身的范畴，请尊重Yunzai本体及其他插件作者的努力，勿将Yunzai及其他插件用于以盈利为目的的场景<br>

# 资源

* [Miao-Yunzai](https://github.com/yoimiya-kokomi/Miao-Yunzai) : 喵版Yunzai [Gitee](https://gitee.com/yoimiya-kokomi/Miao-Yunzai)
  / [Github](https://github.com/yoimiya-kokomi/Miao-Yunzai)
* [Yunzai-V3](https://github.com/yoimiya-kokomi/Yunzai-Bot) ：Yunzai V3 - 喵喵维护版（使用 icqq）
* [Yunzai-V3](https://gitee.com/Le-niao/Yunzai-Bot) ：Yunzai V3 - 乐神原版（使用 oicq）
* [米游社接口服务](https://gitee.com/QQ1146638442/GT-Manual) ：米游社手动验证接口服务
