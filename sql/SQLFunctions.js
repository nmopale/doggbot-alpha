const mysql = require('mysql');
const idx = require('../index.js');
const utility = require('../util/PostCountFunctions.js');
const cfg = require('../config/cfg.json');

var connection = mysql.createConnection({
  host: cfg.database_ip,
  port: cfg.database_port,
  user: cfg.database_user,
  password: cfg.database_pass,
  database: cfg.database,
});

module.exports = {

  // Register UID in database
  // NOTE This may no longer be needed as posting automatically adds new UID to table
  registerAccount: function(user_id) {
    var qs = "INSERT INTO `dga_users` (discord_uid) VALUES(" + user_id + ") ON DUPLICATE KEY UPDATE discord_uid=discord_uid";
    connection.query(qs, function(error, results, fields) {
      if (error)
        throw error;
      console.log(results);
    });
  },

  // Add DGA points to database for user
  addDgaPoints: async function(user_id, points) {
    var qs = "INSERT INTO `dga_users` (discord_uid, dga_points) VALUES(" + user_id + ", " + points + ") ON DUPLICATE KEY UPDATE dga_points=dga_points+" + points;
    connection.query(qs, function(error, results, fields) {
      if (error)
        throw error;
      console.log(results);
    });
  },

  // Get DGA points of user
  getDgaPoints: function(user_id) {
    var readQuery = "SELECT * FROM `dga_users` WHERE `discord_uid`=" + user_id;
    return new Promise((resolve, reject) => {
      connection.query(readQuery, function(err, result) {
        var size = result.length;
        if (size > 0) {
          resolve(result[0].dga_points);
        }
      });
    });
  },

  // Check to se if user exists by uid
  checkIfUserExists: async function(user_id) {
    var qs = "SELECT * FROM `dga_users` WHERE `discord_uid`=" + user_id;
    return new Promise((resolve, reject) => {
      connection.query(qs, function(err, result) {
        var size = result.length;
        if (size > 0) {
          resolve(true);
        } else {
          resolve(false);
        }
      });
    });
  },

  // Sets social key of specfied social media
  setSocialKey: function(user_id, type, text) {
    var insertQuery = `UPDATE dga_users SET ${type} = ? WHERE discord_uid = ?`;
    connection.query(insertQuery, [text, user_id], function(err, res) {
      if (err)
        throw err;
      else
        console.log("Updated " + user_id + " with " + text + " successfully.");
    });
  },

  // Return social key of specified media
  getSocialKey: function(type, user_id2) {
    var readQuery = "SELECT * FROM `dga_users` WHERE discord_uid =" + user_id2;
    return new Promise((resolve, reject) => {
      connection.query(readQuery, function(err, result) {
        var size = result.length;
        if (size == 0) {
          return reject(0);
        }
        switch (type) {
          case "email":
            resolve(result[0].email);
            break;
          case "nickname":
            resolve(result[0].nickname);
            break;
          case "soundcloud":
            resolve(result[0].soundcloud)
            break;
          case "facebook":
            resolve(result[0].facebook)
            break;
          case "twitter":
            resolve(result[0].twitter);
            break;
          case "instagram":
            resolve(result[0].instagram);
            break;
          case "spotify":
            resolve(result[0].spotify);
            break;
        }
      });
    });
  },

  // Modify existing DGA points by userid
  updateDgaPoints: function(user_id, points) {
    var updateQuery = 'UPDATE dga_users SET dga_points = ? WHERE discord_uid = ?';
    connection.query(updateQuery, [points, user_id], function(err, res) {
      if (err)
        throw err;
      else
        console.log('Updated points of ' + user_id);
    });
    connection.end();
  },

  // Update experience points
  updateRank: async function(user_id, rank) {
    var updateQuery = 'UPDATE `dga_users` SET `rank` = ? WHERE `discord_uid` = ?';
    connection.query(updateQuery, [rank, user_id], function(err, res) {
      if (err)
        throw err;
    });
  },

  // Modify existing DGA points by userid
  getCurrentRank: async function(user_id) {
    var readQuery = "SELECT * FROM `dga_users` WHERE `discord_uid`=" + user_id;
    return new Promise((resolve, reject) => {
      connection.query(readQuery, function(err, result) {
        var size = result.length;
        if (size > 0) {
          resolve(result[0].rank);
        }
      });
    });
  },

  // Update experience points
  updateExperience: async function(user_id, exp) {
    var qs = "INSERT INTO `dga_users` (discord_uid, experience) VALUES(" + user_id + ", " + exp + ") ON DUPLICATE KEY UPDATE experience = experience + " + exp;
    connection.query(qs, [exp, user_id], function(err, res) {
      if (err)
        throw err;
    });
  },

  // Add DGA points to database for user
  addDgaPoints: async function(user_id, points) {
    var qs = "INSERT INTO `dga_users` (discord_uid, dga_points) VALUES(" + user_id + ", " + points + ") ON DUPLICATE KEY UPDATE dga_points=dga_points+" + points;
    connection.query(qs, function(error, results, fields) {
      if (error)
        throw error;
      console.log(results);
    });
  },

  // Modify existing DGA points by userid
  getCurrentExperience: async function(user_id) {
    var readQuery = "SELECT * FROM `dga_users` WHERE `discord_uid`=" + user_id;
    return new Promise((resolve, reject) => {
      connection.query(readQuery, function(err, result) {
        var size = result.length;
        if (size > 0) {
          resolve(result[0].experience);
        }
      });
    });
  },

  // Send experience query to SQL
  sendExperienceQuery: async function(query) {
    if (query.includes("length")) {
      return;
    } else {
      connection.query(query, function(err, res) {
        if (err)
          throw err;
      });
    }
  },

  // Send cachedPosts query to SQL
  sendPostsQuery: async function(query) {
    if (query.includes("length")) {
      return;
    } else {
      connection.query(query, function(err, res) {
        if (err)
          throw err;
      });
    }
  },

  // Get current mysql connection
  getConnection: async function() {
    return connection;
  }

}
