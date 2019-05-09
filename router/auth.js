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
router.get('/github', passportLoginAuth.authenticate())
router.get('/github/callback', passportLoginAuth.authenticate())

module.exports = router