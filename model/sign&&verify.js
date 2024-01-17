import MysApi from './mysApi.js'
import MysSign from './mysSign.js'
import WebSocket from 'ws'
import fs from 'node:fs'
import YAML from 'yaml'
import fetch from 'node-fetch'

class Tools {
  constructor () {
    this._wait = this._wait || {}
    if (this.Cfg.sign) {
      this.connectWebSocket()
    }
  }

  get Cfg () {
    let file = './plugins/GT-Manual-Plugin/config/gt.yaml'
    this._cfg = this._cfg || YAML.parse(fs.readFileSync(file, 'utf8'))
    return this._cfg
  }

  get MysApi () {
    return MysApi
  }

  get MysSign () {
    return new MysSign()
  }

  connectWebSocket () {
    this.ws = new WebSocket(this.Cfg.signAddr)
    this.ws.on('error', logger.error)
    this.ws.on('open', () => logger.mark('[GT-Manual] WebSocket已连接'))
    this.ws.on('close', (code) => {
      logger.error(`[GT-Manual] WebSocket已断开, code: ${code}`)
      this.ws = null
    })
    this.ws.on('message', (data) => {
      try {
        data = JSON.parse(data)
        let { id, cmd, payload, key } = data
        this._key = key
        this._wait[id] && this._wait[id](payload) || this[cmd] && this[cmd](payload, id)
      } catch (err) {
        logger.error(err)
      }
    })
  }

  async doSign (data, id) {
    let res = {}
    let mysUser = await this.MysUser.create(data.ltuid, true)
    if (mysUser.ck) {
      res = await this.MysSign.doSign(mysUser.ck, data)
    }
    this.socketWrite('signStatus', res, id)
  }

  socketWrite (cmd, payload, id) {
    if (!id || typeof id == 'number' && String(id).length == 13) id = new Date().getTime()
    return this.ws.send(JSON.stringify({ id, cmd, payload, key: this._key }))
  }

  socketSend (cmd, payload, id) {
    return new Promise((resolve, reject) => {
      this.socketWrite(cmd, payload, `${id}`)
      this._wait[id] = resolve
      setTimeout(() => resolve(false) && delete this._wait[id], 8 * 1000)
    })
  }

  /** 刷新米游社验证 */
  async bbsVerification (e, mysApi) {
    let create = await mysApi.getData('createVerification')
    if (!create || create.retcode !== 0) return false

    let verify = await this.ManualVerify(e, { uid: mysApi.uid, ...create.data })
    if (!verify) return false

    let submit = await mysApi.getData('verifyVerification', verify)
    if (!submit || submit.retcode !== 0) return false

    e.isVerify = true
    logger.mark(`[米游社验证成功][uid:${mysApi.uid}][qq:${e.user_id}]`)
    return true
  }

  /** 手动验证, 返回validate */
  async ManualVerify (e, data) {
    if (!data.gt || !data.challenge || !e?.reply) return false

    let res = await fetch(this.Cfg.verifyAddr, {
      method: 'post',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(data)
    })
    res = await res.json()
    if (!res.data) return false

    await e.reply(`请打开地址并完成验证\n${res.data.link}`, true)

    for (let i = 0; i < 80; i++) {
      let validate = await fetch(res.data.result)
      validate = await validate.json()
      if (validate.data) {
        return validate.data
      }
      await new Promise((resolve) => setTimeout(resolve, 1500))
    }
    return false
  }
}

export default new Tools()