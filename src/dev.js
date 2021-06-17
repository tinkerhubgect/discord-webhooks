const { Webhook, MessageBuilder } = require("discord-webhook-node");
const hook = new Webhook(process.env.DEV_HOOK);
const axios = require("axios");

const limit = 2;

const fetchPosts = async () => {
  try {
    //fetch from api
    let blogs = (await axios.get("https://dev.to/api/articles?top=1")).data;

    //loop to send embed messages
    for (let i = 0; i < limit; i++) {
      let blog = blogs[i];

      //generate embed message
      let embed = await new MessageBuilder()
        .setTitle(blog.title)
        .setURL(blog.url)
        .setColor("#00b0f4")
        .setDescription(`${blog.description} \n\n:point_right: ${blog.tags} \n`)
        .setImage(blog.social_image)
        .setFooter(
          `${blog.public_reactions_count}  ❤️ \t ${blog.comments_count}  💬`
        );

      //send embed message to discord
      await hook.send(embed);
    }
  } catch (e) {
    console.log(e.name);
  }
};

fetchPosts();
