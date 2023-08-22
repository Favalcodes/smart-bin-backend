const asyncHandler = require("express-async-handler");
const adminModel = require("../models/Admin");
const menuCategoryModel = require("../models/MenuCategory");
const restaurantModel = require("../models/Restaurant");
const menuSubcategoryModel = require("../models/MenuSubCategory");
const menuModel = require("../models/Menu");

const createMenuCategory = asyncHandler(async (req, res) => {
  const { name } = req.body;
  if (!name) {
    res.status(400);
    throw new Error("Name is required");
  }
  const id = req.admin._id;
  if (!id) {
    res.status(401);
    throw new Error("Unauthorized");
  }
  const admin = await adminModel.findById(id);
  if (!admin) {
    res.status(404);
    throw new Error("Admin does not exist");
  }
  const category = await menuCategoryModel.create({ name });
  res
    .status(200)
    .json({ success: true, message: "Category created", category });
});

const getMenuCategories = asyncHandler(async (req, res) => {
  const categories = await menuCategoryModel.find({ isDeleted: false });
  res
    .status(200)
    .json({ success: true, message: "Categories retrieved", categories });
});

const createSubcategory = asyncHandler(async (req, res) => {
  const { name, categoryId } = req.body;
  if (!name || !categoryId) {
    res.status(400);
    throw new Error("Please fill all details, Name, and category is required");
  }
  const id = req.restaurant._id;
  if (!id) {
    res.status(403);
    throw new Error("Unauthorized");
  }
  const restaurant = await restaurantModel.findById(id);
  if (!restaurant) {
    res.status(404);
    throw new Error("Restaurant does not exist");
  }
  const category = await menuSubcategoryModel.create({
    name,
    category: categoryId,
    restaurant: id,
  });
  res
    .status(200)
    .json({ success: true, message: "Subcategory created", category });
});

const getSubcategories = asyncHandler(async (req, res) => {
  const { categoryId } = req.body;
  let categories
  if (!categoryId) {
    categories = await menuSubcategoryModel.find({
      isDeleted: false,
      restaurant: req.restaurant._id,
    });
  } else {
    categories = await menuSubcategoryModel.find({
      isDeleted: false,
      restaurant: req.restaurant._id,
      category: categoryId,
    });
  }
  const subCategories = categories.map(async (item) => {
    const menu = await menuModel.find({ subCategory: item.id });
    return {
      ...item,
      menu,
    };
  });
  res
    .status(200)
    .json({ success: true, message: "Subcategories retrieved", subCategories });
});

const createMenu = asyncHandler(async (req, res) => {
  const { name, price, subCategoryId } = req.body;
  if (!name || !subCategoryId || !price) {
    res.status(400);
    throw new Error(
      "Please fill all details, Name, subcategory and price is required"
    );
  }
  const id = req.restaurant.id;
  const restaurant = await restaurantModel.findById(id);
  if (!restaurant) {
    res.status(404);
    throw new Error("Restaurant does not exist");
  }
  const menu = await menuModel.create({
    name,
    price,
    subCategory: subCategoryId,
    restaurant: id,
  });
  res.status(200).json({ success: true, message: "Menu created", menu });
});

const getMenuBySubcategory = asyncHandler(async (req, res) => {
  const subCategoryId = req.params.id;
  const subcategory = await menuSubcategoryModel.findById(subCategoryId);
  if (!subcategory) {
    res.status(404);
    throw new Error("Subcategory does not exist");
  }
  const menu = await menuModel.find({
    isDeleted: false,
    restaurant: id,
    subCategory: subCategoryId,
  });
  res.status(200).json({ success: true, message: "Menu retrieved", menu });
});

const getMenuById = asyncHandler(async (req, res) => {
  const menuId = req.params.id;
  const menu = await menuModel.findById(menuId);
  if (!menu) {
    res.status(404);
    throw new Error("Menu does not exist");
  }
  res.status(200).json({ success: true, message: "Menu retrieved", menu });
});

module.exports = {
  createMenu,
  createMenuCategory,
  createSubcategory,
  getMenuById,
  getMenuBySubcategory,
  getMenuCategories,
  getSubcategories,
};
