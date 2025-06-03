import { Module } from '@nestjs/common';
import { AutomationModule } from './automation/automation.module';
import { AutomationService } from './automation/automation.service';
import { GeminiService } from './services/hugging-face.service';
import { SupabaseService } from './services/supabase.service';
import { N8nService } from './services/n8n.service';

@Module({
  imports: [AutomationModule],
  providers: [AutomationService, GeminiService, SupabaseService, N8nService],
})
export class AppModule {}
