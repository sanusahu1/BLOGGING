const mongoose = require('mongoose');

var blogSchema = new mongoose.Schema({
    titel: {
        type: String,
        required: true,
    },
    body: {
        type: String,
        required: true,
    },
    coverImageURL: {
        type: String,
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
    }
}, { timestamps: true });

//Export the model
module.exports = mongoose.model('blog', blogSchema);