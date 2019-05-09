const express = require('express');
const router = express.Router();

const sendRule = require('../modules/send-rule')
const passportJwtAuth = require('../modules/passport-jwt-auth')()
const loginSystem = require('../modules/login-system')

router.post('/register', loginSystem.registerValidation()) // Create

router.post('/login', loginSystem.loginValidation()) // Read
router.post('/profile', passportJwtAuth.authenticate(), (req, res) => { // Read
    res.setHeader('Authorization', loginSystem.createToken(req.user))
    sendRule.sendOK(res, req.user)
})

router.post('/changeProfile', passportJwtAuth.authenticate(), loginSystem.changeProfile()) // Update
router.post('/changePassword', passportJwtAuth.authenticate(), loginSystem.changePassword()) // Update

router.post('/removeAccount', passportJwtAuth.authenticate(), loginSystem.removeAccount()) // Delete

module.exports = router;