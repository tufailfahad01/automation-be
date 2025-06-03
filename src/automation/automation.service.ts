import { Injectable } from '@nestjs/common';
import { GeminiService } from '../services/hugging-face.service';
import { SupabaseService } from '../services/supabase.service';
import { N8nService } from '../services/n8n.service';

@Injectable()
export class AutomationService {
  constructor(
    private readonly geminiService: GeminiService,
    private readonly supabaseService: SupabaseService,
    private readonly n8nService: N8nService,
  ) {}

  async handlePrompt(prompt: string) {
    try {
      // 1. Call Gemini API
      const aiResponse = await this.geminiService.generateContent(prompt);
      // 2. Store in Supabase
      await this.supabaseService.insertResponse(prompt, aiResponse);
      // 3. Trigger n8n webhook
      await this.n8nService.triggerWebhook(prompt, aiResponse);
      return { prompt, response: aiResponse };
    } catch (error) {
      // Let the global filter handle the error, but optionally log here
      throw error;
    }
  }
}
