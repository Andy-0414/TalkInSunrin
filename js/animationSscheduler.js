class AnimationScheduler{
    constructor(){
        this.rate = 1000/60
        this.scheduler = null
        this.workList = []
    }
    setAnimation(chatList){
        [...chatList].forEach(x=>{
            workList.push(x.getAnimation())
        })
    }
    start(){
        this.scheduler = setInterval(()=>{
        },this.rate)
    }
}