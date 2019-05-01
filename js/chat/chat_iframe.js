const animationScheduler = new AnimationScheduler()
animationScheduler.start()

const chatList = document.getElementsByClassName('chatBox')

var chat1 = new ChatBox();
chat1.setProp(chatList[0])
var chat2 = new ChatBox();
chat2.setProp(chatList[1])

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
        
        ;[...chatList].forEach(x=>{
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