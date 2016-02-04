(function () {
  var config = require('./settings');
  var bcrypt = require('bcrypt-nodejs');
  var MongoClient = require('mongodb').MongoClient;

  var usersCollection = config.db.collections.users;
  var mongoUri = config.db.mongoUri;

  module.exports = {
    executeDbQuery: executeDbQuery,
    findUserById: findUserById,
    findUserByName: findUserByName,
    insertUser: insertUser
  };

  var executeDbQuery = function (query, params, callback) {
    MongoClient.connect(mongoUri, function (err, db) {
      if (err) { return console.dir(err); }
      query(db, params, function (err, result) {
        db.close();
        callback(err, result);
      });
    });
  };

  var findUserById = function (db, params, callback) {
    var data = db.collection(usersCollection).find({ "id": params.id });

    if (data.length !== 1) {
      callback('No such user with id = ' + params.id);
    }

    callback(null, data[0]);
  };

  var findUserByName = function (db, params, callback) {
    var data = db.collection(usersCollection).find({ "username": params.username });

    if (data.length !== 1) {
      callback('No such user with username = ' + params.username);
    }

    callback(null, data[0]);
  };

  var insertUser = function (db, newUser, callback) {
    newUser.password = bcrypt.hashSync(newUser.password, null, null);
    db.collection(usersCollection).insert(newUser, { w: 1 }, function (err, result) {

      if (!err) {
        callback(null, result);
      }

      callback('Failed to insert user');
    });
  };
} ());
