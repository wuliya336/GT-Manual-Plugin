import plugin from "../../../lib/plugins/plugin.js";
import fs from "fs";
import yaml from "js-yaml";

export class api extends plugin {
  constructor() {
    super({
      name: "GT插件",
      event: "message",
      priority: 33700,
      rule: [
        {
          reg: /^#*(GT|gt)使用接口1$/,
          fnc: "api1",
        },
        {
          reg: /^#*(GT|gt)使用接口2$/,
          fnc: "api2",
        },
      ],
    });

    this.configPath = "./plugins/GT-Manual-Plugin/config/gt.yaml";
  }

  async api1() {
    if (!this.e.isMaster) return false;

    let config = yaml.load(fs.readFileSync(this.configPath, "utf8"));
    config.verifyAddr = "https://gt.wuliya.top/GTest/register?key=wuliya";
    config.signAddr = "wss://gt.wuliya.top/mysSign?key=wuliya";
    fs.writeFileSync(this.configPath, yaml.dump(config));
    await this.reply("已将GT接口替换为接口1，请重启云崽后生效", true);
  }

  async api2() {
    if (!this.e.isMaster) return false;
    let config = yaml.load(fs.readFileSync(this.configPath, "utf8"));
    config.verifyAddr = "http://gt.yunzai.icu/GTest/register?key=免费开源项目-您如果是交易获得则是被骗-请及时退款并举报";
    config.signAddr = "ws://gt.yunzai.icu/mysSign?key=免费开源项目-您如果是交易获得则是被骗-请及时退款并举报";
    fs.writeFileSync(this.configPath, yaml.dump(config));
    await this.reply("已将GT接口替换为接口2,请重启云崽后生效", true);
  }
}