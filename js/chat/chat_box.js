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
                if (this.subject.currentVelocityX >= 0.0001 || this.subject.currentVelocityY >= 0.0001 || able) {
                    var changeX = (this.subject.getX() + this.subject.currentVelocityX)
                    var changeY = (this.subject.getY() + this.subject.currentVelocityY)

                    if (changeX + this.subject.getSizeX() > innerWidth) {
                        this.subject.currentVelocityX += (((innerWidth - this.subject.getSizeX()) - this.subject.getX()) - this.subject.currentVelocityX) / (60 / this.subject.returnForce)
                    } else if (changeX < 0) {
                        this.subject.currentVelocityX += ((-this.subject.getX()) - this.subject.currentVelocityX) / (60 / this.subject.returnForce)
                    }

                    if (changeY + this.subject.getSizeY() > innerHeight) {
                        this.subject.currentVelocityY += (((innerHeight - this.subject.getSizeY()) - this.subject.getY()) - this.subject.currentVelocityY) / (60 / this.subject.returnForce)
                    } else if (changeY < 0) {
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