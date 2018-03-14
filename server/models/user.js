const mongoose = require('mongoose');
const Schema = mongoose.Schema;

module.exports = mongoose.model('User', new Schema({ 
    email: String, 
    password: String, 
    role: Number // 1 admin, 1 addpro, 1 viewer 
}));