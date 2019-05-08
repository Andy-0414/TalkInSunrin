const express = require('express')
const app = express()
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(express.static('public'))
app.use(express.urlencoded());
app.use(express.json())

var userData = {
    userList: [],
    findNameIdx(name) {
        return this.userList.findIndex(x => x.name == name)
    },
    nameHas(name) {
        return this.findNameIdx(name) != -1
    },
    findIdIdx(id) {
        return this.userList.findIndex(x => x.id == id)
    },
    idHas(id) {
        return this.findIdIdx(id) != -1
    },
    add(data) {
        if (!this.nameHas(data.name))
            this.userList.push(data)
    },
    delete(data) {
        if (this.nameHas(data.name))
            this.userList.splice(this.findNameIdx(data.name), 1)
        if (this.idHas(data.id))
            this.userList.splice(this.findIdIdx(data.id), 1)
    },
    getUserFromId(id) {
        return this.userList[this.findIdIdx(id)]
    }
}
var chatList = [{
        _id: 0,
        name: "2학년 4반",
        users: new Set()
    },
    {
        _id: 1,
        name: "2학년 5반",
        users: new Set()
    },
    {
        _id: 3,
        name: "2학년 6반",
        users: new Set()
    },
    {
        _id: 4,
        name: "공개 1",
        users: new Set()
    },
    {
        _id: 5,
        name: "공개 2",
        users: new Set()
    },
    {
        _id: 6,
        name: "공개 3",
        users: new Set()
    },
    {
        _id: 7,
        name: "공개 4",
        users: new Set()
    }
]

app.get("/", (req, res) => {
    res.sendfile("./public/index.html")
})
app.get("/chat_iframe", (req, res) => {
    res.sendfile("./public/views/chat_iframe.html")
})
app.post("/checkName", (req, res) => {
    if (userData.nameHas(req.body.name)) {
        res.send({
            isAvailable: false
        })
    } else {
        res.send({
            isAvailable: true
        })
    }
})


function getChatList() {
    var arr = chatList.map(x => {
        return {
            _id: x._id,
            name: x.name,
            users: Array.from(x.users)
        }
    })
    return arr
}
io.on('connection', (socket) => {
    socket.emit("sendChatList", getChatList())
    socket.on("addUser", data => {
        if (!userData.nameHas(data.name)) {
            data.id = socket.id
            userData.add(data)
        }
    })
    socket.on("leaveRoom", data => {
        var idx = chatList.findIndex(x => x._id == data._id)
        if (idx != -1) {
            if (chatList[idx].users.has(socket.id)) {
                socket.leave(data._id)
                if (chatList[idx].users.has(socket.id))
                    chatList[idx].users.delete(socket.id)
                io.sockets.emit("sendChatList", getChatList())
            }
        }
    })
    socket.on("joinRoom", data => {
        var idx = chatList.findIndex(x => x._id == data._id)
        if (idx != -1) {
            if (!chatList[idx].users.has(socket.id)) {
                socket.join(data._id)
                chatList[idx].users.add(socket.id)
                socket.emit("joinRoomClear", chatList[idx])
                io.sockets.emit("sendChatList", getChatList())
                io.sockets.to(data._id).emit("sendToClientMessage", {
                    _id: data._id,
                    username: data.username,
                    msg: `${data.username}님이 접속하였습니다.`
                })
            }
        }
    })
    socket.on("sendToServerMessage", data => {
        io.sockets.to(data._id).emit("sendToClientMessage", data)
    })
    socket.on("disconnect", data => {
        socket.leaveAll()
        chatList.forEach(x => {
            if (x.users.has(socket.id))
                x.users.delete(socket.id)
        })
        userData.delete({
            id: socket.id
        })
        io.sockets.emit("sendChatList", getChatList())
    })
})

http.listen(80, () => {
    console.log("server open");
})