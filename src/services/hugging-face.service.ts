import { Injectable, InternalServerErrorException } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class HuggingFaceService {
  async generateContent(prompt: string): Promise<string> {
    try {
      const hfApiKey = process.env.HUGGINGFACE_API_KEY || '';
      const hfModel = process.env.HUGGINGFACE_MODEL || 'facebook/bart-large-cnn'; // Use a summarization model
      const hfUrl = `https://api-inference.huggingface.co/models/${hfModel}`;
      const hfPayload = {
        inputs: prompt, // For summarization models, just pass the text
        parameters: {
          max_length: 150,
          min_length: 30,
          do_sample: false
        }
      };
      const response = await axios.post(hfUrl, hfPayload, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${hfApiKey}`
        }
      });
      // Most summarization models return { summary_text: ... }
      if (Array.isArray(response.data) && response.data.length > 0 && response.data[0].summary_text) {
        return response.data[0].summary_text;
      }
      // Fallback: return stringified response
      return typeof response.data === 'string' ? response.data : JSON.stringify(response.data);
    } catch (error) {
      console.error('Hugging Face API error:', error?.response?.data || error?.message || error);
      throw new InternalServerErrorException('Hugging Face API error');
    }
  }
}
