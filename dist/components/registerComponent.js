"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerComponent = void 0;
const aiAssistantStore_1 = require("../store/aiAssistantStore");
function registerComponent(uiExtension) {
    uiExtension.registerComponent('n8n-ai-assistant', {
        properties: {
            name: 'n8n-ai-assistant',
            workflowsView: true,
            nodeViewAppended: true,
        },
        async setup(props) {
            const { default: AiAssistant } = await Promise.resolve().then(() => __importStar(require('./AiAssistant.vue')));
            return AiAssistant;
        },
    });
    uiExtension.registerWorkflowToolbarButton({
        name: 'ai-assistant-button',
        properties: {
            title: 'AI Assistant',
            icon: 'robot',
            position: 'right',
        },
        async onClick(context) {
            console.log('AI Assistant button clicked');
            try {
                const notification = document.createElement('div');
                notification.textContent = 'AI Assistant Button Clicked!';
                notification.style.position = 'fixed';
                notification.style.top = '20px';
                notification.style.left = '50%';
                notification.style.transform = 'translateX(-50%)';
                notification.style.backgroundColor = '#4CAF50';
                notification.style.color = 'white';
                notification.style.padding = '15px';
                notification.style.borderRadius = '5px';
                notification.style.zIndex = '10000';
                notification.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
                document.body.appendChild(notification);
                setTimeout(() => {
                    document.body.removeChild(notification);
                }, 3000);
            }
            catch (e) {
                console.error('Error showing notification:', e);
            }
            const store = context.$store;
            console.log('Store object:', store);
            try {
                const isVisible = store.getters['aiAssistant/isAiAssistantVisible'];
                console.log('Current visibility state:', isVisible);
                store.commit('aiAssistant/setAiAssistantVisible', !isVisible);
                console.log('Visibility toggled to:', !isVisible);
            }
            catch (error) {
                console.error('Error toggling AI Assistant visibility:', error);
            }
        },
    });
    uiExtension.registerNodeContextMenuEntry({
        id: 'ai-assistant-analyze-node',
        label: 'Analyze with AI',
        icon: 'brain',
        async onClick(nodeUi, context) {
            const store = context.$store;
            store.dispatch('aiAssistant/analyzeNodeWithAi', {
                nodeId: nodeUi.id,
                nodeName: nodeUi.name,
                nodeType: nodeUi.type,
            });
        },
    });
    uiExtension.registerVuexStoreModule({
        namespaced: true,
        name: 'ui',
        ...aiAssistantStore_1.aiAssistantStore,
        getters: {
            ...aiAssistantStore_1.aiAssistantStore.getters,
            isAiAssistantVisible: (state) => state.aiAssistantVisible || false,
            getAiAssistantState: (state) => state.aiAssistantState || {},
        },
        mutations: {
            ...aiAssistantStore_1.aiAssistantStore.mutations,
            setAiAssistantVisible(state, visible) {
                state.aiAssistantVisible = visible;
            },
            setAiAssistantState(state, aiState) {
                state.aiAssistantState = { ...state.aiAssistantState, ...aiState };
            },
        },
        actions: {
            async analyzeNodeWithAi({ commit, state }, nodeData) {
                commit('setAiAssistantVisible', true);
                commit('setAiAssistantState', {
                    action: 'analyzeNode',
                    nodeData,
                });
            },
            async analyzeWorkflowWithAi({ commit, state }) {
                commit('setAiAssistantVisible', true);
                commit('setAiAssistantState', {
                    action: 'analyzeWorkflow',
                });
            },
        },
    });
}
exports.registerComponent = registerComponent;
//# sourceMappingURL=registerComponent.js.map