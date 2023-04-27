const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: process.env.CHAT_GPT,
});

const chatGPT = new OpenAIApi(configuration);

module.exports = {
  chatGPT,
};
