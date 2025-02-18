const axios = require('axios');
const dotenv=require('dotenv');

dotenv.config();

const DEEPSEEK_API_URL = 'https://openrouter.ai/api/v1/chat/completions';
const DEEPSEEK_API_KEY = process.env.OPENROUTER_DEEPSEEK_API_KEY;

async function getDeepSeekResponse(userMessage) {
  try {
    console.log('Sending request to DeepSeek API...');
    console.log(`User message is "${userMessage}"`);
    const response = await axios.post(
      DEEPSEEK_API_URL,
      {
        model: 'deepseek/deepseek-chat:free',
        messages: [
          {
            role: 'user',
            content: userMessage,
          },
        ],
      },
      {
        headers: {
          'Authorization': `Bearer ${DEEPSEEK_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    console.log('API Response:', response.data);

    if (response.data && response.data.choices && response.data.choices.length > 0) {
      return response.data.choices[0].message.content;  // Extract the response content
    } else {
      throw new Error('No valid response from DeepSeek API');
    }
  } catch (error) {
    console.error('Error in DeepSeek API request:', error.message);
    throw new Error('Failed to fetch response from DeepSeek');
  }
}

module.exports = getDeepSeekResponse;
