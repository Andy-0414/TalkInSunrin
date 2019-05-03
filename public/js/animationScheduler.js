class AnimationScheduler {
    constructor() {
        this.rate = 1000 / 60
        this.scheduler = null
        this.workList = []
        this.isAble = false
    }
    onAble(){
        this.isAble = true
    }
    onDisable(){
        this.isAble = false
    }
    addAnimation(chat) {
        if (this.workList.findIndex(x => x.subject.prop == chat.prop) == -1)
            this.workList.push(chat.getAnimation())
    }
    start() {
        this.scheduler = setInterval(() => {
            this.workList = this.workList.filter(x => {
                return x.animation(this.isAble) ? x.animation : false
            })
        }, this.rate)
    }
}