const express = require('express');
const router = express.Router();

const { upload } = require('../config/multer');

const {
    handleGetAllBlogs,
    handleGetAddNewBlog,
    handlePostAddNewBlog,
    handleGetDeleteBlog,
    handleGetAllCategories,
    handleGetAddNewCategory,
    handlePostAddNewCategory,
    handleGetDeleteCategory,
    handleGetEditBlog,
    handlePostEditBlog,
    handleGetEditCategory,
    handlePostEditCategory
} = require('../controllers/admin');

router.get("/allBLogs", handleGetAllBlogs);
router.get("/addNewBlog", handleGetAddNewBlog);
router.get("/allCategories", handleGetAllCategories);
router.get("/addNewCategory", handleGetAddNewCategory);

router.post("/addNewBlog", upload.single('image'), handlePostAddNewBlog);
router.post("/addNewCategory", handlePostAddNewCategory);

router.get("/edit-blog/:id", handleGetEditBlog);
router.post("/edit-blog/:id", upload.single('image'), handlePostEditBlog);

router.get("/edit-category/:id", handleGetEditCategory);
router.post("/edit-category/:id", handlePostEditCategory);

router.get("/delete-blog/:id", handleGetDeleteBlog);
router.get("/delete-category/:id", handleGetDeleteCategory);

module.exports = router;