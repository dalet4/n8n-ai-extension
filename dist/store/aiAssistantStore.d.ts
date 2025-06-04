export declare const aiAssistantStore: {
    namespaced: boolean;
    state: {
        isAiAssistantVisible: boolean;
        selectedNodeId: any;
        selectedNodeName: any;
        selectedNodeType: any;
        analysisInProgress: boolean;
        messages: any[];
    };
    mutations: {
        setAiAssistantVisible(state: any, visible: boolean): void;
        setSelectedNode(state: any, nodeData: any): void;
        setAnalysisInProgress(state: any, inProgress: boolean): void;
        addMessage(state: any, message: any): void;
        clearMessages(state: any): void;
    };
    actions: {
        toggleAiAssistant({ commit, state }: any): void;
        analyzeNodeWithAi({ commit, state }: any, nodeData: any): void;
        analyzeWorkflowWithAi({ commit }: any): void;
    };
    getters: {
        isAiAssistantVisible: (state: any) => any;
        selectedNode: (state: any) => {
            id: any;
            name: any;
            type: any;
        };
        analysisInProgress: (state: any) => any;
        messages: (state: any) => any;
    };
};
