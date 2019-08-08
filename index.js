// index.js
// @author litdogg

//Required imports
const Discord = require('discord.js');
const sqlfunctions = require("./sql/SQLFunctions.js");
const embedfunctions = require("./embeds/EmbedFunctions.js");
const commandManager = require("./util/CommandManager.js");
const pcfunctions = require("./util/PostCountFunctions.js");
const rank = require("./util/Rank.js");
const cfg = require("./config/cfg.json");
const client = new Discord.Client();

// Basic info
var name = "doggbot";
var version = 0.4;

// When client is ready
client.on('ready', () => {
  console.log(`###################################`);
  console.log(`### STARTED ${name} VERSION ${version}`);
  console.log(`### Logged in as ${client.user.tag}.`);
  console.log(`###################################\n`);
  checkToSendData();
});

// Message-based commands
client.on('message', async msg => {
  if (msg.author.bot)
    return;
  var usr = msg.author;
  var str = msg.content.toLowerCase();
  const args = str.slice(cfg.prefix.length).split(/\s+/);
  const addPosts = await pcfunctions.cachePosts(usr.id, 1);
  if (!str.startsWith(cfg.prefix))
    return;
  let registeredUser = await sqlfunctions.checkIfUserExists(usr.id);
    commandManager.setVariables(usr, client, msg, args, registeredUser)
  let doCommand = await commandManager.parseCommand();
});

// Sends data -> sql on 3 second interval
async function checkToSendData() {
  //Invoke set interval function to use timers
  setInterval(async function() {
    let cache = await pcfunctions.getCachedPosts();
    let query = await pcfunctions.buildPostsQuery();
    let size = await pcfunctions.getCachedPostsSize();
    let experienceQuery = await pcfunctions.buildExperienceByPostsQuery();
    if (size > 0) {
      let send = await sqlfunctions.sendPostsQuery(query);
      let sendExp = await sqlfunctions.sendExperienceQuery(experienceQuery);
      let cpc = await pcfunctions.clearPostsCache();
    }
  }, 3 * 1000); // Check every 5 seconds
}

// Log into our bot with token
client.login(cfg.token);
