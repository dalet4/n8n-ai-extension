import { INode } from 'n8n-workflow';
import { aiAssistantStore } from '../store/aiAssistantStore';

// This is the function that registers our UI components with N8N
export function registerComponent(uiExtension: any) {
  // Register the AI Assistant component
  uiExtension.registerComponent('n8n-ai-assistant', {
    properties: {
      name: 'n8n-ai-assistant',
      workflowsView: true, // Show in workflows view
      nodeViewAppended: true, // Append to node view
    },
    async setup(props: any) {
      // Import the component dynamically
      const { default: AiAssistant } = await import('./AiAssistant.vue');
      return AiAssistant;
    },
  });
  
  // Register workflow toolbar button
  uiExtension.registerWorkflowToolbarButton({
    name: 'ai-assistant-button',
    properties: {
      title: 'AI Assistant',
      icon: 'robot',
      position: 'right',
    },
    async onClick(context: any) {
      // Toggle the assistant visibility
      console.log('AI Assistant button clicked');
      
      // Show a visible notification that the button was clicked
      try {
        // Create a temporary notification element
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
        
        // Remove after 3 seconds
        setTimeout(() => {
          document.body.removeChild(notification);
        }, 3000);
      } catch (e) {
        console.error('Error showing notification:', e);
      }
      
      const store = context.$store;
      console.log('Store object:', store);
      
      try {
        const isVisible = store.getters['aiAssistant/isAiAssistantVisible'];
        console.log('Current visibility state:', isVisible);
        store.commit('aiAssistant/setAiAssistantVisible', !isVisible);
        console.log('Visibility toggled to:', !isVisible);
      } catch (error) {
        console.error('Error toggling AI Assistant visibility:', error);
      }
    },
  });
  
  // Register node context menu item
  uiExtension.registerNodeContextMenuEntry({
    id: 'ai-assistant-analyze-node',
    label: 'Analyze with AI',
    icon: 'brain',
    async onClick(nodeUi: INode, context: any) {
      // Trigger AI analysis for the specific node
      const store = context.$store;
      store.dispatch('aiAssistant/analyzeNodeWithAi', {
        nodeId: nodeUi.id,
        nodeName: nodeUi.name,
        nodeType: nodeUi.type,
      });
    },
  });
  
  // Register Vuex store module for the AI Assistant
  uiExtension.registerVuexStoreModule({
    namespaced: true,
    name: 'ui',
    ...aiAssistantStore,
    getters: {
      ...aiAssistantStore.getters,
      isAiAssistantVisible: (state: any) => state.aiAssistantVisible || false,
      getAiAssistantState: (state: any) => state.aiAssistantState || {},
    },
    mutations: {
      ...aiAssistantStore.mutations,
      setAiAssistantVisible(state: any, visible: boolean) {
        state.aiAssistantVisible = visible;
      },
      setAiAssistantState(state: any, aiState: any) {
        state.aiAssistantState = { ...state.aiAssistantState, ...aiState };
      },
    },
    actions: {
      async analyzeNodeWithAi({ commit, state }: any, nodeData: any) {
        // Set the assistant to visible
        commit('setAiAssistantVisible', true);
        
        // Update assistant state with the node to analyze
        commit('setAiAssistantState', {
          action: 'analyzeNode',
          nodeData,
        });
      },
      
      async analyzeWorkflowWithAi({ commit, state }: any) {
        // Set the assistant to visible
        commit('setAiAssistantVisible', true);
        
        // Update assistant state with the workflow to analyze
        commit('setAiAssistantState', {
          action: 'analyzeWorkflow',
        });
      },
    },
  });
}
