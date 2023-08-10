const express = require('express')
const { registerUser, onboardUser, verifyOtp, loginUser, sendVerificationCode, updatePassword } = require('../services/UserService')
const router = express.Router()

router.post('register', registerUser)
router.post('onboard-user', onboardUser)
router.post('verify-otp', verifyOtp)
router.post('login', loginUser)
router.post('send-otp', sendVerificationCode)
router.post('update-password', updatePassword)

module.exports = router