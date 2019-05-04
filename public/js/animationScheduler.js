class AnimationScheduler {
    constructor() {
        this.rate = 1000 / 60
        this.scheduler = null
        this.workList = []
        this.isAble = false
    }
    onAble() {
        this.isAble = true
        if (!this.scheduler) this.start()
    }
    onDisable() {
        this.isAble = false
    }
    addAnimation(chat) {
        if (this.workList.findIndex(x => x.subject.prop == chat.prop) == -1)
            this.workList.push(chat.getAnimation())
        if (!this.scheduler) this.start()        
    }
    start() {
        this.scheduler = setInterval(() => {
            var idx = this.workList.findIndex(x => {
                return !x.animation(this.isAble)
            })
            if(idx != -1){
                this.workList.splice(idx,1)
            }
            if (!this.workList.length) {
                clearInterval(this.scheduler)
                this.scheduler = null
            }
        }, this.rate)
    }
}