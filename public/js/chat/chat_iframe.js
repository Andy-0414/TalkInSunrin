var username = localStorage.getItem("TIS_username")
if (!username) {
    document.location.href = "/"
}


var socket = io()
var friendList = document.getElementsByClassName("friendList__list")[0]
var chatListBox = document.getElementsByClassName("chatList")[0]

var chatList = document.getElementsByClassName('chatBox')

var myRoom = []
var animationScheduler = new AnimationScheduler()
animationScheduler.start()

window.addEventListener("resize", e => {
    Array.from(chatList).forEach(x => {
        animationScheduler.addAnimation(x.controller)
    })
})

socket.on("sendChatList", data => {
    friendList.innerText = ""
    data.forEach(x => {
        var div = document.createElement("div")
        div.classList.add("friendList__list__item")
        if (myRoom.findIndex(y => y._id == x._id) != -1)
            div.classList.add("friendList__list__item-active")
        div.innerText = `${x.name} [${x.users.length}]`
        div.addEventListener("click", e => {
            socket.emit("joinRoom", x)
        })
        friendList.appendChild(div)
    })
})
socket.on("joinRoomClear", data => {
    var chatBoxDiv = document.createElement("div")
    var chatBoxDiv__Head = document.createElement("div")
    var chatBoxDiv__Head__Close = document.createElement("div")
    var chatBox__Content = document.createElement("div")
    var chatBox__Content__Message = document.createElement("div")
    var chatBox__Input = document.createElement("div")
    var chatBox__Input__Message = document.createElement("input")
    var chatBox__Resize = document.createElement("div")

    chatBoxDiv.classList.add("chatBox")
    chatBoxDiv__Head.classList.add("chatBox__head")
    chatBoxDiv__Head__Close.classList.add("chatBox__head__close")
    chatBox__Content.classList.add("chatBox__content")
    chatBox__Content__Message.classList.add("chatBox__content__message")
    chatBox__Input.classList.add("chatBox__input")
    chatBox__Input__Message.classList.add("chatBox__input__message")
    chatBox__Resize.classList.add("chatBox__resize")

    chatBoxDiv__Head.innerText = data.name
    chatBoxDiv__Head.appendChild(chatBoxDiv__Head__Close)
    chatBoxDiv.appendChild(chatBoxDiv__Head)

    chatBox__Content.appendChild(chatBox__Content__Message)
    chatBoxDiv.appendChild(chatBox__Content)

    chatBox__Input.appendChild(chatBox__Input__Message)
    chatBoxDiv.appendChild(chatBox__Input)

    chatBoxDiv.appendChild(chatBox__Resize)

    var controllerDiv = new ChatBox(data._id)
    controllerDiv.setProp(chatBoxDiv)
    controllerDiv.setPos(3000, 100)
    controllerDiv.setChatEvent((_id, msg) => {
        socket.emit("sendToServerMessage", {
            _id,
            msg,
            username
        })
    })
    controllerDiv.setLeaveEvent(_id => {
        var idx = myRoom.findIndex(x => x._id == _id)
        if (idx != -1) {
            myRoom.splice(idx, 1)
            socket.emit("leaveRoom", {
                _id
            })
        }
    })
    animationScheduler.addAnimation(controllerDiv)

    chatListBox.appendChild(chatBoxDiv)

    myRoom.push({
        controller: controllerDiv,
        _id: data._id
    })
})
socket.on("sendToClientMessage", data => {
    var idx = myRoom.findIndex(x => x._id == data._id)
    if (idx != -1) {
        myRoom[idx].controller.writeMessage(`<b>${data.username} :</b> ${data.msg}`)
    }
})

var target = null;
var resizeTarget = null;
var isClick = false;
var currentX = 0;
var currentY = 0;

function startEvent(_x, _y, _target) {
    if (!_target) return
    isClick = 1
    if (_target.classList.contains("chatBox__resize")) {
        resizeTarget = _target.parentElement
        currentSizeX = resizeTarget.controller.getSizeX()
        currentSizeY = resizeTarget.controller.getSizeY()
    } else if (_target.parentElement.classList.contains("chatBox")) {
        isClick = 2
        target = _target.parentElement
        Array.from(chatList).forEach(x => {
            x.style.zIndex = 0
        })
        target.style.zIndex = 10
        currentX = _x - target.controller.getX()
        currentY = _y - target.controller.getY()

        animationScheduler.onAble()
        animationScheduler.addAnimation(target.controller)
    }
}

function moveEvent(_x, _y) {
    if (resizeTarget) {
        animationScheduler.onDisable()
        resizeTarget.controller.setSize(
            currentSizeX + (_x - currentSizeX - resizeTarget.controller.getX()),
            currentSizeY + (_y - currentSizeY - resizeTarget.controller.getY()))
    } else if (target && isClick) {
        target.controller.setVelocity((_x - (target.controller.getX() + currentX)) / 5, (_y - (target.controller.getY() + currentY)) / 5)
    }
}

function endEvent() {
    animationScheduler.onDisable()
    isClick = false;
    resizeTarget = null
}

var toggle = false
document.addEventListener("keypress", e => {
    if (e.ctrlKey && e.code == "KeyQ")
        toggle = !toggle
    if (toggle)
        chatListBox.style.display = "none"
    else
        chatListBox.style.display = "inline-block"
})

document.addEventListener("mousedown", (e) => {
    startEvent(e.clientX, e.clientY, e.target)
})
document.addEventListener("mousemove", (e) => {
    moveEvent(e.clientX, e.clientY)
})
document.addEventListener("mouseup", (e) => {
    endEvent()
})

document.addEventListener("touchstart", (e) => {
    startEvent(e.touches[0].pageX, e.touches[0].pageY, e.target)
})
document.addEventListener("touchmove", (e) => {
    moveEvent(e.touches[0].pageX, e.touches[0].pageY)
})
document.addEventListener("touchend", (e) => {
    endEvent()
})