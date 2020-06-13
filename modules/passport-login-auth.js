const passport = require("passport");
const GitHubStrategy = require("passport-github").Strategy;
const NaverStrategy = require("passport-naver").Strategy;

module.exports = () => {
	passport.use(
		new GitHubStrategy(
			{
				clientID: process.env.GITHUB_CLIENT_ID || "",
				clientSecret: process.env.GITHUB_CLIENT_SECRET || "7b23eb6d389fcc6f26985605f765a89e505bd722",
				callbackURL: "https://talk-in-sunrin.herokuapp.com/auth/github/callback",
			},
			(accessToken, refreshToken, profile, done) => {
				var user = {
					loginType: "GITHUB",
					username: profile.username,
					img: profile.photos[0].value,
				};
				done(null, user);
			}
		)
	);

	return {
		initialize() {
			// 기본
			return passport.initialize();
		},
		session() {
			return passport.session();
		},
		getPassport() {
			return passport;
		},
		authenticate(str) {
			// 로그인 시도
			return passport.authenticate(str, {
				successRedirect: "/hudchat",
				failureRedirect: "/",
			});
		},
	};
};
