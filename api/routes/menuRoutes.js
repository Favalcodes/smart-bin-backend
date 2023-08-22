const express = require('express')
const { createMenu, createMenuCategory, createSubcategory, getMenuById, getMenuBySubcategory, getMenuCategories, getSubcategories } = require('../services/MenuService')
const validateToken = require('../middleware/validateToken')
const router = express.Router()

router.post('/create-menu', validateToken, createMenu)
router.post('/create-category', validateToken, createMenuCategory)
router.post('/create-subcategory', validateToken, createSubcategory)
router.get('/get-menu', validateToken, getMenuById)
router.get('/get-subcategory-menu', validateToken, getMenuBySubcategory)
router.get('/get-categories', validateToken, getMenuCategories)
router.get('/get-subcategories', validateToken, getSubcategories)

module.exports = router