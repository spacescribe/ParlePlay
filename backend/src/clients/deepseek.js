const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config();

const DEEPSEEK_API_URL = 'https://openrouter.ai/api/v1/chat/completions';
const DEEPSEEK_API_KEY = process.env.OPENROUTER_DEEPSEEK_API_KEY;

let conversationHistory = [
  {
    role: 'system',
    content: 'You are an English conversation assistant. Respond in English and help the user practice English. When the user gives a real life situation, you start as one of the roles and then continue responding according to the user\'s lines',
  },
];

async function getDeepSeekResponse(userMessage) {
  try {
    if (!userMessage || userMessage.trim() === '') {
      throw new Error('Message cannot be empty');
    }

    if (userMessage.toLowerCase() === 'end session') {
        console.log('Session ended. Clearing conversation history.');
        conversationHistory = [];
        return 'Session ended. Goodbye!';
      }  

    console.log('Sending request to DeepSeek API...');
    console.log(`User message is "${userMessage}"`);

    conversationHistory.push({ role: 'user', content: userMessage });

    const response = await axios.post(
      DEEPSEEK_API_URL,
      {
        model: 'deepseek/deepseek-chat:free',
        messages: conversationHistory,
      },
      {
        headers: {
          'Authorization': `Bearer ${DEEPSEEK_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    console.log('API Response:', JSON.stringify(response.data, null, 2));

    if (response.data && response.data.choices && response.data.choices.length > 0) {
      const message = response.data.choices[0].message;
      if (message && message.content) {
        const assistantMsg = message.content;
        conversationHistory.push({ role: 'assistant', content: assistantMsg });
        return assistantMsg;
      } else {
        throw new Error('No content in message');
      }
    } else {
      throw new Error('No valid response from DeepSeek API');
    }
  } catch (error) {
    console.error('Error in DeepSeek API request:', error.message);
    throw new Error('Failed to fetch response from DeepSeek');
  }
}

module.exports = getDeepSeekResponse;
