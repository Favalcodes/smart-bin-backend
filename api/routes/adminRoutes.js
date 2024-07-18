const express = require('express')
const { registerAdmin, loginAdmin, updatePassword, getAllUsers, getAllSchedules } = require('../services/AdminService')
const validateToken = require('../middleware/validateToken')
const router = express.Router()

router.post('/register', registerAdmin)
router.post('/login', loginAdmin)
router.post('/update-password', validateToken, updatePassword)
router.get('/users', validateToken, getAllUsers)
router.get("/schedules", validateToken, getAllSchedules);

module.exports = router