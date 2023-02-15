const mongoose = require('mongoose');

// There are also schemas here
const todoTaskSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
})

// It's cool that mongoose has a model function that can be used
// to create then export this out as a module
module.exports = mongoose.model('TodoTask', todoTaskSchema);