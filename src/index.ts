import { INodeType, ICredentialType } from 'n8n-workflow';
import { N8nAiAssistantNode } from './nodes/N8nAiAssistant';
import { OpenAiApi } from './credentials/OpenAiApi';
import { OpenRouterApi } from './credentials/OpenRouterApi';
import { registerComponent } from './components/registerComponent';
import { aiAssistantStore } from './store/aiAssistantStore';

// Export the nodes and credentials
export const nodeTypes: INodeType[] = [
  new N8nAiAssistantNode(),
];

export const credentialTypes: ICredentialType[] = [
  new OpenAiApi(),
  new OpenRouterApi(),
];

// Add a very obvious alert for debugging
const showDebugAlert = () => {
  try {
    // This will create a visible alert in the browser immediately
    alert('N8N AI Assistant Extension Loaded!');
    
    // Also create a floating div that's impossible to miss
    const debugDiv = document.createElement('div');
    debugDiv.innerHTML = '<h1>N8N AI EXTENSION LOADED</h1>';
    debugDiv.style.position = 'fixed';
    debugDiv.style.top = '10px';
    debugDiv.style.left = '10px';
    debugDiv.style.backgroundColor = 'red';
    debugDiv.style.color = 'white';
    debugDiv.style.padding = '20px';
    debugDiv.style.zIndex = '999999';
    debugDiv.style.border = '5px solid black';
    document.body.appendChild(debugDiv);
  } catch (e) {
    console.error('Error showing debug alert:', e);
  }
};

// Export the component registration function
export const registerCustomComponents = (uiExtension: any) => {
  console.log('N8N AI Assistant: Registering custom components');
  showDebugAlert(); // Show the debug alert
  
  // Register the store module
  if (uiExtension.store) {
    console.log('N8N AI Assistant: Store object found, registering aiAssistant module');
    try {
      uiExtension.store.registerModule('aiAssistant', aiAssistantStore);
      console.log('N8N AI Assistant: Store module registered successfully');
    } catch (error) {
      console.error('N8N AI Assistant: Error registering store module:', error);
    }
  } else {
    console.warn('N8N AI Assistant: No store object found in uiExtension');
  }
  
  // Register UI components
  console.log('N8N AI Assistant: Registering UI components');
  registerComponent(uiExtension);
  console.log('N8N AI Assistant: UI components registered');
};
