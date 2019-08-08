// Utility

// Variables for post counts to be sent to sql db
var cachedPosts = {};
const sqlfunctions = require("../sql/SQLFunctions.js");

module.exports = {

  // Store UID and points in array
  cachePosts: async function(uid, posts) {
    let messages = 0;
    if (cachedPosts[uid])
      messages = cachedPosts[uid];
    cachedPosts[uid] = messages + posts;
  },

  // Get values of cachedPosts
  getCachedPosts: async function() {
    return Object.values(cachedPosts);
  },

  // Get amount of users in posts
  getCachedPostsSize: async function() {
    return Object.keys(cachedPosts).length;;
  },

  // Build query with IDs and posts values
  // NOTE: Left this in here because it uses cachedPosts to build this query
  buildExperienceByPostsQuery: async function() {
    let queryString = "INSERT INTO dga_users (discord_uid, experience) VALUES"
    Object.keys(cachedPosts).forEach(key => {
      queryString += ` (${key}, ${cachedPosts[key]}),`;
    });
    //Remove the last comma added
    queryString = queryString.slice(0, -1);
    //Then add the finishing touches
    queryString += ` ON DUPLICATE KEY UPDATE experience = experience + VALUES(experience)`;
    return queryString;
  },

  // Build query with IDs and posts values
  buildPostsQuery: async function() {
    let queryString = "INSERT INTO dga_users (discord_uid, post_count) VALUES"
    Object.keys(cachedPosts).forEach(key => {
      queryString += ` (${key}, ${cachedPosts[key]}),`;
    });
    //Remove the last comma added
    queryString = queryString.slice(0, -1);
    //Then add the finishing touches
    queryString += ` ON DUPLICATE KEY UPDATE post_count = post_count + VALUES(post_count)`;
    return queryString;
  },

  // Empty the array
  clearPostsCache: async function() {
    cachedPosts = {};
    return;
  },
}
