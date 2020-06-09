const express = require("express");
const app = express();
const session = require("express-session");
const http = require("http").Server(app);
const io = require("socket.io")(http);

require("dotenv").config();

const passportLoginAuth = require("./modules/passport-login-auth")();

app.use(express.static("public"));
app.use(express.urlencoded());
app.use(express.json());
app.use(
	session({
		secret: "TMP", // TODO change
		cookie: {
			maxAge: 1000 * 60 * 60 * 24 * 1,
		},
	})
);
app.use(passportLoginAuth.initialize());
app.use(passportLoginAuth.session());

passportLoginAuth.getPassport().serializeUser((user, done) => {
	done(null, user);
});
passportLoginAuth.getPassport().deserializeUser((user, done) => {
	done(null, user);
});

app.get("/", (req, res) => {
	res.sendfile("./public/index.html");
});
app.get("/hudchat", (req, res) => {
	res.sendfile("./public/views/chat_iframe.html");
});
app.get("/profile/:name", (req, res) => {
	res.sendfile("./public/views/profile.html");
});
app.use("/auth", require("./router/auth.js"));

var chatList = [
	{
		_id: 0,
		name: "공개 1",
		users: new Set(),
	},
	{
		_id: 1,
		name: "공개 2",
		users: new Set(),
	},
	{
		_id: 2,
		name: "공개 3",
		users: new Set(),
	},
	{
		_id: 3,
		name: "공개 4",
		users: new Set(),
	},
];

function getChatList() {
	var arr = chatList.map((x) => {
		return {
			_id: x._id,
			name: x.name,
			users: Array.from(x.users),
		};
	});
	return arr;
}
io.on("connection", (socket) => {
	socket.emit("sendChatList", getChatList());
	socket.on("leaveRoom", (data) => {
		var idx = chatList.findIndex((x) => x._id == data._id);
		if (idx != -1) {
			if (chatList[idx].users.has(socket.id)) {
				socket.leave(data._id);
				if (chatList[idx].users.has(socket.id)) chatList[idx].users.delete(socket.id);
				io.sockets.emit("sendChatList", getChatList());
			}
		}
	});
	socket.on("joinRoom", (data) => {
		var idx = chatList.findIndex((x) => x._id == data._id);
		if (idx != -1) {
			if (!chatList[idx].users.has(socket.id)) {
				socket.join(data._id);
				chatList[idx].users.add(socket.id);
				socket.emit("joinRoomClear", chatList[idx]);
				io.sockets.emit("sendChatList", getChatList());
				io.sockets.to(data._id).emit("sendToClientMessage", {
					_id: data._id,
					username: data.username,
					img: data.img,
					msg: `${data.username}님이 접속하였습니다.<hr>`,
				});
			}
		}
	});
	socket.on("sendToServerMessage", (data) => {
		io.sockets.to(data._id).emit("sendToClientMessage", data);
	});
	socket.on("disconnect", (data) => {
		socket.leaveAll();
		chatList.forEach((x) => {
			if (x.users.has(socket.id)) x.users.delete(socket.id);
		});
		io.sockets.emit("sendChatList", getChatList());
	});
});

http.listen(80, () => {
	console.log("TalkInSunrin Server");
});
