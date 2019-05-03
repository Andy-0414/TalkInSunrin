class ChatBox {
    constructor(_id,prop) {
        this._id = _id
        if (prop)
            this.setProp(prop)
        this.x = 0;
        this.y = 0;
        this.sizeX = 200;
        this.sizeY = 300;

        this.currentVelocityX = 0;
        this.currentVelocityY = 0;
        this.currentSizeX = 0;
        this.currentSizeY = 0;

        this.friction = 1.15
        this.returnForce = 1
    }
    getX() {
        return this.x
    }
    getY() {
        return this.y
    }
    getSizeX() {
        return this.sizeX
    }
    getSizeY() {
        return this.sizeY
    }
    getAnimation() {
        return {
            subject: this,
            animation: function (able) {
                var changeX = (this.subject.getX() + this.subject.currentVelocityX)
                var changeY = (this.subject.getY() + this.subject.currentVelocityY)
                var outX = changeX + this.subject.getSizeX() > innerWidth
                var outY = changeY + this.subject.getSizeY() > innerHeight
                var outmX = changeX < 0
                var outmY = changeY < 0

                if (Math.abs(this.subject.currentVelocityX) >= 0.00001 || Math.abs(this.subject.currentVelocityY) >= 0.00001 || able || outX || outY || outmX || outmY) {
                    if (outX) {
                        this.subject.currentVelocityX += (((innerWidth - this.subject.getSizeX()) - this.subject.getX()) - this.subject.currentVelocityX) / (60 / this.subject.returnForce)
                    } else if (outmX) {
                        this.subject.currentVelocityX += ((-this.subject.getX()) - this.subject.currentVelocityX) / (60 / this.subject.returnForce)
                    }
                    if (outY) {
                        this.subject.currentVelocityY += (((innerHeight - this.subject.getSizeY()) - this.subject.getY()) - this.subject.currentVelocityY) / (60 / this.subject.returnForce)
                    } else if (outmY) {
                        this.subject.currentVelocityY += ((-this.subject.getY()) - this.subject.currentVelocityY) / (60 / this.subject.returnForce)
                    }
                    this.subject.currentVelocityX /= this.subject.friction
                    this.subject.currentVelocityY /= this.subject.friction

                    this.subject.setPos(changeX, changeY)
                    return 1
                } else {
                    target = null
                    return 0
                }
            }
        }
    }
    setVelocity(x, y) {
        this.currentVelocityX = x
        this.currentVelocityY = y
    }
    setSize(x, y) {
        this.sizeX = x <= 200 ? 200 : x
        this.sizeY = y <= 300 ? 300 : y
        this.updateRender()
    }
    setProp(prop) {
        this.prop = prop
        this.prop.controller = this
        this.chat = this.prop.children[1]
        this.input = this.prop.children[2].children[0]
    }
    setChatEvent(chatEvent) {
        this.input.addEventListener("keydown",e => {
            if (e.keyCode == 13) {
                chatEvent(this._id,this.input.value)
                this.input.value = null
            }
        })
    }
    setLeaveEvent(chatEvent){
        this.leave = chatEvent
    }
    setPos(x, y) {
        this.x = x
        this.y = y
        this.updateRender()
    }
    updateRender() {
        this.prop.style.top = `${this.y}px`
        this.prop.style.left = `${this.x}px`
        this.prop.style.width = `${this.sizeX}px`
        this.prop.style.height = `${this.sizeY}px`
    }
    leaveRoom(){
        this.leave(this._id)
        this.prop.parentElement.removeChild(this.prop)
        delete this
    }
    writeMessage(msg) {
        var div = document.createElement("div")
        div.classList.add("chatBox__content__message")
        div.innerText = msg
        this.chat.appendChild(div)
        if (this.chat.childElementCount > 40) this.chat.removeChild(this.chat.children[0])
        this.chat.scrollTo(0, this.chat.scrollHeight)
    }
}