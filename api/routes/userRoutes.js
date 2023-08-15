const express = require('express')
const { registerUser, onboardUser, verifyOtp, loginUser, sendVerificationCode, updatePassword } = require('../services/UserService')
const validateToken = require('../middleware/validateToken')
const router = express.Router()

router.post('/register', registerUser)
router.post('/onboard-user', onboardUser)
router.post('/verify-otp', verifyOtp)
router.post('/login', loginUser)
router.post('/send-otp', validateToken, sendVerificationCode)
router.post('/update-password', validateToken, updatePassword)

module.exports = router