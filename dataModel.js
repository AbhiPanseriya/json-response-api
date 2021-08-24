const mongoose = require('mongoose');

const dataSchema = mongoose.Schema({
    title: {
        type: String,
        require: true
    },
    data: {
        type: Object,
        require: true
    },
    user: {
        type: {
            name: String,
            email: String
        },
        require: true
    },
    description: {
        type: String,
        require: false
    },
    createdAt: {
        type: Date,
        require: true,
        default: new Date()
    }
});

module.exports = mongoose.model('Data', dataSchema);