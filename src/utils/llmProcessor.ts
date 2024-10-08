import axios from 'axios';

const LLM_API_ENDPOINT = 'YOUR_LLM_API_ENDPOINT';
const LLM_API_KEY = 'YOUR_LLM_API_KEY';

export async function processEmailWithLLM(subject: string, body: string): Promise<string> {
  try {
    const response = await axios.post(
      LLM_API_ENDPOINT,
      {
        prompt: `Analyze the following email and determine its importance (high, medium, or low):
        Subject: ${subject}
        Body: ${body}
        
        Respond with only one word: high, medium, or low.`,
        max_tokens: 1,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${LLM_API_KEY}`,
        },
      }
    );

    const importance = response.data.choices[0].text.trim().toLowerCase();
    return importance;
  } catch (error) {
    console.error('Error processing email with LLM:', error);
    return 'medium'; // Default to medium importance if there's an error
  }
}