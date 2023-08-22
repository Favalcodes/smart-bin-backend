const express = require('express')
const { registerAdmin, loginAdmin, updatePassword } = require('../services/AdminService')
const router = express.Router()

router.post('/register', registerAdmin)
router.post('/login', loginAdmin)
router.post('/update-password', updatePassword)

module.exports = router