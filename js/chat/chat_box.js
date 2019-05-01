class ChatBox {
    constructor(prop) {
        this.prop = prop;
        if (prop)
            this.prop.controller = this
        this.x = 0;
        this.y = 0;
        this.sizeX = 200;
        this.sizeY = 300;

        this.currentVelocityX = 0;
        this.currentVelocityY = 0;
        this.currentSizeX = 0;
        this.currentSizeY = 0;
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
            animation: () => {
                if ((Math.abs(currentVelocityX) >= 0.0001 || Math.abs(currentVelocityY) >= 0.0001 || isClick == 2) && !resizeTarget) {
                    var changeX = (this.subject.getX() + this.subject.currentVelocityX)
                    var changeY = (this.subject.getY() + this.subject.currentVelocityY)

                    if (changeX + this.subject.getSizeX() > innerWidth) {
                        currentVelocityX += (((innerWidth - this.subject.getSizeX()) - this.subject.getX()) - this.subject.currentVelocityX) / 60
                    } else if (changeX < 0) {
                        currentVelocityX += ((-this.subject.getX()) - currentVelocityX) / 60
                    }

                    if (changeY + this.subject.getSizeY() > innerHeight) {
                        this.subject.currentVelocityY += (((innerHeight - this.subject.getSizeY()) - this.subject.getY()) - this.subject.currentVelocityY) / 60
                    } else if (changeY < 0) {
                        this.subject.currentVelocityY += ((-this.subject.getY()) - currentVelocityY) / 60
                    }
                    this.subject.currentVelocityX /= 1.15
                    this.subject.currentVelocityY /= 1.15

                    this.subject.setPos(changeX, changeY)
                } else {
                    target = null
                    clearInterval(this)
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
}