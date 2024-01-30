const express = require('express');
const router = express.Router();
const listCategory = require('../controllers/Category/ListCategory');
const createCategory = require('../controllers/Category/CreateCategory');
const updateCategory = require('../controllers/Category/UpdateCategory');
const deleteCategory = require('../controllers/Category/DeleteCategory');

router.get("/ListCategories", listCategory.handleListCategory);

router.post("/CreateCategory", createCategory.handleCreateCategory);

router.put("/UpdateCategory", updateCategory.handleUpdateCategory);

router.delete("/DeleteCategory", deleteCategory.handleDeleteCategory);

module.exports = router;