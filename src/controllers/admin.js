const fs = require('fs');
const Blog = require('../models/Blog');
const Category = require('../models/Category');
const cloudinary = require('../config/cloudinary.js')
const convertToEmbed = require('../utils/linkToEmbed.js');

const handleGetAllBlogs = async (req, res) => {
    try {

        const blogs = await Blog.find().populate('category').populate('author');

        const data = {
            user: req.user,
            blogs,
            active: 'allBlogs'
        }

        res.render("pages/admin/allBlogs", { ...data });
    } catch (error) {
        console.error('Error fetching blogs:', error);
        req.session.alert = {
            type: "danger",
            message: "Something went wrong while fetching blogs"
        };
        return res.redirect("/admin/allBlogs");
    }
}

const handleGetAddNewBlog = async (req, res) => {
    const categories = await Category.find();
    const alert = req.session.alert;
    delete req.session.alert;

    const data = {
        user: req.user,
        categories,
        active: 'addNewBlog',
        alert
    }
    res.render("pages/admin/addNewBlog", { ...data });
}

const handlePostAddNewBlog = async (req, res) => {
    const { title, category, description, video } = req.body;

    try {
        const data = {
            title,
            description,
            category,
            slug: title.toLowerCase().replace(/ /g, "-"),
            author: req.user?._id,
        };

        if (video) {
            data.video = convertToEmbed(video);
        }

        // Upload image to Cloudinary if a file is uploaded
        if (req.file) {
            const uploadResult = await cloudinary.uploader.upload(req.file.path, {
                folder: 'blog_thumbnails', // Folder in Cloudinary
                public_id: `thumbnail_${Date.now()}` // Unique identifier
            });

            data.photo = {
                id: uploadResult.public_id,
                url: uploadResult.secure_url
            }
        }

        const blog = new Blog(data);
        await blog.save();
        req.session.alert = {
            type: "success",
            text: "Blog added successfully"
        };

    } catch (error) {
        console.error('Error processing blog:', error);
        req.session.alert = {
            type: "danger",
            text: "Something went wrong"
        };
    } finally {
        if (req.file) {
            fs.unlinkSync(req.file.path);
        }
    }
    res.redirect("/admin/addNewBlog");
}

const handleGetAllCategories = async (req, res) => {
    const categories = await Category.find();
    const alert = req.session.alert;
    delete req.session.alert;

    const data = {
        user: req.user,
        categories,
        active: 'allCategories',
        alert
    }
    res.render("pages/admin/allCategories", { ...data });
}

const handleGetAddNewCategory = async (req, res) => {
    const alert = req.session.alert;
    delete req.session.alert;

    const data = {
        user: req.user,
        active: 'addNewCategory',
        alert
    }
    res.render("pages/admin/addNewCategory", { ...data });
}

const handlePostAddNewCategory = async (req, res) => {
    const { name } = req.body;
    try {
        // Check if category already exists (case-insensitive)
        const isCategoryExist = await Category.findOne({ name: { $regex: new RegExp(`^${name}$`, 'i') } });

        // If category already exists, show error message
        if (isCategoryExist) {
            req.session.alert = {
                type: "danger",
                text: "Category already exists"
            };
        }
        // If category doesn't exist, add/update category
        else {
            const newCategory = new Category({ name });
            await newCategory.save();
            req.session.alert = {
                type: "success",
                text: "Category added successfully"
            };
        }
    } catch (error) {
        console.error('Error processing category:', error);
        req.session.alert = {
            type: "danger",
            text: "Something went wrong"
        };
    }
    res.redirect("/admin/addNewCategory");
}

const handleGetDeleteBlog = async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);
        if (!blog) {
            req.session.alert = {
                type: "danger",
                text: "Blog not found"
            };
            return res.redirect("/admin-panel");
        }

        if (blog.photo.id) {
            await cloudinary.uploader.destroy(blog.photo.id);
        }

        await Blog.findByIdAndDelete(req.params.id);

        req.session.alert = {
            type: "success",
            text: "Blog deleted successfully"
        };
    } catch (error) {
        console.error('Error deleting blog:', error);
        req.session.alert = {
            type: "danger",
            text: "Something went wrong"
        };
    }
    res.redirect("/admin/allBlogs");
}

const handleGetDeleteCategory = async (req, res) => {
    const id = req.params.id;
    try {
        await Category.findByIdAndDelete(id);
        await Blog.updateMany({ "category.id": id }, { "category.name": "unknown" });
        req.session.alert = {
            type: "success",
            text: "Category deleted successfully"
        };
    } catch (error) {
        console.error('Error deleting category:', error);
        req.session.alert = {
            type: "danger",
            text: "Something went wrong"
        };
    }
    res.redirect("/admin/allCategories");
}

const handleGetEditBlog = async (req, res) => {
    const id = req.params.id;
    try {
        const blog = await Blog.findById(id).populate('category');
        const categories = await Category.find();

        if (!blog) {
            req.session.alert = {
                type: "danger",
                text: "Blog not found"
            };
            return res.redirect("/admin/allBlogs");
        }

        const alert = req.session.alert;
        delete req.session.alert;

        const data = {
            user: req.user,
            blog,
            active: 'editBlog',
            alert,
            categories,
        }

        // res.json(data)
        res.render("pages/admin/editBlog", { ...data });
    }
    catch (error) {
        console.error('Error fetching blog:', error);
        req.session.alert = {
            type: "danger",
            text: "Something went wrong"
        };
        res.redirect("/admin/allBlogs");
    }
}

const handlePostEditBlog = async (req, res) => {
    const {title, category, description, video} = req.body;
    const id = req.params.id;
    try {
        const blog = await Blog.findById(id);

        if (!blog) {
            req.session.alert = {
            type: "danger",
            text: "Blog not found"
            };
            return res.redirect("/admin/allBlogs");
        }

        blog.title = title;
        blog.categoryId = category;
        blog.description = description;
        blog.slug = title.toLowerCase().replace(/ /g, "-");

        if (video) {
            blog.video = convertToEmbed(video);
        }

        if (req.file) {
            if (blog.photo.id) {
            await cloudinary.uploader.destroy(blog.photo.id);
            }

            const uploadResult = await cloudinary.uploader.upload(req.file.path, {
            folder: 'blog_thumbnails',
            public_id: `thumbnail_${Date.now()}`
            });

            blog.photo = {
            id: uploadResult.public_id,
            url: uploadResult.secure_url
            };

            fs.unlinkSync(req.file.path);
        }

        await blog.save();
        req.session.alert = {
            type: "success",
            text: "Blog updated successfully"
        };
        } catch (error) {
        console.error('Error updating blog:', error);
        req.session.alert = {
            type: "danger",
            text: "Something went wrong"
        };
        }
        res.redirect("/admin/allBlogs");
}

const handleGetEditCategory = async (req, res) => {
    const id = req.params.id;
    try {
        const category = await Category.findById(id);
        if (!category) {
            req.session.alert = {
                type: "danger",
                text: "Category not found"
            };
            return res.redirect("/admin/allCategories");
        }

        const alert = req.session.alert;
        delete req.session.alert;

        const data = {
            user: req.user,
            category,
            active: 'editCategory',
            alert
        }

        res.render("pages/admin/editCategory", { ...data });
    } catch (error) {
        console.error('Error fetching category:', error);
        req.session.alert = {
            type: "danger",
            text: "Something went wrong"
        };
        res.redirect("/admin/allCategories");
    }
}
const handlePostEditCategory = async (req, res) => {
    const { name } = req.body;
    const id = req.params.id;
    try {
        const category = await Category.findById(id);
        if (!category) {
            req.session.alert = {
                type: "danger",
                text: "Category not found"
            };
            return res.redirect("/admin/allCategories");
        }

        category.name = name;
        await category.save();
        req.session.alert = {
            type: "success",
            text: "Category updated successfully"
        };
    } catch (error) {
        console.error('Error updating category:', error);
        req.session.alert = {
            type: "danger",
            text: "Something went wrong"
        };
    }
    res.redirect("/admin/allCategories");
}


module.exports = {
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
};
