const mongoose = require('mongoose');

const connectToMongoDB = async (uri) => {
    try {
        await mongoose.connect(uri)
        console.log('Connected to MongoDB');
    } catch (err) {
        console.error('Error connecting to MongoDB', err);
    }
}

module.exports = connectToMongoDB;