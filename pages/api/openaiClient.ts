import { Configuration, OpenAIApi } from 'openai-edge';

const openAiKey = process.env.OPENAI_KEY;

const config = new Configuration({
  apiKey: openAiKey,
});
const openai = new OpenAIApi(config);

export { openai };
