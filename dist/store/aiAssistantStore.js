"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.aiAssistantStore = void 0;
exports.aiAssistantStore = {
    namespaced: true,
    state: {
        isAiAssistantVisible: false,
        selectedNodeId: null,
        selectedNodeName: null,
        selectedNodeType: null,
        analysisInProgress: false,
        messages: [],
    },
    mutations: {
        setAiAssistantVisible(state, visible) {
            state.isAiAssistantVisible = visible;
        },
        setSelectedNode(state, nodeData) {
            state.selectedNodeId = nodeData.nodeId;
            state.selectedNodeName = nodeData.nodeName;
            state.selectedNodeType = nodeData.nodeType;
        },
        setAnalysisInProgress(state, inProgress) {
            state.analysisInProgress = inProgress;
        },
        addMessage(state, message) {
            state.messages.push(message);
        },
        clearMessages(state) {
            state.messages = [];
        },
    },
    actions: {
        toggleAiAssistant({ commit, state }) {
            commit('setAiAssistantVisible', !state.isAiAssistantVisible);
        },
        analyzeNodeWithAi({ commit, state }, nodeData) {
            commit('setSelectedNode', nodeData);
            commit('setAiAssistantVisible', true);
            commit('addMessage', {
                role: 'system',
                content: `Analyzing node: ${nodeData.nodeName} (${nodeData.nodeType})`,
            });
        },
        analyzeWorkflowWithAi({ commit }) {
            commit('setAiAssistantVisible', true);
            commit('addMessage', {
                role: 'system',
                content: 'Analyzing current workflow...',
            });
        },
    },
    getters: {
        isAiAssistantVisible: (state) => state.isAiAssistantVisible,
        selectedNode: (state) => ({
            id: state.selectedNodeId,
            name: state.selectedNodeName,
            type: state.selectedNodeType,
        }),
        analysisInProgress: (state) => state.analysisInProgress,
        messages: (state) => state.messages,
    },
};
//# sourceMappingURL=aiAssistantStore.js.map