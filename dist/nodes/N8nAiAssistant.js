"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.N8nAiAssistantNode = void 0;
const n8n_workflow_1 = require("n8n-workflow");
const workflowHelper_1 = require("../utils/workflowHelper");
const openAiHelper_1 = require("../utils/openAiHelper");
class N8nAiAssistantNode {
    constructor() {
        this.description = {
            displayName: 'N8N AI Assistant',
            name: 'n8nAiAssistant',
            icon: 'file:assistant.svg',
            group: ['transform'],
            version: 1,
            subtitle: '={{$parameter["operation"]}}',
            description: 'AI-powered assistant for analyzing and optimizing N8N workflows',
            defaults: {
                name: 'AI Assistant',
            },
            inputs: ['main'],
            outputs: ['main'],
            credentials: [
                {
                    name: 'openRouterApi',
                    required: true,
                },
            ],
            properties: [
                {
                    displayName: 'Model',
                    name: 'openRouterModel',
                    type: 'string',
                    default: 'openai/gpt-3.5-turbo',
                    description: 'The OpenRouter model to use (e.g., openai/gpt-4, anthropic/claude-2, google/gemini-pro)',
                },
                {
                    displayName: 'Operation',
                    name: 'operation',
                    type: 'options',
                    noDataExpression: true,
                    options: [
                        {
                            name: 'Analyze Workflow',
                            value: 'analyzeWorkflow',
                            description: 'Analyze the current workflow structure and provide insights',
                            action: 'Analyze workflow structure and provide insights',
                        },
                        {
                            name: 'Optimize Workflow',
                            value: 'optimizeWorkflow',
                            description: 'Suggest optimizations for the current workflow',
                            action: 'Suggest workflow optimizations',
                        },
                        {
                            name: 'Explain Node',
                            value: 'explainNode',
                            description: 'Explain how a specific node works',
                            action: 'Explain how a node works',
                        },
                        {
                            name: 'Generate Workflow',
                            value: 'generateWorkflow',
                            description: 'Generate a workflow based on a description',
                            action: 'Generate a workflow based on description',
                        },
                        {
                            name: 'Ask Question',
                            value: 'askQuestion',
                            description: 'Ask a question about N8N functionality',
                            action: 'Answer a question about N8N',
                        },
                    ],
                    default: 'analyzeWorkflow',
                },
                {
                    displayName: 'Workflow ID',
                    name: 'workflowId',
                    type: 'string',
                    default: '',
                    required: true,
                    displayOptions: {
                        show: {
                            operation: ['analyzeWorkflow', 'optimizeWorkflow'],
                        },
                    },
                    description: 'ID of the workflow to analyze',
                },
                {
                    displayName: 'Node Type',
                    name: 'nodeType',
                    type: 'string',
                    default: '',
                    required: true,
                    displayOptions: {
                        show: {
                            operation: ['explainNode'],
                        },
                    },
                    description: 'Type of node to explain (e.g., "HTTP Request", "Function")',
                },
                {
                    displayName: 'Workflow Description',
                    name: 'workflowDescription',
                    type: 'string',
                    typeOptions: {
                        rows: 4,
                    },
                    default: '',
                    required: true,
                    displayOptions: {
                        show: {
                            operation: ['generateWorkflow'],
                        },
                    },
                    description: 'Description of the workflow to generate',
                },
                {
                    displayName: 'Question',
                    name: 'question',
                    type: 'string',
                    typeOptions: {
                        rows: 4,
                    },
                    default: '',
                    required: true,
                    displayOptions: {
                        show: {
                            operation: ['askQuestion'],
                        },
                    },
                    description: 'Question about N8N functionality',
                },
                {
                    displayName: 'Include Detailed Analysis',
                    name: 'includeDetailedAnalysis',
                    type: 'boolean',
                    default: true,
                    description: 'Whether to include detailed analysis in the response',
                },
            ],
        };
    }
    async execute() {
        const items = this.getInputData();
        const returnData = [];
        await this.getCredentials('openRouterApi');
        for (let i = 0; i < items.length; i++) {
            try {
                const operation = this.getNodeParameter('operation', i);
                const openRouterModel = this.getNodeParameter('openRouterModel', i);
                const includeDetailedAnalysis = this.getNodeParameter('includeDetailedAnalysis', i);
                let prompt = '';
                let systemPrompt = '';
                let result = {};
                switch (operation) {
                    case 'analyzeWorkflow': {
                        const workflowId = this.getNodeParameter('workflowId', i);
                        const workflowData = await workflowHelper_1.WorkflowHelper.getWorkflowData(workflowId, this);
                        systemPrompt = 'You are an AI assistant specialized in analyzing n8n workflows. Provide insights about workflow structure, potential issues, and best practices.';
                        prompt = `Analyze the following n8n workflow and provide insights:\n\n${JSON.stringify(workflowData, null, 2)}`;
                        if (!includeDetailedAnalysis) {
                            prompt += '\n\nProvide a concise summary only.';
                        }
                        result = await openAiHelper_1.OpenAiHelper.callOpenAiApi(systemPrompt, prompt, openRouterModel, this);
                        break;
                    }
                    case 'optimizeWorkflow': {
                        const workflowId = this.getNodeParameter('workflowId', i);
                        const workflowData = await workflowHelper_1.WorkflowHelper.getWorkflowData(workflowId, this);
                        systemPrompt = 'You are an AI assistant specialized in optimizing n8n workflows. Suggest improvements for performance, reliability, and maintainability.';
                        prompt = `Suggest optimizations for the following n8n workflow:\n\n${JSON.stringify(workflowData, null, 2)}`;
                        if (!includeDetailedAnalysis) {
                            prompt += '\n\nProvide a concise list of optimizations only.';
                        }
                        result = await openAiHelper_1.OpenAiHelper.callOpenAiApi(systemPrompt, prompt, openRouterModel, this);
                        break;
                    }
                    case 'explainNode': {
                        const nodeType = this.getNodeParameter('nodeType', i);
                        systemPrompt = 'You are an AI assistant specialized in explaining n8n nodes. Provide detailed explanations of how nodes work and their use cases.';
                        prompt = `Explain how the "${nodeType}" node works in n8n. Include its purpose, common use cases, and important parameters.`;
                        if (includeDetailedAnalysis) {
                            prompt += '\n\nPlease provide a comprehensive explanation with examples.';
                        }
                        result = await openAiHelper_1.OpenAiHelper.callOpenAiApi(systemPrompt, prompt, openRouterModel, this);
                        break;
                    }
                    case 'generateWorkflow': {
                        const workflowDescription = this.getNodeParameter('workflowDescription', i);
                        systemPrompt = 'You are an AI assistant specialized in generating n8n workflows. Create workflow JSON based on natural language descriptions.';
                        prompt = `Generate an n8n workflow based on this description:\n\n${workflowDescription}\n\nProvide the workflow in JSON format that can be imported into n8n.`;
                        result = await openAiHelper_1.OpenAiHelper.callOpenAiApi(systemPrompt, prompt, openRouterModel, this);
                        break;
                    }
                    case 'askQuestion': {
                        const question = this.getNodeParameter('question', i);
                        systemPrompt = 'You are an AI assistant specialized in n8n. Answer questions about n8n functionality, nodes, workflows, and best practices.';
                        prompt = question;
                        result = await openAiHelper_1.OpenAiHelper.callOpenAiApi(systemPrompt, prompt, openRouterModel, this);
                        break;
                    }
                    default:
                        throw new n8n_workflow_1.NodeOperationError(this.getNode(), `The operation "${operation}" is not supported!`);
                }
                const newItem = {
                    json: {
                        operation,
                        result,
                        openRouterModel,
                    },
                    pairedItem: { item: i },
                };
                returnData.push(newItem);
            }
            catch (error) {
                if (this.continueOnFail()) {
                    returnData.push({
                        json: {
                            error: error.message,
                        },
                        pairedItem: { item: i },
                    });
                    continue;
                }
                throw error;
            }
        }
        return [returnData];
    }
}
exports.N8nAiAssistantNode = N8nAiAssistantNode;
//# sourceMappingURL=N8nAiAssistant.js.map