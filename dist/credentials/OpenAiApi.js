"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OpenAiApi = void 0;
class OpenAiApi {
    constructor() {
        this.name = 'openAiApi';
        this.displayName = 'OpenAI API';
        this.documentationUrl = 'https://platform.openai.com/docs/api-reference';
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
                description: 'OpenAI API key',
            },
            {
                displayName: 'Organization ID',
                name: 'organizationId',
                type: 'string',
                default: '',
                required: false,
                description: 'OpenAI organization ID (optional)',
            },
        ];
    }
}
exports.OpenAiApi = OpenAiApi;
//# sourceMappingURL=OpenAiApi.js.map