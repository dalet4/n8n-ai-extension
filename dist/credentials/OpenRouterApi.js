"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OpenRouterApi = void 0;
class OpenRouterApi {
    constructor() {
        this.name = 'openRouterApi';
        this.displayName = 'OpenRouter API';
        this.documentationUrl = 'https://openrouter.ai/docs';
        this.properties = [
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
}
exports.OpenRouterApi = OpenRouterApi;
//# sourceMappingURL=OpenRouterApi.js.map