const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config();

const DEEPSEEK_API_URL = 'https://openrouter.ai/api/v1/chat/completions';
const DEEPSEEK_API_KEY = process.env.OPENROUTER_DEEPSEEK_API_KEY;

if (!DEEPSEEK_API_KEY) {
  console.error("Missing API key! Check your .env file.");
  throw new Error("DeepSeek API key is missing.");
}

let conversationHistory = [
  {
    role: 'system',
    content: 'You are an English conversation assistant. Respond in English and help the user practice English. When the user gives a real life situation, you start as one of the roles and then continue responding according to the user\'s lines',
  },
];

let isInitialised = false;

async function getDeepSeekResponse(userMessage, scenario = null) {
  try {
    if (userMessage.toLowerCase() === 'end session.') {
      console.log('Session ended. Clearing conversation history.');
      conversationHistory = [];
      isInitialised = false;
      return 'Session ended. Goodbye!';
    }
    
    if (!isInitialised) {
      if (scenario) {
        console.log("Starting conversation with scenario:", JSON.stringify(scenario, null, 2));

        conversationHistory.push({
          role: 'user',
          content: `Let's practise a conversation. The scenario is ${scenario.title}. I will be the ${scenario.userRole} and you be the ${scenario.systemRole}. You start the conversation. You don't need to mention our roles every time you speak. Just give natural responses.`
        });

        isInitialised = true;
      } else {
        console.error("No scenario passed");
        return "Error: No scenario provided.";
      }
    } else {
      if (!userMessage || userMessage.trim() === '') {
        console.error("Error: Message can't be empty");
        return 'Please say something before sending.';
      }
      conversationHistory.push({ role: 'user', content: userMessage });
    }

    console.log('Sending request to DeepSeek API...');
    console.log(`User message is "${userMessage}"`);

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

    if (!response.data || !response.data.choices || response.data.choices.length === 0) {
      throw new Error('No valid response from DeepSeek API');
    }

    const message = response.data.choices[0].message;
    if (!message || !message.content || message.content.trim() === '') {
      throw new Error('Received an empty response from DeepSeek API');
    }

    const assistantMsg = message.content;
    conversationHistory.push({ role: 'system', content: assistantMsg });

    return assistantMsg;
  } catch (error) {
    console.error('Error in DeepSeek API request:', error.message);
    return 'Error: Failed to fetch response from DeepSeek';
  }
}

module.exports = getDeepSeekResponse;
