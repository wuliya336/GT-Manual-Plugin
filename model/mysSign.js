import moment from 'moment'
import MysApi from './mysApi.js'

export default class MysSign {
  async doSign (cookie, uidData) {
    let { uid, game, validate } = uidData
    this.prefix = `Yz:${game == 'sr' ? 'starrail' : 'genshin'}:sign:`
    this.mysApi = new MysApi(uid, cookie, { game })
    this.key = `${this.prefix}isSign:${uid}`
    this.uid = uid
    this.validate = validate

    let isSigned = await redis.get(this.key)
    if (isSigned) {
      let reward = await this.getReward(isSigned)
      return {
        retcode: 0,
        msg: `今天已签到：第${isSigned}天奖励 ${reward}`,
        is_sign: true
      }
    }

    /** 判断是否已经签到 */
    let signInfo = await this.mysApi.getData('bbs_sign_info')
    await this.sleep(100)

    if (!signInfo) {
      return {
        retcode: -999,
        msg: '签到失败：请求失败'
      }
    }

    if (signInfo.retcode == -100) {
      return {
        retcode: -100,
        msg: `签到失败: 绑定cookie已失效`,
        is_invalid: true
      }
    }

    if (signInfo.retcode !== 0) {
      return {
        retcode: signInfo.retcode,
        msg: `签到失败：${signInfo.message || '未知错误'}`
      }
    }

    if (signInfo.first_bind) {
      return {
        retcode: 100,
        msg: '签到失败：首次请先手动签到'
      }
    }

    this.signInfo = signInfo.data

    if (this.signInfo.is_sign) {
      let reward = await this.getReward(this.signInfo.total_sign_day)
      this.setCache(this.signInfo.total_sign_day)
      return {
        retcode: 0,
        msg: `今天已签到：第${this.signInfo.total_sign_day}天奖励 ${reward}`,
        is_sign: true
      }
    }

    /** 签到 */
    let res = await this.bbsSign()

    if (res) {
      let totalSignDay = this.signInfo.total_sign_day
      if (!this.signInfo.is_sign) {
        totalSignDay++
      }

      let tips = '签到成功'

      if (this.signed) {
        tips = '今天已签到'
      }

      let reward = await this.getReward(totalSignDay)

      this.setCache(totalSignDay)

      return {
        retcode: 0,
        msg: `${tips}：第${totalSignDay}天奖励 ${reward}`
      }
    }

    if (this.verify) {
      return {
        retcode: 1034,
        msg: `签到失败：${this.signMsg}`,
        verify: true,
        ...this.verify
      }
    }

    return {
      retcode: -1000,
      msg: `签到失败：${this.signMsg}`
    }
  }

  sleep (ms) {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }

  // 缓存签到奖励
  async getReward (signDay) {
    let key = `${this.prefix}reward`
    let reward = await redis.get(key)

    if (reward) {
      reward = JSON.parse(reward)
    } else {
      let res = await this.mysApi.getData('bbs_sign_home')
      if (!res || Number(res.retcode) !== 0) return false

      let data = res.data
      if (data && data.awards && data.awards.length > 0) {
        reward = data.awards

        let monthEnd = Number(moment().endOf('month').format('X')) - Number(moment().format('X'))
        redis.setEx(key, monthEnd, JSON.stringify(reward))
      }
    }
    if (reward && reward.length > 0) {
      reward = reward[signDay - 1] || ''
      if (reward.name && reward.cnt) {
        reward = `${reward.name}*${reward.cnt}`
      }
    } else {
      reward = ''
    }

    return reward
  }

  async bbsSign () {
    let params = {}
    if (this.validate) {
      params.headers = {
        'x-rpc-seccode': this.validate?.geetest_seccode,
        'x-rpc-validate': this.validate?.geetest_validate,
        'x-rpc-challenge': this.validate?.geetest_challenge
      }
    }
    let sign = await this.mysApi.getData('bbs_sign', params)
    this.signMsg = sign?.message ?? 'Too Many Requests'

    if (!sign) {
      return false
    }

    /** 签到成功 */
    if (sign.retcode === -5003) {
      this.signed = true
      return true
    }

    if (sign.data && sign.data.challenge) {
      this.signMsg = '验证码失败，请稍后重试'
      sign.message = '验证码失败'
      this.verify = sign.data
      return false
    }

    if (sign.retcode === 0 && (sign?.data.success === 0 || sign?.message === 'OK')) {
      return true
    }

    return false
  }

  async setCache (day) {
    let end = Number(moment().endOf('day').format('X')) - Number(moment().format('X'))
    redis.setEx(this.key, end, String(day))
  }
}
