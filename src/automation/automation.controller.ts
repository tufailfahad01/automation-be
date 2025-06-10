import { Controller, Post, Body, BadRequestException, Get, Query, Param } from '@nestjs/common';
import { AutomationService } from './automation.service';
import { SupabaseService } from '../services/supabase.service';
import { title } from 'process';

@Controller()
export class AutomationController {
  constructor(
    private readonly automationService: AutomationService,
    private readonly supabaseService: SupabaseService,
  ) {}

  @Post('api/process')
  async processPrompt(@Body('title') title: string, @Body('content') content: string) {
    if (!title || title.length < 5) {
      throw new BadRequestException('Title must be at least 5 characters.');
    }
    if (!content || content.length < 50) {
      throw new BadRequestException('Content must be at least 50 characters.');
    }
    // Convert escaped newlines (\n) to actual newlines
    const normalizedContent = content.replace(/\\n/g, '\n');
    return {
      success: true,
      data: await this.automationService.handlePrompt(title, normalizedContent),
    };
  }

  @Get('api/responses')
  async getResponses(
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
  ) {
    const limitNum = limit ? parseInt(limit, 10) : 50;
    const offsetNum = offset ? parseInt(offset, 10) : 0;
    
    if (limitNum < 1 || limitNum > 100) {
      throw new BadRequestException('Limit must be between 1 and 100');
    }
    
    if (offsetNum < 0) {
      throw new BadRequestException('Offset must be 0 or greater');
    }
    
    const data = await this.supabaseService.getResponses(limitNum, offsetNum);
    
    return {
      success: true,
      data,
      meta: {
        limit: limitNum,
        offset: offsetNum,
        count: data.length,
      },
    };
  }

  @Get('api/responses/:id')
  async getResponseById(@Param('id') id: string) {
    if (!id) {
      throw new BadRequestException('ID is required');
    }
    
    const data = await this.supabaseService.getResponseById(id);
    
    return {
      success: true,
      data,
    };
  }
}
