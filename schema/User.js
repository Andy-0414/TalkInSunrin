var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = mongoose.model('User', new Schema({
    username: String, // 유저 이름
    email: String, // 이메일
    password: String, // 패스워드
    registerTime: { // 가입 시간
        type: Date,
        default: Date.now
    },
    lastLogin: { // 최근 로그인 시간
        type: Date,
        default: Date.now
    },
    isAdmin: Boolean // 어드민 권한
}));