import { Injectable, InternalServerErrorException } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class N8nService {
  async triggerWebhook(prompt: string, response: string): Promise<void> {
    try {
      const url = process.env.N8N_WEBHOOK_URL || '';
      await axios.post(url, { prompt, response });
    } catch (error) {
      throw new InternalServerErrorException('n8n webhook error');
    }
  }
}
