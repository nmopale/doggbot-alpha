// Command Manager.js
// @author litdogg

const rank = require("./Rank.js");
const sqlfunctions = require("../sql/SQLFunctions.js");
const embedfunctions = require("../embeds/EmbedFunctions.js");

var user;
var msg;
var args;
var client;
var exists;

module.exports = {

  // Set variables of the incoming command
  setVariables: function(user_, client_, msg_, args_, exists_) {
    user = user_;
    msg = msg_;
    args = args_;
    client = client_;
    exists = exists_;
  },

  // Execute the command
  parseCommand: async function() {
    var uid = user.id;
    var name = user.tag;
    const action = args.shift();

    // Any-time actions
    switch (action) {
      // Ping the bot
      case 'ping':
        const m = await msg.channel.send("Pong!");
        m.edit(`Latency: ${m.createdTimestamp - msg.createdTimestamp}ms. API Latency: ${Math.round(client.ping)}ms`);
        break;
        // Register the UID of the person sending the message in our database
      case 'register':
        if (exists) {
          msg.channel.send("User ID already exists.");
        } else {
          sqlfunctions.registerAccount(uid);
          msg.channel.send("Updated user ID to DGA database.");
          return;
        }
        break;
    }
    // If user has registered :
    if (exists) {
      switch (action) {
        // Test command for adding experience
        case 'addxp':
          let exp = rank.addExperience(user, 100, msg);
        break;
        // Shortcut to own profile
        case 'me':
          const e = await embedfunctions.generateProfile(name, uid, user);
          msg.channel.send({
            embed: e
          });
          break;
          // Set social media accounts, email, nickame
        case 'set':
          switch (args[0]) {
            case "email":
            case "nickname":
            case "soundcloud":
            case "facebook":
            case "twitter":
            case "instagram":
            case "spotify":
              sqlfunctions.setSocialKey(uid, args[0], args[1]);
              msg.reply(`${args[0]} set to ${args[1]}.`)
              break;
            default:
              const m = await msg.channel.send("Sorry, I don't know that one!");
              m.edit("Try nickname, email, soundcloud, facebook, twitter, or instagram.");
              return;
          }
          break;
        case 'get':
          switch (args[0]) {
            case "email":
            case "nickname":
            case "soundcloud":
            case "facebook":
            case "twitter":
            case "instagram":
            case "spotify":
              try {
                let otherid = await module.exports.getOtherID(args[1]);
                let returnValue = await sqlfunctions.getSocialKey(args[0], otherid);
                if (returnValue.length > 0) {
                  msg.channel.send(`${args[1]}'s ${args[0]} is ${returnValue}.`);
                } else {
                  msg.channel.send(`${args[1]}'s ${args[0]} is not yet listed. Remind them to update it! :)`);
                }
              } catch (err) {
                msg.channel.send(`${args[1]}'s profile is not in our database...`);
                msg.channel.send(`Invite them to come join us here at DGA! :)`);
              }
              break;
            case "profile":
              let otherid = await module.exports.getOtherID(args[1]);
              console.log("other id = " + otherid);
              var userObject = await client.users.get(otherid);
              console.log("userObject = " + userObject);
              const e = await embedfunctions.generateProfile(args[1], otherid, userObject);
              if (otherid > 0) {
                msg.channel.send({
                  embed: e
                });
                return;
              } else {
                const m = await msg.channel.send("Sorry, I couldn't find that user.");
                return;
              }
              default:
                const m = await msg.channel.send("Sorry, I don't know that one!");
                m.edit("Try nickname, email, spotify, soundcloud, facebook, twitter, or instagram.");
                break;
          }
      }
    } else {
      msg.reply("hey! Please register your user ID by using $register first!");
      return;
    }
  },

  // Resolve user ID by username
  getOtherID: async function(searchName) {
    return new Promise((resolve, reject) => {
      let search = client.guilds.array();
      for (let i = 0; i < search.length; i++) {
        client.guilds.get(search[i].id).fetchMembers().then(r => {
          r.members.array().forEach(r => {
            let username = r.user.username.toLowerCase();
            if (searchName === username) {
              resolve(r.user.id);
            }
          });
        });
      }
    });
  },
}
