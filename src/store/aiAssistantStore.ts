/**
 * Vuex store module for the AI Assistant
 */

export const aiAssistantStore = {
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
    setAiAssistantVisible(state: any, visible: boolean) {
      state.isAiAssistantVisible = visible;
    },
    setSelectedNode(state: any, nodeData: any) {
      state.selectedNodeId = nodeData.nodeId;
      state.selectedNodeName = nodeData.nodeName;
      state.selectedNodeType = nodeData.nodeType;
    },
    setAnalysisInProgress(state: any, inProgress: boolean) {
      state.analysisInProgress = inProgress;
    },
    addMessage(state: any, message: any) {
      state.messages.push(message);
    },
    clearMessages(state: any) {
      state.messages = [];
    },
  },
  actions: {
    toggleAiAssistant({ commit, state }: any) {
      commit('setAiAssistantVisible', !state.isAiAssistantVisible);
    },
    analyzeNodeWithAi({ commit, state }: any, nodeData: any) {
      commit('setSelectedNode', nodeData);
      commit('setAiAssistantVisible', true);
      // Add a system message indicating node analysis
      commit('addMessage', {
        role: 'system',
        content: `Analyzing node: ${nodeData.nodeName} (${nodeData.nodeType})`,
      });
    },
    analyzeWorkflowWithAi({ commit }: any) {
      commit('setAiAssistantVisible', true);
      // Add a system message indicating workflow analysis
      commit('addMessage', {
        role: 'system',
        content: 'Analyzing current workflow...',
      });
    },
  },
  getters: {
    isAiAssistantVisible: (state: any) => state.isAiAssistantVisible,
    selectedNode: (state: any) => ({
      id: state.selectedNodeId,
      name: state.selectedNodeName,
      type: state.selectedNodeType,
    }),
    analysisInProgress: (state: any) => state.analysisInProgress,
    messages: (state: any) => state.messages,
  },
};
