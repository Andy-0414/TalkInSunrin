const express = require('express')
const app = express()
var http = require('http').Server(app);
var io = require('socket.io')(http);
app.use(express.static('public'))
app.get("/", (req, res) => {
    res.sendfile("./public/index.html")
})
app.get("/chat_iframe", (req, res) => {
    res.sendfile("./public/views/chat_iframe.html")
})

var chatList = [{
        _id: 0,
        name: "공개 1",
        users: new Set()
    },
    {
        _id: 1,
        name: "공개 2",
        users: new Set()
    },
    {
        _id: 3,
        name: "공개 3",
        users: new Set()
    },
    {
        _id: 4,
        name: "공개 4",
        users: new Set()
    }
]

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
        io.sockets.emit("sendChatList", getChatList())
    })
})

http.listen(80, () => {
    console.log("server open");
})