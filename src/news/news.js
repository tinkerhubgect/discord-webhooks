//require("dotenv").config();
const { Webhook, MessageBuilder } = require("discord-webhook-node");
const hook = new Webhook(process.env.NEWS_HOOK);
const axios = require("axios");
const sources = require("./sources");

//set limit
let limit = 7;

const fetchPosts = async () => {
  try {
    //fetch from api
    let blogs = (
      await axios.get(
        "https://google-news.p.rapidapi.com/v1/topic_headlines?lang=en&country=IN&topic=technology",
        {
          headers: {
            "x-rapidapi-key": process.env.NEWS_KEY,
            "x-rapidapi-host": "google-news.p.rapidapi.com",
            useQueryString: true,
          },
        }
      )
    ).data.articles;

    //embed without content
    let embed = await new MessageBuilder()
      .setTitle(`Tech Today  :newspaper:`)
      .setThumbnail(
        "https://miro.medium.com/max/1033/1*MAsNORFL89roPfIFMBnA4A.jpeg"
      )
      .setColor("#00b0f4");

    let space = "\u200B";
    let link = "";
    let count = 1;

    //loop to add top news to embed
    for (let i = 0; (i < limit) & (i < blogs.length); i++) {
      let blog = blogs[i];

      //check if source is in our list
      if (!sources.includes(blog.source.title)) {
        limit++;
        continue;
      }

      link = `${count} : ${blog.title} [(Read More)](${blog.link})`;

      //if field limits are exceeded
      if (link.length > 1020) {
        limit++;
        continue;
      }

      //add field to embed
      embed.addField(space, link);
      count++;
    }

    //send embed to discord
    hook.send(embed);
  } catch (e) {
    console.log(e);
  }
};

fetchPosts();
//r
