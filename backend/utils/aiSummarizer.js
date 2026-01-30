const axios = require('axios');

class AISummarizer {
  constructor() {
    this.apiKey = process.env.OPENAI_API_KEY;
    this.baseURL = 'https://api.openai.com/v1';
  }

  async summarize(text) {
    try {
      if (!this.apiKey) {
        throw new Error('OpenAI API key not configured');
      }

      const response = await axios.post(
        `${this.baseURL}/chat/completions`,
        {
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: 'You are a helpful assistant that creates concise, accurate summaries of news articles. Keep summaries to 2-3 sentences maximum.'
            },
            {
              role: 'user',
              content: `Please summarize this news article: ${text}`
            }
          ],
          max_tokens: 150,
          temperature: 0.3
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      const summary = response.data.choices[0].message.content.trim();
      return summary || 'Summary could not be generated. Please try again.';
    } catch (error) {
      console.error('AI Summarization error:', error.message);
      // Fallback to simple text truncation or default message
      if (!text || text.trim().length === 0) {
        return 'Summary not available. The article content could not be summarized.';
      }
      return text.length > 200 ? text.substring(0, 200) + '...' : text;
    }
  }
}

module.exports = new AISummarizer();
