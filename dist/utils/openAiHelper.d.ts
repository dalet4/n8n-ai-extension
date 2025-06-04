import { IExecuteFunctions } from 'n8n-workflow';
export declare class OpenAiHelper {
    static callOpenAiApi(systemPrompt: string, userPrompt: string, model: string, executeFunctions: IExecuteFunctions): Promise<string>;
    static callOpenAiDirectApi(systemPrompt: string, userPrompt: string, model: string, executeFunctions: IExecuteFunctions): Promise<string>;
    static callOpenRouterApi(systemPrompt: string, userPrompt: string, model: string, executeFunctions: IExecuteFunctions): Promise<string>;
    static generateAnalysisResponse(prompt: string): string;
    static generateOptimizationResponse(prompt: string): string;
    static generateExplanationResponse(prompt: string): string;
    static generateWorkflowResponse(prompt: string): string;
    static generateGeneralResponse(prompt: string): string;
}
