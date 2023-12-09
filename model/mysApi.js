import md5 from 'md5'
import lodash from 'lodash'
import fetch from 'node-fetch'

export default class MysApi {
  /**
   * @param uid 游戏uid
   * @param cookie 米游社cookie
   * @param option 其他参数
   * @param option.log 是否显示日志
   */
  constructor (uid, cookie, option = {}) {
    this.uid = uid
    this.cookie = cookie
    this.option = { ...option }
    this.game = option.game || 'gs'
    this.server = this.getServer()
  }

  urlMap (data) {
    let host = 'https://api-takumi.mihoyo.com/'
    let hostRecord = 'https://api-takumi-record.mihoyo.com/'
    let signActId = { gs: 'e202311201442471', sr: 'e202304121516551' }
    return {
      createVerification: {
        url: `${hostRecord}game_record/app/card/wapi/createVerification`,
        query: 'is_high=true'
      },
      verifyVerification: {
        url: `${hostRecord}game_record/app/card/wapi/verifyVerification`,
        body: data
      },
      bbs_sign_info: {
        url: `${host}event/luna/info`,
        query: `act_id=${signActId[this.game]}&region=${this.server}&uid=${this.uid}&lang=zh-cn`,
        sign: true
      },
      bbs_sign_home: {
        url: `${host}event/luna/home`,
        query: `act_id=${signActId[this.game]}&region=${this.server}&uid=${this.uid}&lang=zh-cn`,
        sign: true
      },
      bbs_sign: {
        url: `${host}event/luna/sign`,
        body: { act_id: signActId[this.game], region: this.server, uid: this.uid, lang: 'zh-cn' },
        sign: true
      }
    }
  }

  getUrl (type, data = {}) {
    let urlMap = this.urlMap(data)
    if (!urlMap[type]) return false

    let { url, query = '', body = '', sign = '' } = urlMap[type]

    if (query) url += `?${query}`
    if (body) body = JSON.stringify(body)

    let headers = this.getHeaders(query, body, sign)

    return { url, headers, body }
  }

  getServer () {
    let uid = this.uid
    this.isSr = this.game === 'sr'
    switch (String(uid)[0]) {
      case '1':
      case '2':
        return this.isSr ? 'prod_gf_cn' : 'cn_gf01' // 官服
      case '5':
        return this.isSr ? 'prod_qd_cn' : 'cn_qd01' // B服
      case '6':
        return this.isSr ? 'prod_official_usa' : 'os_usa' // 美服
      case '7':
        return this.isSr ? 'prod_official_euro' : 'os_euro' // 欧服
      case '8':
        return this.isSr ? 'prod_official_asia' : 'os_asia' // 亚服
      case '9':
        return this.isSr ? 'prod_official_cht' : 'os_cht' // 港澳台服
    }
    return this.isSr ? 'prod_gf_cn' : 'cn_gf01'
  }

  async getData (type, data = {}) {
    let { url, headers, body } = this.getUrl(type, data)
    if (!url) return false

    headers.Cookie = this.cookie

    if (data.headers) {
      headers = { ...headers, ...data.headers }
      delete data.headers
    }

    let param = {
      headers,
      timeout: 10000
    }

    if (body) {
      param.method = 'post'
      param.body = body
    } else {
      param.method = 'get'
    }
    let response = {}
    try {
      response = await fetch(url, param)
    } catch (error) {
      logger.error(error.toString())
      return false
    }

    if (!response.ok) {
      return false
    }
    const res = await response.json()

    if (!res) {
      return false
    }

    res.api = type

    return res
  }

  getHeaders (query = '', body = '', sign = false) {
    let headers = {
      'x-rpc-device_id': this.option.device_id || this.getGuid(),
      'x-rpc-app_version': '2.40.1',
      'x-rpc-client_type': 5,
      'User-Agent': `Mozilla/5.0 (Linux; Android 12; ${this.device}) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0.4844.73 Mobile Safari/537.36 miHoYoBBS/2.40.1`,
      'X-Requested-With': 'com.mihoyo.hyperion',
      Origin: 'https://webstatic.mihoyo.com',
      Referer: 'https://webstatic.mihoyo.com',
      DS: this.getDs(query, body)
    }
    if (sign) {
      if (!this.isSr) headers['x-rpc-signgame'] = 'hk4e'
      headers.Origin = 'https://act.mihoyo.com'
      headers.Referer = 'https://act.mihoyo.com'
      headers.DS = this.getDsSign()
    }
    return headers
  }

  getDs (q = '', b = '') {
    let n = 'xV8v4Qu54lUKrEYFZkJhB8cuOh9Asafs'
    let t = Math.round(new Date().getTime() / 1000)
    let r = Math.floor(Math.random() * 900000 + 100000)
    let DS = md5(`salt=${n}&t=${t}&r=${r}&b=${b}&q=${q}`)
    return `${t},${r},${DS}`
  }

  /** 签到ds */
  getDsSign () {
    /** @Womsxd */
    const n = 'jEpJb9rRARU2rXDA9qYbZ3selxkuct9a'
    const t = Math.round(new Date().getTime() / 1000)
    const r = lodash.sampleSize('abcdefghijklmnopqrstuvwxyz0107607077', 6).join('')
    const DS = md5(`salt=${n}&t=${t}&r=${r}`)
    return `${t},${r},${DS}`
  }

  getGuid () {
    function S4 () {
      return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1)
    }
    return (S4() + S4() + '-' + S4() + '-' + S4() + '-' + S4() + '-' + S4() + S4() + S4())
  }

  /* eslint-disable quotes */
  get device () {
    if (!this._device) this._device = `${md5(this.uid).substring(0, 5)}`
    return this._device
  }
}
