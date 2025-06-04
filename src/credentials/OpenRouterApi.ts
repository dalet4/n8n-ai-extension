import {
  ICredentialType,
  INodeProperties,
} from 'n8n-workflow';

export class OpenRouterApi implements ICredentialType {
  name = 'openRouterApi';
  displayName = 'OpenRouter API';
  documentationUrl = 'https://openrouter.ai/docs';
  properties: INodeProperties[] = [
    {
      displayName: 'API Key',
      name: 'apiKey',
      type: 'string',
      typeOptions: {
        password: true,
      },
      default: '',
      required: true,
      description: 'OpenRouter API key',
    },
    {
      displayName: 'Default Model',
      name: 'defaultModel',
      type: 'string',
      default: 'openai/gpt-3.5-turbo',
      required: false,
      description: 'Default model to use (e.g., openai/gpt-4, anthropic/claude-2, google/gemini-pro)',
    },
  ];
}
