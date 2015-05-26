var mongoose = require('mongoose');
var bcrypt = require('bcrypt');

// Setting up schema for database for info that each user will have
var userSchema = mongoose.Schema({
    name: String,
    userName: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    location: String,
    favoriteLocations: [String]
});

userSchema.pre('save', function (next) {
    // First, check if password has been modified
    if(!this.isModified('password')) return next();

    // Store acces to 'this', which represents the current user document
    var user = this;

    // Generate encryption salt
    bcrypt.genSalt(10, function (err, salt) {

        // If there was an error, allow execution to move to next middleware
        if(err) return next(err);

        // if successful, use the salt to run the encryption on the given password
        bcrypt.hash(user.password, salt, function (err, hash) {

            // If encryption succeeded, then replace un-encrypted password in given document with newly encrypted one
            user.password = hash;

            // Allow execution to move to next middleware
            return next();
        });
    });
});

userSchema.methods.comparePassword = function (candidatePassword, next) {
    // use bcrypt to compare the unencrypted value to the encrypted one in the DB
    bcrypt.compare(candidatePassword, this.password, function (err, isMatch) {
        // if there was an error, allow execution to move to the next middleware
        if(err) return next(err);

        // if no error, move on to next middleware and inform if of the match status (true or false)
        return next(null, isMatch);
    });
};

// user model
var User = mongoose.model('user', userSchema);

module.exports = User;


