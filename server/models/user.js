const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({ 
  email: { 
    type: String, 
    require: [true, 'Email is required.'],
    unique: true
  }, 
  password: String, 
  role: { type: Number, require: [true, 'Role is not defined'] },  // 1 admin, 1 addpro, 1 viewer
  created: { type: Date, default: Date.now } 
});
module.exports = mongoose.model('User', UserSchema);