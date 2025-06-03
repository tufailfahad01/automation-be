import { Module } from '@nestjs/common';
import { AutomationController } from './automation.controller';
import { AutomationService } from './automation.service';
import { GeminiService } from '../services/hugging-face.service';
import { SupabaseService } from '../services/supabase.service';
import { N8nService } from '../services/n8n.service';

@Module({
  imports: [],
  controllers: [AutomationController],
  providers: [AutomationService, GeminiService, SupabaseService, N8nService],
})
export class AutomationModule {}
