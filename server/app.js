const express = require('express')
const app = express()
var http = require('http').Server(app);
var io = require('socket.io')(http);

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