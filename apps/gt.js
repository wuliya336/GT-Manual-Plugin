import md5 from 'md5'
import lodash from 'lodash'
import Tools from '../model/sign&&verify.js'

export class bbsVerification extends plugin {
  constructor (e) {
    super({
      name: 'GT-Manual-Plugin',
      priority: -(9 ** 9),
      namespace: 'GT插件',
      handler: [
        {
          dsc: 'mys请求错误处理',
          key: 'mys.req.err',
          fn: 'mysReqErrHandler'
        }
      ],
      rule: [
        {
          dsc: '米游社手动签到',
          reg: '^#*(原神|星铁|米游社)?签到(.*)$',
          fnc: 'sign'
        },
        {
          dsc: '重新连接WebSocket',
          reg: '^#(GT|gt)重连ws$',
          fnc: 'reconnection',
          permission: 'master'
        },
        {
          dsc: '刷新米游社验证',
          reg: '^#(GT|gt)刷新验证$',
          fnc: 'bbsVerify'
        }
      ]
    })
  }

  async mysReqErrHandler (e, options, reject) {
    let { mysApi, type, data } = options
    let retcodeError = [1034, 5003]
    let cfg = Tools.Cfg

    if (
      !retcodeError.includes(options.res.retcode) ||
      cfg.blackList.includes(e.user_id) ||
      !(cfg.verify && cfg.verifyAddr) ||
      (cfg.verify == 3 && !e.isSr) ||
      (cfg.verify == 2 && e.isSr)
    ) return reject()

    /** isVerify */
    if (e.isVerify) return await mysApi.getData(type, data)

    mysApi.getUrl = (...args) => this.getUrl.apply(mysApi, args)

    let verify = await Tools.bbsVerification(e, mysApi)
    if (!verify) logger.error(`[米游社验证失败][uid:${e.uid || mysApi.uid}][qq:${e.user_id}]`)

    if (options.OnlyGtest) return verify

    return verify ? await mysApi.getData(type, data) : options.res
  }

  getUrl (type, data = {}) {
    let urlMap = {
      ...this.apiTool.getUrlMap({ ...data, deviceId: this.device }),
      createVerification: {
        url: 'https://api-takumi-record.mihoyo.com/game_record/app/card/wapi/createVerification',
        query: 'is_high=true'
      },
      verifyVerification: {
        url: 'https://api-takumi-record.mihoyo.com/game_record/app/card/wapi/verifyVerification',
        body: data
      }
    }
    if (!urlMap[type]) return false

    let { url, query = '', body = '' } = urlMap[type]

    if (query) url += `?${query}`
    if (body) body = JSON.stringify(body)

    let headers = this.getHeaders(query, body)
    if (this.isSr) headers['x-rpc-challenge_game'] = '6'

    return { url, headers, body }
  }

  async sign (e) {
    let msg = e.msg.replace(/＃|#|原神|星铁|米游社|签到/g, '')
    e.user_id = e.at || (msg && Number(msg)) || e.user_id
    let key = md5(e.user_id)
    if (!Tools.ws) {
      Tools.connectWebSocket()
      await new Promise((resolve) => setTimeout(resolve, 1000))
      if (!Tools.ws) return false
    }
    this.mysUsers = this.mysUsers || {}
    Tools.mysUsers = this.mysUsers
    Tools.MysUser = e.runtime.MysUser
    let user = await e.runtime.NoteUser.create(e.user_id)
    if (!user.hasCk) {
      await e.reply('请先绑定cookie', true)
      return
    }
    this.mysUsers[key] = user.mysUsers
    let payload = this.getUidsData(key, e.user_id)
    let { link } = await Tools.socketSend('createUser', payload, key)
    if (link) await e.reply(`签到地址: ${link}`)
  }

  getUidsData (key, user_id) {
    let uids = []
    let mysUsers = this.mysUsers[key]
    lodash.forEach(mysUsers, ds => {
      for (let game of ['gs', 'sr']) {
        ds.getUids(game).forEach(uid => uids.push(ds.getUidData(uid, game)))
      }
    })
    return uids
  }

  reconnection (e) {
    Tools.connectWebSocket()
    e.reply(Tools.ws ? '重连成功~' : '重连失败~')
  }

  async bbsVerify (e) {
    let user = await e.runtime.NoteUser.create(e.user_id)
    let mysUser = user.getMysUser()
    if (!user.hasCk) {
      await e.reply('请先绑定cookie', true)
      return
    }
    let mysApi = new Tools.MysApi(mysUser.uid, mysUser.ck)
    let verify = await Tools.bbsVerification(e, mysApi)
    if (!verify) {
      await e.reply('米游社验证失败!', true)
      logger.error(`[米游社验证失败][uid:${mysApi.uid}][qq:${e.user_id}]`)
      return
    }
    await e.reply('米游社验证成功!', true)
  }
}
