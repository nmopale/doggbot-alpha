// EmbedFunctions.js

const sqlfunctions = require("../sql/SQLFunctions.js");

module.exports = {

  // Generates a new embed of the user's profile
  generateProfile: async function(username, user_id, user) {
    const socialmedia = ['soundcloud', 'instagram', 'twitter',
      'facebook', 'spotify'
    ];
    var email = await sqlfunctions.getSocialKey("email", user_id);
    if (email.length == 0) {
      email = "noemail";
    }
    var nickname = await sqlfunctions.getSocialKey("nickname", user_id);
    if (nickname.length == 0) {
      nickname = "nonick";
    }
    var values = ['', '', '', '', ''];
    for (let j = 0; j < socialmedia.length; j++) {
      values[j] = await sqlfunctions.getSocialKey(socialmedia[j], user_id);
      if (!values[j].length > 0) {
        values[j] = "Undefined";
      }
    }
    var rank =  await sqlfunctions.getCurrentRank(user_id);
    var exp = await sqlfunctions.getCurrentExperience(user_id);
    const embed = {
      color: 0x8080ff,
      title: `${username}\t\t\t\t\t\t\t\t\t\tRank  ${rank}  (${exp} xp)`,
      author: {
        name: 'DoggBot',
        icon_url: 'http://repo.sad.xn--3ds443g/ghost-icon.png',
        url: 'http://www.digitalghost.org/',
      },
      description: `aka (${nickname})'s DGA Profile`,
      thumbnail: {
        url: user.avatarURL,
      },
      fields: [
        {
          name: "E-mail Address",
          value: email,
        },
        {
          name: socialmedia[0],
          value: values[0],
          inline: true,
        },
        {
          name: socialmedia[1],
          value: values[1],
          inline: true,
        },
        {
          name: socialmedia[2],
          value: values[2],
          inline: true,
        },
        {
          name: socialmedia[3],
          value: values[3],
          inline: true,
        },
        {
          name: socialmedia[4],
          value: values[4],
          inline: true,
        },
      ],
      timestamp: new Date(),
      footer: {
        text: 'Digital Ghost Alliance',
        icon_url: 'http://repo.sad.xn--3ds443g/ghost-icon.png',
      },
    }
    return embed;
  }
}
