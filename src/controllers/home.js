const Blog = require('../models/Blog');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

const handleGetHome = async (req, res) => {
    try {
        const blogs = await Blog.find().populate('category').populate('author').sort({ date: 'desc' });
        const data = {
            user: req.user,
            blogs: blogs,
            active: 'home'
        }
        res.render("pages/home", { ...data });
    } catch (error) {
        console.error(error);
        res.status(500).send("Server Error");
    }
}

const handleGetBlog = async (req, res) => {
    try {
        
        const blog = await Blog.findById(req.params.id).populate('category').populate('author');
        if (!blog) {
            return res.redirect("/");
        }

        if (blog.slug !== req.params.slug) {
            return res.redirect(`/blog/${req.params.id}/${blog.slug}`);
        }

        const data = {
            user: req.user,
            blog,
            active: 'blog'
        }

        res.render("pages/home/blog", { ...data });
    } catch (error) {
        console.error(error);
        res.status(500).send("Server Error");
    }
}

module.exports = {
    handleGetHome,
    handleGetBlog
};