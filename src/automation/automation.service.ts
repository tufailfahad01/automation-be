import { Injectable } from '@nestjs/common';
import { HuggingFaceService } from '../services/hugging-face.service';
import { SupabaseService } from '../services/supabase.service';
import { N8nService } from '../services/n8n.service';

@Injectable()
export class AutomationService {
  constructor(
    private readonly huggingFaceService: HuggingFaceService,
    private readonly supabaseService: SupabaseService,
    private readonly n8nService: N8nService,
  ) {}

  async handlePrompt(title: string, content: string) {
    try {
      // // 1. Call Hugging Face API
      // const aiResponse = await this.huggingFaceService.generateContent(prompt);
      // // 2. Store in Supabase
      // await this.supabaseService.insertResponse(prompt, aiResponse);
      // 3. Trigger n8n webhook
      const createDoc = await this.n8nService.triggerWebhook(title, content);
      return { response: createDoc };
    } catch (error) {
      // Let the global filter handle the error, but optionally log here
      throw error;
    }
  }
}
