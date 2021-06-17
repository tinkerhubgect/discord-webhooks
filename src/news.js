//require("dotenv").config();
const { Webhook, MessageBuilder } = require("discord-webhook-node");
const hook = new Webhook(process.env.NEWS_HOOK);
const axios = require("axios");

//set limit
const limit = 7;

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

    let arr = [];

    //loop to store top 7 messages in an array
    for (let i = 0; (i < limit) & (i < blogs.length); i++) {
      let blog = blogs[i];
      arr.push(`[${i + 1} : ${blog.title}](${blog.link})`);
    }

    let desc = [];
    let descLen = 0;
    let stringLen = 0;

    //loop to keep messages within embed limits and split into several messages
    for (i = 0; i < arr.length; i++) {
      stringLen = arr[i].length;

      //if news length > 2040, it cant be part of any embed
      if (stringLen > 2040) continue;

      //next news can't be part of this embed
      if (stringLen + descLen > 2040) {
        let embed = await new MessageBuilder()
          .setTitle(`Tech Today  :newspaper:`)
          .setColor("#00b0f4")
          .setDescription(`${desc.join("\n\n")}`);
        await hook.send(embed);
        i--;
        desc = [];
        descLen = 0;
      }

      //next news can be part of the embed
      else {
        desc.push(arr[i]);
        descLen += stringLen;
      }
    }

    //if any news is left to be sent
    if (descLen > 0) {
      let embed = await new MessageBuilder()
        .setTitle("Tech Today  :newspaper:")
        .setColor("#00b0f4")
        .setDescription(`${desc.join("\n\n")}`);
      await hook.send(embed);
    }
  } catch (e) {
    console.log(e);
  }
};

fetchPosts();
