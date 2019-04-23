class ChatBox{
    constructor(prop){
        this.prop = prop;
        if(prop)
            this.prop.controller = this
        this.x = 0;
        this.y = 0;
    }
    getX(){
        return this.x
    }
    getY(){
        return this.y
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
    }
}