const jwt = require('jwt-simple')

const sendRule = require('./send-rule')
const logger = require('./logger')

const User = require('../schema/User')

module.exports = {
    findUser(user) { // DB find
        return User.findOne({
            email: user.email
        })
    },
    createToken(data) { // 토큰 생성
        return "Bearer " + jwt.encode(data, process.env.DB_SECRET)
    },
    isDataAble(...args) { // 데이터 유효성 검사
        return args.filter(x => !x).length == 0
    },
    _userValidation(isUserHaveCallBack, isUserNotHaveCallBack = (req, res, next) => { // DB에서 유저 찾기
        next(sendRule.createError(404, "계정이 존재하지 않음"))
    }) {
        return (req, res, next) => {
            var {
                email
            } = req.body || req.user
            if (this.isDataAble(email)) {
                this.findUser({
                        email
                    })
                    .then(data => {
                        if (data) {
                            isUserHaveCallBack(req, res, next, data)
                        } else {
                            isUserNotHaveCallBack(req, res, next)
                        }
                    })
                    .catch(err => {
                        next(err)
                    })
            } else {
                next(sendRule.createError(400))
            }
        }
    },
    loginValidation() { // 로그인 토큰 발급
        return this._userValidation(
            (req, res, next, data) => {
                var {
                    password
                } = req.body
                if (this.isDataAble(password)) {
                    if (data.password == password) {
                        data.lastLogin = new Date()
                        data.save(err => {
                            if (err) next(err)
                            sendRule.sendOK(res, this.createToken(data), "로그인 성공")
                        })
                    } else {
                        next(sendRule.createError(403, "비밀번호가 일치하지 않음"))
                    }
                } else {
                    next(sendRule.createError(400))
                }
            }
        )
    },
    registerValidation() { // 회원가입
        return this._userValidation(
            (req, res, next) => {
                next(sendRule.createError(403, "이미 계정이 존재함"))
            },
            (req, res, next, data) => {
                var {
                    email,
                    username,
                    password
                } = req.body
                if (this.isDataAble(email, username, password)) {
                    var registerUser = new User({
                        email: email,
                        username: username,
                        password: password
                    })
                    registerUser.save(err => {
                        if (err) next(err)
                        sendRule.sendCreated(res, null, "계정 생성")
                    })
                } else {
                    next(sendRule.createError(400))
                }
            }
        )
    },
    changeProfile() { // 프로필 변경
        return this._userValidation(
            (req, res, next, data) => {
                var {
                    username
                } = req.body
                if (this.isDataAble(username)) {
                    data.username = username
                    data.save(err => {
                        if (err) next(err)
                        else sendRule.sendOK(res, this.createToken(data), "프로필 변경 성공")
                    })
                } else {
                    next(sendRule.createError(400))
                }

            }
        )
    },
    changePassword() { // 비밀번호 변경
        return this._userValidation(
            (req, res, next, data) => {
                var {
                    password,
                    newPassword
                } = req.body
                if (this.isDataAble(password, newPassword)) {
                    if (data.password == password) {
                        data.password = newPassword
                        data.save(err => {
                            if (err) next(err)
                            else sendRule.sendOK(res, this.createToken(data), "비밀번호 변경 성공")
                        })
                    } else {
                        next(sendRule.createError(403, "비밀번호가 일치하지 않음"))
                    }
                } else {
                    next(sendRule.createError(400))
                }
            }
        )
    },
    removeAccount() { // 계정 삭제
        return this._userValidation(
            (req, res, next, data) => {
                var {
                    password
                } = req.body
                if (this.isDataAble(password)) {
                    if (data.password == password) {
                        data.remove(err => {
                            if (err) next(err)
                            else sendRule.sendOK(res, null, "계정 삭제 성공")
                        })
                    }
                }
            }
        )
    }
}