const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    slug: {
        type: String,
        required: true,
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    photo: {
        id : {
            type: String,
        }, 
        url : {
            type: String,
            default: '/assets/default.png',
        }
    },
    date: {
        type: Date,
        default: Date.now,
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    video: {
        type: String,
        default: null,
    },
});

const Blog = mongoose.model('Blog', blogSchema);

module.exports = Blog;