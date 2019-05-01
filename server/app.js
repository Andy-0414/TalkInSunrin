const express = require('express')
const app = express()
var http = require('http').Server(app);
var io = require('socket.io')(http);

var chatList = [
    {
        name : "공개 1",
        users : new Set()
    }
]

io.on('connection', (socket) => {
    console.log('connect')
    socket.on('sendMsg', data => {
        console.log(data)
        io.emit('getMsg', data)
    })
})

http.listen(3000, () => {
    console.log("server open");
})