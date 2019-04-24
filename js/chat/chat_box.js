class ChatBox{
    constructor(prop){
        this.prop = prop;
        if(prop)
            this.prop.controller = this
        this.x = 0;
        this.y = 0;
        this.sizeX = 200;
        this.sizeY = 300;
    }
    getX(){
        return this.x
    }
    getY(){
        return this.y
    }
    getSizeX(){
        return this.sizeX
    }
    getSizeY(){
        return this.sizeY
    }
    setSize(x,y){
        this.sizeX = x <= 200 ? 200 : x
        this.sizeY = y <= 300 ? 300 : y
        this.updateRender()
    }
    setProp(prop){
        this.prop = prop
        this.prop.controller = this
    }
    setPos(x,y){
        this.x = x
        this.y = y
        this.updateRender()
    }
    updateRender(){
        this.prop.style.top = `${this.y}px`
        this.prop.style.left = `${this.x}px`
        this.prop.style.width = `${this.sizeX}px`
        this.prop.style.height = `${this.sizeY}px`
    }
}