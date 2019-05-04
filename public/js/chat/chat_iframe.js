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
    [...chatList].forEach(x => {
        addAnimation(x.controller)
    })
})

socket.on("sendChatList", data => {
    friendList.innerHTML = ""
    data.forEach(x => {
        var div = document.createElement("div")
        div.classList.add("friendList__list__item")
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

document.addEventListener("mousedown", (e) => {
    isClick = 1
    if (e.target.classList.contains("chatBox__resize")) {
        resizeTarget = e.target.parentElement
        currentSizeX = resizeTarget.controller.getSizeX()
        currentSizeY = resizeTarget.controller.getSizeY()
    } else if (e.target.parentElement.classList.contains("chatBox")) {
        isClick = 2
        target = e.target.parentElement;
        [...chatList].forEach(x => {
            x.style.zIndex = 0
        })
        target.style.zIndex = 10
        currentX = e.clientX - target.controller.getX()
        currentY = e.clientY - target.controller.getY()

        animationScheduler.onAble()
        animationScheduler.addAnimation(target.controller)
    }
})
document.addEventListener("mousemove", (e) => {
    if (resizeTarget) {
        animationScheduler.onDisable()
        resizeTarget.controller.setSize(
            currentSizeX + (e.clientX - currentSizeX - resizeTarget.controller.getX()),
            currentSizeY + (e.clientY - currentSizeY - resizeTarget.controller.getY()))
    }
    else if (target && isClick) {
        target.controller.setVelocity((e.clientX - (target.controller.getX() + currentX)) / 5, (e.clientY - (target.controller.getY() + currentY)) / 5)
    }
})
document.addEventListener("mouseup", (e) => {
    animationScheduler.onDisable()
    isClick = false;
    resizeTarget = null
})