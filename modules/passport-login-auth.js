const passport = require('passport');
const GitHubStrategy = require('passport-github').Strategy;
const NaverStrategy = require('passport-naver').Strategy;


module.exports = () => {
    passport.use(new GitHubStrategy({
        clientID: "c0960bc405f3f491062c",
        clientSecret: "7b23eb6d389fcc6f26985605f765a89e505bd722",
        callbackURL: "http://andy0414.sunrin.life/auth/github/callback"
    },
        (accessToken, refreshToken, profile, done) => {
            done(null, profile)
        }
    ));

    passport.use(new NaverStrategy({
        clientID: "02SUb7EpO5CQfjBYDvUr",
        clientSecret: "eDo58rC086",
        callbackURL: "http://andy0414.sunrin.life/auth/github/callback"
    },
        (accessToken, refreshToken, profile, done) => {
            console.log(profile)
            done(null, profile)
        }
    ));
    return {
        initialize() { // 기본
            return passport.initialize()
        },
        session() {
            return passport.session()
        },
        getPassport() {
            return passport
        },
        authenticate(str) { // 로그인 시도
            return passport.authenticate(str, {
                successRedirect: '/hudchat',
                failureRedirect: '/'
            })
        },
    }
}