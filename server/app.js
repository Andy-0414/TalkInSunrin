const express = require('express')
const app = express()
var http = require('http').Server(app);
var io = require('socket.io')(http);

var chatList = [
    {
        _id: 0,
        name: "공개 1",
        users: new Set()
    },
    {
        _id: 1,
        name: "공개 2",
        users: new Set()
    }
]

io.on('connection', (socket) => {
    socket.emit("sendChatList", chatList)
    socket.on("leaveRoom", data => {
        var idx = chatList.findIndex(x => x._id == data._id)
        if (idx != -1) {
            if (chatList[idx].users.has(socket.id)) {
                socket.leave(data._id)
                if (chatList[idx].users.has(socket.id))
                chatList[idx].users.delete(socket.id)
                socket.emit("sendChatList", chatList)
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
                socket.emit("sendChatList", chatList)
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
        socket.emit("sendChatList", chatList)
    })
})

http.listen(3000, () => {
    console.log("server open");
})