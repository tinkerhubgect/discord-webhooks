//require("dotenv").config();
const { Webhook, MessageBuilder } = require("discord-webhook-node");
const hook = new Webhook(process.env.DEV_HOOK);
const axios = require("axios");

//set limit
const limit = 2;

const fetchPosts = async () => {
  try {
    //fetch from api
    let blogs = (await axios.get("https://dev.to/api/articles?top=1")).data;

    //generate 2 random numbers to select posts
    let random = new Set();
    let range = blogs.length / 2;
    while (random.size < limit) random.add(Math.floor(Math.random() * range));
    random = [...random];

    //loop to send embed messages
    for (let i = 0; (i < limit) & (i < blogs.length); i++) {
      let blog = blogs[random[i]];

      //formatting tags
      let tags = blog.tags;
      tags = tags.split(",");
      tags = tags.map((tag) => `#**${tag.trim()}**`);
      tags = tags.join(" ");

      //generate embed message
      let embed = await new MessageBuilder()
        .setTitle(blog.title)
        .setURL(blog.url)
        .setColor("#00b0f4")
        .setDescription(`${blog.description} \n\n${tags} \n`)
        .setImage(blog.social_image)
        .setFooter(
          `${blog.public_reactions_count}  ❤️ \t ${blog.comments_count}  💬`
        );

      //send embed message to discord
      await hook.send(embed);
    }
  } catch (e) {
    console.log(e);
  }
};

fetchPosts();
