const express = require('express')
const { createMenu, createMenuCategory, createSubcategory, getMenuById, getMenuBySubcategory, getMenuCategories, getSubcategories } = require('../services/MenuService')
const router = express.Router()

router.post('create-menu', createMenu)
router.post('create-category', createMenuCategory)
router.post('create-subcategory', createSubcategory)
router.get('get-menu', getMenuById)
router.get('get-subcategory-menu', getMenuBySubcategory)
router.get('get-categories', getMenuCategories)
router.get('get-subcategories', getSubcategories)

module.exports = router