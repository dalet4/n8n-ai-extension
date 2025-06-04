import { IExecuteFunctions } from 'n8n-workflow';
export declare class WorkflowHelper {
    static getWorkflowData(workflowId: string, executeFunctions: IExecuteFunctions): Promise<any>;
    static analyzeWorkflow(workflowData: any): any;
    private static hasIncomingConnections;
    private static hasOutgoingConnections;
    private static calculateFlowDepth;
    private static identifyPotentialIssues;
}
