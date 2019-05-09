const logger = require('./logger')

module.exports = {
    _defaultSendFormat(res, data, msg, status, result = true) { // 기본 포멧
        if (status >= 400) logger.loge(msg)
        else logger.logc(msg)
        res.status(status).send({
            result,
            msg,
            data
        }).end()
    },
    sendOK(res, data, msg = "200 OK") { // 성공
        this._defaultSendFormat(res, data, msg, 200)
    },
    sendCreated(res, data, msg) { // 생성
        this._defaultSendFormat(res, data, msg || "201 Created", 201)
    },
    sendAccepted(res, data, msg) { // 수락
        this._defaultSendFormat(res, data, msg || "202 Accepted", 202)
    },
    sendBadRequest(res, data, msg) { // 잘못된 요청
        this._defaultSendFormat(res, data, msg || "400 BadRequest", 400, false)
    },
    sendUnauthorized(res, data, msg) { // 인증 필요
        this._defaultSendFormat(res, data, msg || "401 Unauthorized", 401, false)
    },
    sendForbidden(res, data, msg) { // 숨김
        this._defaultSendFormat(res, data, msg || "403 Forbidden", 403, false)
    },
    sendNotFound(res, data, msg) { // 찾을 수 없음
        this._defaultSendFormat(res, data, msg || "404 NotFound", 404, false)
    },
    sendInternalServerError(res, data, msg) { // 서버 에러
        this._defaultSendFormat(res, data, msg || "500 InternalServerError", 500, false)
    },
    createError(status = 500, message) { // 에러 생성
        var err = new Error(message)
        err.status = status
        return err
    },
    errorHendling() { // 에러 핸들링
        return (err, req, res, next) => {
            switch (err.status) {
                case 400:
                    this.sendBadRequest(res, null, err.message)
                    break
                case 401:
                    this.sendUnauthorized(res, null, err.message)
                    break
                case 404:
                    this.sendNotFound(res, null, err.message)
                    break
                case 500:
                    this.sendInternalServerError(res, null, err.message)
                    break
                default:
                    this.sendInternalServerError(res, null, err.message)
            }
        }
    }
}