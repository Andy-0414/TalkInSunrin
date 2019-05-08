var username = localStorage.getItem("TIS_username")
if (username) {
    document.getElementsByClassName("main__text__content__name")[0].value = username
}
var start = document.getElementsByClassName("main__text__content__button")[0]
start.addEventListener("click", e => {
    var name = document.getElementsByClassName("main__text__content__name")[0]
    if (name.value) {
        axios.post('/checkName', {
                name: name.value
            })
            .then(data => {
                if (data.data.isAvailable) {
                    localStorage.setItem("TIS_username", name.value)
                    document.location.href = "/chat_iframe"
                } else {
                    name.style.borderBottom = "1px solid #FF6666"
                }
            })
    } else {
        name.style.borderBottom = "1px solid #FF6666"
    }
})