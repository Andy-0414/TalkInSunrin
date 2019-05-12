const express = require('express');
const router = express.Router();
const passportLoginAuth = require('../modules/passport-login-auth')()
router.get('/getUser', (req, res) => {
    if (req.user) {
        res.send(req.user)
    } else {
        res.send(null)
    }
})

router.get('/nvaer', passportLoginAuth.authenticate("naver"))
router.get('/naver/callback', passportLoginAuth.authenticate("naver"))
router.get('/github', passportLoginAuth.authenticate("github"))
router.get('/github/callback', passportLoginAuth.authenticate("github"))

module.exports = router