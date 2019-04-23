var chat = new ChatBox();
chat.setProp(document.getElementsByClassName('chatBox')[0])
var target = null;
var currentX = 0;
var currentY = 0;
document.addEventListener("mousedown", (e) => {
    if (e.target.parentElement.classList.contains("chatBox")) {
        target = e.target.parentElement
        currentX = e.clientX - target.controller.getX()
        currentY = e.clientY - target.controller.getY()
    }
})
document.addEventListener("mousemove", (e) => {
    if (target)
        target.controller.setPos(e.clientX - currentX,e.clientY-currentY)
})
document.addEventListener("mouseup", (e) => {
    target = null
})