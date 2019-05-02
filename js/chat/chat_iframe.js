var socket = io("localhost:3000")
var friendList = document.getElementsByClassName("friendList__list")[0]
var chatListBox = document.getElementsByClassName("chatList")[0]

var chatList = document.getElementsByClassName('chatBox')

var myRoom = []

socket.on("sendChatList", data => {
    friendList.innerHTML = ""
    data.forEach(x => {
        var div = document.createElement("div")
        div.classList.add("friendList__list__item")
        div.innerText = x.name
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
    var chatBox__Input__Message = document.createElement("textarea")
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

    chatListBox.appendChild(chatBoxDiv)
    var controllerDiv = new ChatBox() 
    controllerDiv.setProp(chatBoxDiv)
    controllerDiv.setPos(100,2000)
    animationScheduler.addAnimation(controllerDiv)
    myRoom.push({
        controller: controllerDiv,
        _id : data._id
    })

    var chatList = document.getElementsByClassName('chatBox')
    ;[...chatList].forEach(x=>{
        var a = new ChatBox()
        a.setProp(x)
    })
})

const animationScheduler = new AnimationScheduler()
animationScheduler.start()

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
        target = e.target.parentElement

            ;[...chatList].forEach(x => {
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
    if (target && isClick) {
        target.controller.setVelocity((e.clientX - (target.controller.getX() + currentX)) / 5, (e.clientY - (target.controller.getY() + currentY)) / 5)
    }
    if (resizeTarget) {
        if (loop) clearInterval(loop)
        resizeTarget.controller.setSize(
            currentSizeX + (e.clientX - currentSizeX - resizeTarget.controller.getX()),
            currentSizeY + (e.clientY - currentSizeY - resizeTarget.controller.getY()))
    }
})
document.addEventListener("mouseup", (e) => {
    animationScheduler.onDisable()
    isClick = false;
    resizeTarget = null
})