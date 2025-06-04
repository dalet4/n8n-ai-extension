import { IExecuteFunctions } from 'n8n-workflow';

/**
 * Helper functions for working with N8N workflows
 */
export class WorkflowHelper {
  /**
   * Fetches workflow data from the N8N API
   * @param workflowId - ID of the workflow to fetch
   * @param executeFunctions - IExecuteFunctions instance from the node
   * @returns The workflow data
   */
  static async getWorkflowData(workflowId: string, executeFunctions: IExecuteFunctions): Promise<any> {
    try {
      // In a real implementation, this would use the N8N API to fetch the workflow
      // For now, we'll return a placeholder structure
      
      // Example of how to make a real API call (uncomment and adapt when ready):
      /*
      const response = await executeFunctions.helpers.httpRequest({
        method: 'GET',
        url: `https://your-n8n-instance/api/v1/workflows/${workflowId}`,
        headers: {
          'X-N8N-API-KEY': 'your-api-key',
        },
      });
      return response;
      */
      
      // Return placeholder data for now
      return {
        id: workflowId,
        name: 'Example Workflow',
        active: true,
        nodes: [
          {
            id: 'node1',
            name: 'Start',
            type: 'n8n-nodes-base.start',
            position: [100, 300],
            parameters: {},
          },
          {
            id: 'node2',
            name: 'HTTP Request',
            type: 'n8n-nodes-base.httpRequest',
            position: [300, 300],
            parameters: {
              url: 'https://example.com/api',
              method: 'GET',
            },
          },
          {
            id: 'node3',
            name: 'Set',
            type: 'n8n-nodes-base.set',
            position: [500, 300],
            parameters: {
              values: {
                number: [
                  {
                    name: 'data',
                    value: '={{ $json.result }}',
                  },
                ],
              },
            },
          },
        ],
        connections: {
          Start: {
            main: [
              [
                {
                  node: 'HTTP Request',
                  type: 'main',
                  index: 0,
                },
              ],
            ],
          },
          'HTTP Request': {
            main: [
              [
                {
                  node: 'Set',
                  type: 'main',
                  index: 0,
                },
              ],
            ],
          },
        },
      };
    } catch (error) {
      throw new Error(`Failed to fetch workflow data: ${error.message}`);
    }
  }

  /**
   * Analyzes a workflow and extracts key information
   * @param workflowData - The workflow data to analyze
   * @returns Analysis of the workflow
   */
  static analyzeWorkflow(workflowData: any): any {
    // Extract basic workflow info
    const { id, name, active, nodes, connections } = workflowData;
    
    // Count node types
    const nodeTypes: Record<string, number> = {};
    nodes.forEach((node: any) => {
      const type = node.type;
      nodeTypes[type] = (nodeTypes[type] || 0) + 1;
    });
    
    // Analyze workflow structure
    const startNodes = nodes.filter((node: any) => !this.hasIncomingConnections(node.name, connections));
    const endNodes = nodes.filter((node: any) => !this.hasOutgoingConnections(node.name, connections));
    
    // Check for potential issues
    const issues = this.identifyPotentialIssues(nodes, connections);
    
    return {
      summary: {
        id,
        name,
        active,
        nodeCount: nodes.length,
        nodeTypes,
      },
      structure: {
        startNodes: startNodes.map((node: any) => node.name),
        endNodes: endNodes.map((node: any) => node.name),
        flowDepth: this.calculateFlowDepth(connections),
      },
      issues,
    };
  }
  
  /**
   * Checks if a node has incoming connections
   * @param nodeName - Name of the node to check
   * @param connections - Workflow connections
   * @returns Whether the node has incoming connections
   */
  private static hasIncomingConnections(nodeName: string, connections: any): boolean {
    for (const sourceNode in connections) {
      const outputs = connections[sourceNode].main || [];
      for (const output of outputs) {
        for (const connection of output) {
          if (connection.node === nodeName) {
            return true;
          }
        }
      }
    }
    return false;
  }
  
  /**
   * Checks if a node has outgoing connections
   * @param nodeName - Name of the node to check
   * @param connections - Workflow connections
   * @returns Whether the node has outgoing connections
   */
  private static hasOutgoingConnections(nodeName: string, connections: any): boolean {
    return !!connections[nodeName]?.main?.length;
  }
  
  /**
   * Calculates the maximum depth of the workflow
   * @param connections - Workflow connections
   * @returns The maximum flow depth
   */
  private static calculateFlowDepth(connections: any): number {
    // This is a simplified implementation
    // A real implementation would do a proper graph traversal
    return Object.keys(connections).length;
  }
  
  /**
   * Identifies potential issues in the workflow
   * @param nodes - Workflow nodes
   * @param connections - Workflow connections
   * @returns List of potential issues
   */
  private static identifyPotentialIssues(nodes: any[], connections: any): string[] {
    const issues: string[] = [];
    
    // Check for nodes without error handling
    const nodesWithoutErrorHandling = nodes.filter((node: any) => {
      // Check if this node type typically needs error handling
      const needsErrorHandling = ['httpRequest', 'function', 'executeCommand'].some(type => 
        node.type.toLowerCase().includes(type)
      );
      
      if (!needsErrorHandling) return false;
      
      // Check if it has error connections
      const nodeConnections = connections[node.name];
      return !nodeConnections?.error?.length;
    });
    
    if (nodesWithoutErrorHandling.length > 0) {
      issues.push(`${nodesWithoutErrorHandling.length} nodes might benefit from error handling`);
    }
    
    // Check for potentially inefficient patterns
    // This is just an example - real implementation would be more sophisticated
    const httpNodes = nodes.filter((node: any) => node.type.toLowerCase().includes('httprequest'));
    if (httpNodes.length > 5) {
      issues.push('Workflow contains many HTTP Request nodes, consider batching requests');
    }
    
    return issues;
  }
}
