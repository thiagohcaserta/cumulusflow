import { OpenAI } from '@langchain/openai';
import { Anthropic } from '@anthropic-ai/sdk';

export class AIAssistant {
  constructor(config) {
    this.provider = this.initializeProvider(config);
  }

  initializeProvider(config) {
    if (config.provider === 'anthropic' && config.anthropicKey) {
      return new Anthropic({
        apiKey: config.anthropicKey
      });
    }
    
    return new OpenAI({
      apiKey: config.openaiKey,
      model: config.model || 'gpt-4-0125-preview'
    });
  }

  async suggestOptimizations(code) {
    if (this.provider instanceof Anthropic) {
      const response = await this.provider.messages.create({
        model: 'claude-3-sonnet-20240229',
        max_tokens: 1024,
        messages: [{
          role: 'user',
          content: `Analyze this code and suggest optimizations:\n\n${code}`
        }]
      });
      return response.content[0].text;
    }

    const response = await this.provider.complete({
      prompt: `Analyze this code and suggest optimizations:\n\n${code}`,
      max_tokens: 500
    });
    return response.choices[0].text;
  }

  async generateTests(code) {
    if (this.provider instanceof Anthropic) {
      const response = await this.provider.messages.create({
        model: 'claude-3-sonnet-20240229',
        max_tokens: 1024,
        messages: [{
          role: 'user',
          content: `Generate unit tests for this code:\n\n${code}`
        }]
      });
      return response.content[0].text;
    }

    const response = await this.provider.complete({
      prompt: `Generate unit tests for this code:\n\n${code}`,
      max_tokens: 500
    });
    return response.choices[0].text;
  }

  async analyzePerformance(metrics) {
    if (this.provider instanceof Anthropic) {
      const response = await this.provider.messages.create({
        model: 'claude-3-sonnet-20240229',
        max_tokens: 1024,
        messages: [{
          role: 'user',
          content: `Analyze these performance metrics and suggest improvements:\n\n${JSON.stringify(metrics)}`
        }]
      });
      return response.content[0].text;
    }

    const response = await this.provider.complete({
      prompt: `Analyze these performance metrics and suggest improvements:\n\n${JSON.stringify(metrics)}`,
      max_tokens: 500
    });
    return response.choices[0].text;
  }
}