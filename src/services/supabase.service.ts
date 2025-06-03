import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class SupabaseService {
  private client: SupabaseClient;

  constructor() {
    const url = process.env.SUPABASE_URL;
    const key = process.env.SUPABASE_KEY;
    if (!url) throw new Error('SUPABASE_URL is required');
    if (!key) throw new Error('SUPABASE_KEY is required');
    this.client = createClient(url, key);
  }

  async insertResponse(prompt: string, response: string): Promise<void> {
    try {
      const { error } = await this.client
        .from('openai_responses')
        .insert([{ prompt, response, created_at: new Date().toISOString() }]);
      if (error) {
        throw new InternalServerErrorException('Supabase insert error: ' + JSON.stringify(error));
      }
    } catch (error) {
      throw new InternalServerErrorException('Supabase error');
    }
  }

  async getResponses(limit: number = 50, offset: number = 0): Promise<any[]> {
    try {
      const { data, error } = await this.client
        .from('openai_responses')
        .select('*')
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);
      
      if (error) {
        throw new InternalServerErrorException('Supabase select error: ' + JSON.stringify(error));
      }
      
      return data || [];
    } catch (error) {
      throw new InternalServerErrorException('Supabase error');
    }
  }

  async getResponseById(id: string): Promise<any> {
    try {
      const { data, error } = await this.client
        .from('openai_responses')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) {
        throw new InternalServerErrorException('Supabase select error: ' + JSON.stringify(error));
      }
      
      return data;
    } catch (error) {
      throw new InternalServerErrorException('Supabase error');
    }
  }
}
