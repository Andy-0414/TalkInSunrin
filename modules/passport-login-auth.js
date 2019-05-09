const passport = require('passport');
const GitHubStrategy = require('passport-github').Strategy;


module.exports = () => {
    passport.use(new GitHubStrategy({
            clientID: "c0960bc405f3f491062c",
            clientSecret: "7b23eb6d389fcc6f26985605f765a89e505bd722",
            callbackURL: "http://58.145.101.15:3000/auth/github/callback"
        },
        (accessToken, refreshToken, profile, done) => {
            done(null, profile)
        }
    ));
    // passport.serializeUser((user, done) => { // 세션 생성
    //     done(null,user)
    // });

    // passport.deserializeUser((user, done) => { // 세션 확인
    //     done(null,user)
    // });
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