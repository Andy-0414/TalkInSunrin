var chat = new ChatBox();
chat.setProp(document.getElementsByClassName('chatBox')[0])

var target = null;
var resizeTarget = null;
var currentX = 0;
var currentY = 0;
var currentSizeX = 0;
var currentSizeY = 0;
document.addEventListener("mousedown", (e) => {
    if (e.target.classList.contains("chatBox__resize")) {
        resizeTarget = e.target.parentElement
        currentSizeX = resizeTarget.controller.getSizeX()
        currentSizeY = resizeTarget.controller.getSizeY()
    }
    else if (e.target.parentElement.classList.contains("chatBox")) {
        target = e.target.parentElement
        currentX = e.clientX - target.controller.getX()
        currentY = e.clientY - target.controller.getY()
    }
    
})
document.addEventListener("mousemove", (e) => {
    if (target)
        target.controller.setPos(e.clientX - currentX, e.clientY - currentY)
    if(resizeTarget)
    {
        resizeTarget.controller.setSize(
            currentSizeX + (e.clientX - currentSizeX - resizeTarget.controller.getX()),
            currentSizeY + (e.clientY - currentSizeY - resizeTarget.controller.getY()))
    }
})
document.addEventListener("mouseup", (e) => {
    target = null
    resizeTarget = null
})