import { Injectable, InternalServerErrorException } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class N8nService {
  async triggerWebhook(title: string, content: string): Promise<void> {
    try {
      const url = process.env.N8N_WEBHOOK_URL || '';
      await axios.post(url, { title, content });
    } catch (error) {
      console.error('N8n webhook error:', error);
      throw new InternalServerErrorException('n8n webhook error', error.message);
    }
  }
}
