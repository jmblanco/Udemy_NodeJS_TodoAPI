var mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
    email: {
        type: String,
        required: true,
        minLength: 1,
        trim: true
    }
});

var User = mongoose.model('User', UserSchema);

module.exports = {
    User
};