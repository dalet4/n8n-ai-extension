"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerCustomComponents = exports.credentialTypes = exports.nodeTypes = void 0;
const N8nAiAssistant_1 = require("./nodes/N8nAiAssistant");
const OpenAiApi_1 = require("./credentials/OpenAiApi");
const OpenRouterApi_1 = require("./credentials/OpenRouterApi");
const registerComponent_1 = require("./components/registerComponent");
const aiAssistantStore_1 = require("./store/aiAssistantStore");
exports.nodeTypes = [
    new N8nAiAssistant_1.N8nAiAssistantNode(),
];
exports.credentialTypes = [
    new OpenAiApi_1.OpenAiApi(),
    new OpenRouterApi_1.OpenRouterApi(),
];
const showDebugAlert = () => {
    try {
        setTimeout(() => {
            alert('N8N AI Assistant Extension Loaded!');
        }, 3000);
    }
    catch (e) {
        console.error('Error showing debug alert:', e);
    }
};
const registerCustomComponents = (uiExtension) => {
    console.log('N8N AI Assistant: Registering custom components');
    showDebugAlert();
    if (uiExtension.store) {
        console.log('N8N AI Assistant: Store object found, registering aiAssistant module');
        try {
            uiExtension.store.registerModule('aiAssistant', aiAssistantStore_1.aiAssistantStore);
            console.log('N8N AI Assistant: Store module registered successfully');
        }
        catch (error) {
            console.error('N8N AI Assistant: Error registering store module:', error);
        }
    }
    else {
        console.warn('N8N AI Assistant: No store object found in uiExtension');
    }
    console.log('N8N AI Assistant: Registering UI components');
    (0, registerComponent_1.registerComponent)(uiExtension);
    console.log('N8N AI Assistant: UI components registered');
};
exports.registerCustomComponents = registerCustomComponents;
//# sourceMappingURL=index.js.map