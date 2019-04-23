class ChatBox{
    constructor(prop){
        this.prop = prop;
        this.x = 0;
        this.y = 0;
    }
    setProp(prop){
        this.prop = prop
    }
    setPos(x,y){
        this.x = x
        this.y = y
        this.updateRender()
    }
    updateRender(){
        prop.style.top = `${this.y}px`
        prop.style.left = `${this.x}px`
    }
}