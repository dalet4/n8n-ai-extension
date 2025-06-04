"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkflowHelper = void 0;
class WorkflowHelper {
    static async getWorkflowData(workflowId, executeFunctions) {
        try {
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
        }
        catch (error) {
            throw new Error(`Failed to fetch workflow data: ${error.message}`);
        }
    }
    static analyzeWorkflow(workflowData) {
        const { id, name, active, nodes, connections } = workflowData;
        const nodeTypes = {};
        nodes.forEach((node) => {
            const type = node.type;
            nodeTypes[type] = (nodeTypes[type] || 0) + 1;
        });
        const startNodes = nodes.filter((node) => !this.hasIncomingConnections(node.name, connections));
        const endNodes = nodes.filter((node) => !this.hasOutgoingConnections(node.name, connections));
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
                startNodes: startNodes.map((node) => node.name),
                endNodes: endNodes.map((node) => node.name),
                flowDepth: this.calculateFlowDepth(connections),
            },
            issues,
        };
    }
    static hasIncomingConnections(nodeName, connections) {
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
    static hasOutgoingConnections(nodeName, connections) {
        var _a, _b;
        return !!((_b = (_a = connections[nodeName]) === null || _a === void 0 ? void 0 : _a.main) === null || _b === void 0 ? void 0 : _b.length);
    }
    static calculateFlowDepth(connections) {
        return Object.keys(connections).length;
    }
    static identifyPotentialIssues(nodes, connections) {
        const issues = [];
        const nodesWithoutErrorHandling = nodes.filter((node) => {
            var _a;
            const needsErrorHandling = ['httpRequest', 'function', 'executeCommand'].some(type => node.type.toLowerCase().includes(type));
            if (!needsErrorHandling)
                return false;
            const nodeConnections = connections[node.name];
            return !((_a = nodeConnections === null || nodeConnections === void 0 ? void 0 : nodeConnections.error) === null || _a === void 0 ? void 0 : _a.length);
        });
        if (nodesWithoutErrorHandling.length > 0) {
            issues.push(`${nodesWithoutErrorHandling.length} nodes might benefit from error handling`);
        }
        const httpNodes = nodes.filter((node) => node.type.toLowerCase().includes('httprequest'));
        if (httpNodes.length > 5) {
            issues.push('Workflow contains many HTTP Request nodes, consider batching requests');
        }
        return issues;
    }
}
exports.WorkflowHelper = WorkflowHelper;
//# sourceMappingURL=workflowHelper.js.map