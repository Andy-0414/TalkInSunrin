const passport = require('passport');
const GitHubStrategy = require('passport-github').Strategy;


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
        authenticate() { // 로그인 시도
            return passport.authenticate('github', {
                successRedirect: '/hudchat',
                failureRedirect: '/'
            })
        },
    }
}