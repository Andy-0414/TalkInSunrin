const chalk = require('chalk')
const moment = require('moment')
const l = console.log

require('moment-timezone');
moment.tz.setDefault('Asia/Seoul') // 한국/서울 기준

module.exports = {
    getNowTime() { // 현재 시간
        return moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
    },
    _defaultLogFormat(type, args) { // 기본 포멧
        args.forEach(x => {
            l(chalk.bold.yellow(`[${this.getNowTime()}]${type} `) + chalk.white(x))
        })
    },
    log(...args) { // 일반 로그
        this._defaultLogFormat(chalk.bold.yellow("[LOG]"), args)
    },
    logc(...args) { // 성공 로그
        this._defaultLogFormat(chalk.bold.green("[CLEAR]"), args)
    },
    loge(...args) { // 에러 로그
        this._defaultLogFormat(chalk.bold.red("[ERROR]"), args)
    }
}