const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt

const logger = require('./logger')
const sendRule = require('./send-rule')
const loginSystem = require('./login-system')

var option = {
    //jwtFromRequest: ExtractJwt.fromBodyField('token'), // Body {token:'TOKEN_STRING'}
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // Header {key : 'Authorization', value : 'Bearer TOKEN_STRING'}
    secretOrKey: process.env.DB_SECRET || "NEM_SECRET", // Secret Key
    //issuer : '',
    //audience : ''
}

module.exports = () => {
    passport.use(new JwtStrategy(option, (jwt_payload, done) => {
        loginSystem.findUser(jwt_payload)
            .then(data => {
                if (data) {
                    if (jwt_payload.password == data.password) {
                        data.lastLogin = new Date()
                        data.save(err => {
                            if (err) done(sendRule.createError())
                            else done(null, data)
                        })
                    } else {
                        done(sendRule.createError(404, "비밀번호가 일치하지 않음"))
                    }
                } else {
                    done(sendRule.createError(404, "계정이 존재하지 않음"))
                }
            })
            .catch(err => {
                done(sendRule.createError(500))
            })
    }))
    return {
        initialize() { // 기본
            return passport.initialize()
        },
        authenticate() { // 로그인 시도
            return passport.authenticate('jwt', {
                failWithError: true,
                session: false
            })
        },
    }
}