'use strict'

/*
 *
 * REQUIRES
 *
 */

var mongoose = require('mongoose'),
  rfr = require('rfr'),
  passwordHelper = rfr('server/helpers/password.js'),
  Schema = mongoose.Schema,
  _ = require('lodash');

/*
 * 
 * Creating UserSchema for MongoDB
 *
 */

var UserSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
    select: false
  },
  name: {
    type: String,
    required: true
  },
  passwordSalt: {
    type: String,
    required: true,
    select: false
  },
  saved_houses: [{
    mlsId: {
      type: String
    },
    addressFull: {
      type: String
    },
    bedrooms: {
      type: Number
    },
    photo: {
      type: String
    },
    listPrice: {
      type: Number
    },
    bathrooms: {
      type: Number
    },
    sqft: {
      type: Number
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  saved_searches: [{
    search_name: {
      type: String
    },
    filters: {
      type: [Schema.Types.Mixed]
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  active: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

/**
 * Find a user by it's email and checks the password againts the stored hash
 *
 * @param {String} email
 * @param {String} password
 * @param {Function} callback
 */

UserSchema.statics.authenticate = function (email, password, callback) {
  this.findOne({
    email: email
  }).select('+password +passwordSalt').exec(function (err, user) {
    if (err) {
      return callback(err, null);
    }

    // no user found just return the empty user
    if (!user) {
      return callback(err, user);
    }

    // verify the password with the existing hash from the user
    passwordHelper.verify(password, user.password, user.passwordSalt, function (err, result) {
      if (err) {
        return callback(err, null);
      }

      // if password does not match don't return user
      if (result === false) {
        return callback(err, null);
      }

      // remove password and salt from the result
      user.password = undefined;
      user.passwordSalt = undefined;
      // return user if everything is ok
      callback(err, user);
    });
  });
};

/**
 * Find a user by it's email and checks the password againts the stored hash
 *
 * @param {String} oldPassword
 * @param {String} newPassword
 * @param {Function} callback
 */

UserSchema.methods.changePassword = function (oldPassword, newPassword, callback) {
  var self = this;

  // get the user from db with password and salt
  self.model('User').findById(self.id).select('+password +passwordSalt').exec(function (err, user) {
    if (err) {
      return callback(err, null);
    }

    // no user found just return the empty user
    if (!user) {
      return callback(err, user);
    }

    passwordHelper.verify(oldPassword, user.password, user.passwordSalt, function (err, result) {
      if (err) {
        return callback(err, null);
      }

      // if password does not match don't return user
      if (result === false) {
        var PassNoMatchError = new Error('Old password does not match.');
        PassNoMatchError.type = 'old_password_does_not_match';
        return callback(PassNoMatchError, null);
      }

      // generate the new password and save the changes
      passwordHelper.hash(newPassword, function (err, hashedPassword, salt) {
        self.password = hashedPassword;
        self.passwordSalt = salt;

        self.save(function (err, saved) {
          if (err) {
            return callback(err, null);
          }

          if (callback) {
            return callback(err, {
              success: true,
              message: 'Password changed successfully.',
              type: 'password_change_success'
            });
          }
        });
      });
    });
  });
};

/**
 * Create a new user with the specified properties
 *
 * @param {Object} opts - user data
 * @param {Function} callback
 */

UserSchema.statics.register = function (opts, callback) {
  var self = this;
  var data = _.cloneDeep(opts);

  //hash the password
  passwordHelper.hash(opts.password, function (err, hashedPassword, salt) {
    if (err) {
      return callback(err);
    }

    data.password = hashedPassword;
    data.passwordSalt = salt;

    //create the user
    self.model('User').create(data, function (err, user) {
      if (err) {
        return callback(err, null);
      }

      // remove password and salt from the result
      user.password = undefined;
      user.passwordSalt = undefined;
      // return user if everything is ok
      callback(err, user);
    });
  });
};

// compile User model
module.exports = mongoose.model('User', UserSchema);