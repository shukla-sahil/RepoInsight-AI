import axios from 'axios';

import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from the parent directory's .env file
dotenv.config({ path: path.join(__dirname, '../.env') });

async function testOpenRouter() {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    console.error("No OPENROUTER_API_KEY found in .env file.");
    return;
  }
  try {
    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: "google/gemma-3-12b-it:free",
        messages: [{ role: 'user', content: 'test' }],
      },
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'http://localhost:3000',
          'X-Title': 'RepoInsight AI'
        }
      }
    );
    console.log(response.data);
  } catch (error: any) {
    console.log('Error:', error.response?.data || error.message);
  }
}

testOpenRouter();
