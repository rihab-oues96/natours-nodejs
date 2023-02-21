const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'user must have a name'],
  },

  email: {
    type: String,
    required: [true, 'user must have an email'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'email must be valid'],
  },

  photo: {
    type: String,
  },

  password: {
    type: String,
    required: [true, 'user must provide password'],
    minLength: 8,
    select: false, // hide password and never show to client
  },

  passwordConfirm: {
    type: String,
    required: [true, 'user must confirm password'],
    validate: {
      // this only works on create and save !
      validator: function (el) {
        return el === this.password;
      },
      message: 'passwords are not the same !',
    },
  },

  passwordChangedAt: {
    type: Date,
  },
});

// hashing / increpting password
userSchema.pre('save', async function (next) {
  // only eun this function if password was actually modified
  if (!this.isModified('password')) return next();

  //hash the password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);

  //delete passwordConfirm field
  this.passwordConfirm = undefined;
  next();
});

// check if password matches
userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimesTamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    return JWTTimestamp < changedTimesTamp; // 100 < 200
  }

  // false means not changed
  return false;
};

const User = mongoose.model('User', userSchema);
module.exports = User;
