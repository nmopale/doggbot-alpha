// Rank.js
// @author litdogg

const sqlfunctions = require("../sql/SQLFunctions.js");
const commandmanager = require("./CommandManager.js");
const idx = require("../index.js");

module.exports = {

  // Return the experience required for a specific level
  getExpForLevel: async function(lvl) {
    points = 0;
    output = 0;
    points += Math.floor(lvl + 300 * Math.pow(2.0, lvl / 7.0));
    output = Math.floor(points / 4);
    return output;
  },

  // Return the level for addExperience
  getLevelForXP: async function(exp) {
    points = 0;
    output = 0;
    for (let lvl = 1; lvl <= 99; lvl++) {
      points += Math.floor(lvl + 300.0 * Math.pow(2.0, lvl / 7.0));
      output = Math.floor(points / 4);
      if (output >= exp)
        return lvl;
    }
    return 0;
  },

  // Add a certain amount of experience to specified user
  addExperience: async function(user, exp, msg) {
    let currentXP = await sqlfunctions.getCurrentExperience(user.id);
    let currentLvl = await module.exports.getLevelForXP(currentXP);
    currentXP += exp;
    let checkLvl = await module.exports.getLevelForXP(currentXP);
    console.debug(`CurrentLvl: ${currentLvl}\nCheckLevel = ${checkLvl}`);
    if (checkLvl > currentLvl) {
      msg.channel.send(`Congratulations to ${user.tag}, they have reached level ${checkLvl}!`);
      sqlfunctions.updateRank(user.id, checkLvl);
    }
    sqlfunctions.updateExperience(user.id, exp);
  }
}
