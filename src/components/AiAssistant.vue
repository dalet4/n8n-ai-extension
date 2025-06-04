<template>
  <div 
    class="n8n-ai-assistant" 
    :class="{ 'minimized': minimized }"
    v-show="visible"
    ref="assistantContainer"
  >
    <!-- Assistant Header -->
    <div class="assistant-header" @mousedown="startDrag">
      <div class="assistant-title">N8N AI Assistant</div>
      <div class="assistant-controls">
        <button class="assistant-button minimize-button" @click="toggleMinimize">
          {{ minimized ? '□' : '_' }}
        </button>
        <button class="assistant-button close-button" @click="hide">×</button>
      </div>
    </div>
    
    <!-- Assistant Body -->
    <div class="assistant-body" v-show="!minimized">
      <!-- Messages Container -->
      <div class="assistant-messages" ref="messagesContainer">
        <div 
          v-for="(message, index) in chatMessages" 
          :key="index" 
          class="message" 
          :class="`${message.role}-message`"
        >
          <div class="message-avatar" :class="`${message.role}-avatar`"></div>
          <div class="message-content" v-html="formatMessageContent(message.content)"></div>
        </div>
        
        <!-- Typing indicator -->
        <div class="message assistant-message" v-if="isThinking">
          <div class="message-avatar assistant-avatar"></div>
          <div class="message-content">
            <div class="typing-indicator">
              <span class="typing-dot"></span>
              <span class="typing-dot"></span>
              <span class="typing-dot"></span>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Status Indicator -->
      <div class="assistant-status">
        <div class="status-indicator" :class="`status-${status}`"></div>
        <span class="status-text">{{ statusText }}</span>
      </div>
      
      <!-- Input Container -->
      <div class="assistant-input-container">
        <textarea 
          class="assistant-input" 
          placeholder="Ask about your workflow..." 
          v-model="inputMessage"
          @keydown.enter.prevent="sendMessage"
          ref="inputField"
        ></textarea>
        <button class="assistant-send-button" @click="sendMessage">Send</button>
      </div>
      
      <!-- Quick Actions -->
      <div class="assistant-quick-actions">
        <button 
          class="quick-action-button" 
          @click="analyzeWorkflow"
        >
          Analyze Workflow
        </button>
        <button 
          class="quick-action-button" 
          @click="optimizeWorkflow"
        >
          Optimize
        </button>
        <button 
          class="quick-action-button" 
          @click="explainNode"
        >
          Explain Node
        </button>
        <button 
          class="quick-action-button" 
          @click="showHelp"
        >
          Help
        </button>
      </div>
    </div>
    
    <!-- Resize Handles -->
    <div 
      v-for="direction in ['top-left', 'top-right', 'bottom-left', 'bottom-right']" 
      :key="direction"
      class="resize-handle" 
      :class="direction" 
      @mousedown="startResize($event, direction)"
    ></div>
  </div>
</template>

<script>
export default {
  name: 'AiAssistant',
  
  data() {
    return {
      visible: false,
      minimized: false,
      chatMessages: [],
      inputMessage: '',
      status: 'ready',
      statusText: 'Ready',
      isThinking: false,
      
      // Dragging state
      isDragging: false,
      dragOffset: { x: 0, y: 0 },
      
      // Resizing state
      isResizing: false,
      resizeDirection: '',
      initialSize: { width: 0, height: 0 },
      initialPosition: { x: 0, y: 0 },
      initialMouse: { x: 0, y: 0 },
      
      // Workflow context
      workflowContext: null,
      
      // API settings
      apiKey: '',
      model: 'gpt-4',
    };
  },
  
  mounted() {
    console.log('N8N AI Assistant: Component mounted');
    
    // Initialize the assistant
    this.initialize();
    
    // Add event listeners for drag and resize
    document.addEventListener('mousemove', this.onMouseMove);
    document.addEventListener('mouseup', this.onMouseUp);
    
    // Listen for store changes
    console.log('N8N AI Assistant: Setting up store subscription');
    this.$store.subscribe((mutation, state) => {
      console.log('N8N AI Assistant: Store mutation detected:', mutation.type);
      
      if (mutation.type === 'aiAssistant/setAiAssistantVisible') {
        console.log('N8N AI Assistant: Visibility mutation detected');
        console.log('N8N AI Assistant: State structure:', state);
        
        try {
          const isVisible = state.aiAssistant && state.aiAssistant.isAiAssistantVisible;
          console.log('N8N AI Assistant: Setting visibility to', isVisible);
          this.visible = isVisible;
        } catch (error) {
          console.error('N8N AI Assistant: Error setting visibility:', error);
        }
      }
      
      if (mutation.type === 'aiAssistant/setSelectedNode') {
        this.analyzeSpecificNode({
          nodeId: state.aiAssistant.selectedNodeId,
          nodeName: state.aiAssistant.selectedNodeName,
          nodeType: state.aiAssistant.selectedNodeType
        });
      }
    });
  },
  
  beforeDestroy() {
    // Remove event listeners
    document.removeEventListener('mousemove', this.onMouseMove);
    document.removeEventListener('mouseup', this.onMouseUp);
  },
  
  methods: {
    // Initialize the assistant
    initialize() {
      // Position the assistant in the bottom right corner by default
      const container = this.$refs.assistantContainer;
      if (container) {
        container.style.right = '20px';
        container.style.bottom = '20px';
      }
      
      // Add welcome message
      this.addWelcomeMessage();
      
      // Get current workflow context
      this.getWorkflowContext();
      
      // Show the assistant if it was previously visible
      this.visible = this.$store.getters['ui/isAiAssistantVisible'];
    },
    
    // Add welcome message
    addWelcomeMessage() {
      const welcomeMessage = {
        role: 'assistant',
        content: 'Welcome to the N8N AI Assistant! I can help you build, analyze, and optimize your workflows. What would you like to do today?'
      };
      
      this.chatMessages.push(welcomeMessage);
      this.scrollToBottom();
    },
    
    // Get current workflow context
    getWorkflowContext() {
      try {
        // In a real implementation, this would get the workflow from the N8N store
        // For now, we'll use a placeholder
        this.workflowContext = {
          id: 'current-workflow',
          name: 'Current Workflow',
          nodes: [],
          connections: {}
        };
      } catch (error) {
        console.error('Error getting workflow context:', error);
      }
    },
    
    // Handle state changes from the store
    handleStateChange(state) {
      if (!state) return;
      
      if (state.action === 'analyzeNode' && state.nodeData) {
        this.analyzeSpecificNode(state.nodeData);
      }
      
      if (state.action === 'analyzeWorkflow') {
        this.analyzeWorkflow();
      }
    },
    
    // Toggle minimize state
    toggleMinimize() {
      this.minimized = !this.minimized;
    },
    
    // Hide the assistant
    hide() {
      this.visible = false;
      this.$store.commit('ui/setAiAssistantVisible', false);
    },
    
    // Start dragging
    startDrag(e) {
      if (e.target.closest('.assistant-button')) return;
      
      this.isDragging = true;
      
      const rect = this.$refs.assistantContainer.getBoundingClientRect();
      this.dragOffset = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };
      
      e.preventDefault();
    },
    
    // Start resizing
    startResize(e, direction) {
      this.isResizing = true;
      this.resizeDirection = direction;
      
      const rect = this.$refs.assistantContainer.getBoundingClientRect();
      this.initialSize = {
        width: rect.width,
        height: rect.height
      };
      
      this.initialPosition = {
        x: rect.left,
        y: rect.top
      };
      
      this.initialMouse = {
        x: e.clientX,
        y: e.clientY
      };
      
      e.preventDefault();
    },
    
    // Handle mouse move for drag and resize
    onMouseMove(e) {
      if (this.isDragging) {
        this.drag(e);
      }
      
      if (this.isResizing) {
        this.resize(e);
      }
    },
    
    // Handle mouse up for drag and resize
    onMouseUp() {
      this.isDragging = false;
      this.isResizing = false;
    },
    
    // Handle dragging
    drag(e) {
      if (!this.isDragging) return;
      
      const container = this.$refs.assistantContainer;
      const x = e.clientX - this.dragOffset.x;
      const y = e.clientY - this.dragOffset.y;
      
      // Keep within viewport bounds
      const maxX = window.innerWidth - container.offsetWidth;
      const maxY = window.innerHeight - container.offsetHeight;
      
      const boundedX = Math.max(0, Math.min(x, maxX));
      const boundedY = Math.max(0, Math.min(y, maxY));
      
      container.style.left = `${boundedX}px`;
      container.style.top = `${boundedY}px`;
      
      // Remove right/bottom positioning if we're using left/top
      container.style.right = '';
      container.style.bottom = '';
      
      e.preventDefault();
    },
    
    // Handle resizing
    resize(e) {
      if (!this.isResizing) return;
      
      const container = this.$refs.assistantContainer;
      const dx = e.clientX - this.initialMouse.x;
      const dy = e.clientY - this.initialMouse.y;
      
      let newWidth = this.initialSize.width;
      let newHeight = this.initialSize.height;
      let newLeft = this.initialPosition.x;
      let newTop = this.initialPosition.y;
      
      // Minimum dimensions
      const minWidth = 300;
      const minHeight = 200;
      
      switch (this.resizeDirection) {
        case 'top-left':
          newWidth = Math.max(minWidth, this.initialSize.width - dx);
          newHeight = Math.max(minHeight, this.initialSize.height - dy);
          newLeft = this.initialPosition.x + (this.initialSize.width - newWidth);
          newTop = this.initialPosition.y + (this.initialSize.height - newHeight);
          break;
        case 'top-right':
          newWidth = Math.max(minWidth, this.initialSize.width + dx);
          newHeight = Math.max(minHeight, this.initialSize.height - dy);
          newTop = this.initialPosition.y + (this.initialSize.height - newHeight);
          break;
        case 'bottom-left':
          newWidth = Math.max(minWidth, this.initialSize.width - dx);
          newHeight = Math.max(minHeight, this.initialSize.height + dy);
          newLeft = this.initialPosition.x + (this.initialSize.width - newWidth);
          break;
        case 'bottom-right':
          newWidth = Math.max(minWidth, this.initialSize.width + dx);
          newHeight = Math.max(minHeight, this.initialSize.height + dy);
          break;
      }
      
      container.style.width = `${newWidth}px`;
      container.style.height = `${newHeight}px`;
      container.style.left = `${newLeft}px`;
      container.style.top = `${newTop}px`;
      
      e.preventDefault();
    },
    
    // Send a message to the AI
    async sendMessage() {
      const message = this.inputMessage.trim();
      if (!message) return;
      
      // Add user message to UI
      const userMessage = {
        role: 'user',
        content: message
      };
      
      this.chatMessages.push(userMessage);
      this.scrollToBottom();
      
      // Clear input field
      this.inputMessage = '';
      
      // Update status
      this.setStatus('thinking', 'Thinking...');
      this.isThinking = true;
      
      try {
        // Get AI response
        const response = await this.callAI(message);
        
        // Add AI response to UI
        const assistantMessage = {
          role: 'assistant',
          content: response
        };
        
        this.chatMessages.push(assistantMessage);
        this.scrollToBottom();
        
        // Update status
        this.setStatus('ready', 'Ready');
      } catch (error) {
        console.error('Error sending message:', error);
        
        // Add error message to UI
        const errorMessage = {
          role: 'assistant',
          content: `Error: ${error.message || 'Failed to get response from AI'}`
        };
        
        this.chatMessages.push(errorMessage);
        this.scrollToBottom();
        
        // Update status
        this.setStatus('error', 'Error');
      } finally {
        this.isThinking = false;
      }
    },
    
    // Call the AI API
    async callAI(prompt) {
      // In a real implementation, this would call the OpenAI API
      // For now, we'll return mock responses
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Return mock response based on prompt
      if (prompt.toLowerCase().includes('analyze')) {
        return 'I analyzed your workflow and found several optimization opportunities. You could reduce the number of HTTP Request nodes by combining some of them, and add error handling for more robust execution.';
      } else if (prompt.toLowerCase().includes('optimize')) {
        return 'Here are some optimization suggestions:\n\n1. Add error handling to your HTTP Request nodes\n2. Use the Split In Batches node to process large datasets\n3. Consider using the FunctionItem node instead of Function node for better performance';
      } else if (prompt.toLowerCase().includes('explain')) {
        return 'The HTTP Request node allows you to make API calls to external services. It supports various methods (GET, POST, PUT, etc.) and can handle authentication, headers, and query parameters. The response can be parsed as JSON, text, or binary data.';
      } else {
        return 'I\'m here to help you with your N8N workflows. You can ask me to analyze your workflow, suggest optimizations, explain how nodes work, or answer general questions about N8N functionality.';
      }
    },
    
    // Format message content (basic markdown-like formatting)
    formatMessageContent(content) {
      // Replace code blocks
      let formatted = content.replace(/\`\`\`([\s\S]*?)\`\`\`/g, '<pre><code>$1</code></pre>');
      
      // Replace inline code
      formatted = formatted.replace(/\`([^\`]+)\`/g, '<code>$1</code>');
      
      // Replace bold text
      formatted = formatted.replace(/\*\*([^\*]+)\*\*/g, '<strong>$1</strong>');
      
      // Replace italic text
      formatted = formatted.replace(/\*([^\*]+)\*/g, '<em>$1</em>');
      
      // Replace line breaks
      formatted = formatted.replace(/\n/g, '<br>');
      
      return formatted;
    },
    
    // Set the status indicator
    setStatus(status, text) {
      this.status = status;
      this.statusText = text;
    },
    
    // Scroll to the bottom of the messages container
    scrollToBottom() {
      this.$nextTick(() => {
        const container = this.$refs.messagesContainer;
        if (container) {
          container.scrollTop = container.scrollHeight;
        }
      });
    },
    
    // Analyze the current workflow
    analyzeWorkflow() {
      this.inputMessage = `Analyze my current workflow "${this.workflowContext?.name || 'Current Workflow'}"`;
      this.sendMessage();
    },
    
    // Analyze a specific node
    analyzeSpecificNode(nodeData) {
      this.inputMessage = `Explain how the "${nodeData.nodeName}" (${nodeData.nodeType}) node works and what it does in an n8n workflow`;
      this.sendMessage();
    },
    
    // Optimize the current workflow
    optimizeWorkflow() {
      this.inputMessage = `Suggest optimizations for my workflow "${this.workflowContext?.name || 'Current Workflow'}"`;
      this.sendMessage();
    },
    
    // Explain the currently selected node
    explainNode() {
      // In a real implementation, this would get the selected node from the N8N store
      this.inputMessage = 'Explain how the currently selected node works';
      this.sendMessage();
    },
    
    // Show help information
    showHelp() {
      const helpMessage = {
        role: 'assistant',
        content: `
**N8N AI Assistant Help**

I can help you with your N8N workflows in several ways:

- **Analyze Workflows**: I can analyze your current workflow structure and provide insights.
- **Optimize Workflows**: I can suggest optimizations to make your workflows more efficient.
- **Explain Nodes**: Select a node and ask me to explain how it works.
- **Build Workflows**: Ask me how to accomplish specific tasks with N8N.
- **Troubleshoot Issues**: Describe any problems you're having, and I'll help solve them.
- **Answer Questions**: Ask me anything about N8N functionality or best practices.

You can type your questions directly or use the quick action buttons for common tasks.
        `
      };
      
      this.chatMessages.push(helpMessage);
      this.scrollToBottom();
    }
  }
};
</script>

<style>
/* N8N AI Assistant - Styles
   Premium terminal-like UI with glowing green theme */

/* Main container */
.n8n-ai-assistant {
  position: fixed;
  width: 400px;
  height: 500px;
  background-color: rgba(0, 10, 2, 0.9);
  border: 1px solid #00ff00;
  border-radius: 8px;
  box-shadow: 0 0 20px rgba(0, 255, 0, 0.3), 0 0 40px rgba(0, 255, 0, 0.1);
  display: flex;
  flex-direction: column;
  font-family: 'Courier New', monospace;
  color: #00ff00;
  z-index: 9999;
  overflow: hidden;
  transition: all 0.3s ease;
}

/* Header */
.assistant-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 15px;
  background-color: rgba(0, 20, 0, 0.8);
  border-bottom: 1px solid #00ff00;
  cursor: move;
}

.assistant-title {
  font-weight: bold;
  font-size: 16px;
  text-shadow: 0 0 5px #00ff00;
  letter-spacing: 1px;
}

.assistant-controls {
  display: flex;
  gap: 10px;
}

.assistant-button {
  background: none;
  border: 1px solid #00ff00;
  border-radius: 3px;
  color: #00ff00;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s ease;
}

.assistant-button:hover {
  background-color: rgba(0, 255, 0, 0.2);
  box-shadow: 0 0 8px rgba(0, 255, 0, 0.5);
}

/* Body */
.assistant-body {
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow: hidden;
  padding: 10px;
}

/* Messages container */
.assistant-messages {
  flex: 1;
  overflow-y: auto;
  padding: 10px;
  display: flex;
  flex-direction: column;
  gap: 15px;
  scrollbar-width: thin;
  scrollbar-color: #00ff00 #001400;
}

.assistant-messages::-webkit-scrollbar {
  width: 6px;
}

.assistant-messages::-webkit-scrollbar-track {
  background: #001400;
}

.assistant-messages::-webkit-scrollbar-thumb {
  background-color: #00ff00;
  border-radius: 3px;
}

/* Message styling */
.message {
  display: flex;
  gap: 10px;
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.message-avatar {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  flex-shrink: 0;
}

.user-avatar {
  background-color: #002800;
  border: 1px solid #00ff00;
  position: relative;
}

.user-avatar::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 12px;
  height: 12px;
  background-color: #00ff00;
  border-radius: 50%;
  box-shadow: 0 0 8px #00ff00;
}

.assistant-avatar {
  background-color: #001400;
  border: 1px solid #00ff00;
  position: relative;
  overflow: hidden;
}

.assistant-avatar::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: 
    radial-gradient(circle at 30% 30%, #00ff00 2%, transparent 2.5%),
    radial-gradient(circle at 70% 30%, #00ff00 2%, transparent 2.5%),
    radial-gradient(circle at 50% 70%, #00ff00 2%, transparent 2.5%);
  box-shadow: 0 0 8px #00ff00;
}

.message-content {
  flex: 1;
  padding: 8px 12px;
  border-radius: 5px;
  line-height: 1.4;
  font-size: 14px;
  position: relative;
  overflow-wrap: break-word;
}

.user-message .message-content {
  background-color: rgba(0, 60, 0, 0.3);
  border: 1px solid rgba(0, 255, 0, 0.3);
}

.assistant-message .message-content {
  background-color: rgba(0, 40, 0, 0.3);
  border: 1px solid rgba(0, 255, 0, 0.5);
  text-shadow: 0 0 2px rgba(0, 255, 0, 0.5);
}

/* Code formatting */
.message-content pre {
  background-color: rgba(0, 20, 0, 0.8);
  border: 1px solid rgba(0, 255, 0, 0.3);
  border-radius: 3px;
  padding: 8px;
  overflow-x: auto;
  margin: 8px 0;
}

.message-content code {
  background-color: rgba(0, 30, 0, 0.6);
  border-radius: 3px;
  padding: 2px 4px;
  font-family: 'Courier New', monospace;
}

/* Status indicator */
.assistant-status {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 5px 10px;
  font-size: 12px;
  border-top: 1px solid rgba(0, 255, 0, 0.2);
  margin-top: 10px;
}

.status-indicator {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: #00ff00;
  position: relative;
}

.status-indicator::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background-color: rgba(0, 255, 0, 0.5);
  animation: pulse 1.5s infinite;
}

@keyframes pulse {
  0% { transform: scale(1); opacity: 1; }
  50% { transform: scale(2); opacity: 0; }
  100% { transform: scale(1); opacity: 0; }
}

.status-ready {
  background-color: #00ff00;
}

.status-thinking {
  background-color: #ffff00;
}

.status-error {
  background-color: #ff0000;
}

/* Input area */
.assistant-input-container {
  display: flex;
  gap: 10px;
  margin-top: 10px;
}

.assistant-input {
  flex: 1;
  background-color: rgba(0, 20, 0, 0.8);
  border: 1px solid #00ff00;
  border-radius: 5px;
  color: #00ff00;
  padding: 10px;
  font-family: 'Courier New', monospace;
  font-size: 14px;
  resize: none;
  height: 60px;
  outline: none;
  transition: all 0.2s ease;
}

.assistant-input:focus {
  box-shadow: 0 0 10px rgba(0, 255, 0, 0.5);
  border-color: #00ff00;
}

.assistant-input::placeholder {
  color: rgba(0, 255, 0, 0.5);
}

.assistant-send-button {
  background-color: rgba(0, 40, 0, 0.8);
  border: 1px solid #00ff00;
  border-radius: 5px;
  color: #00ff00;
  padding: 0 15px;
  cursor: pointer;
  font-family: 'Courier New', monospace;
  font-size: 14px;
  text-shadow: 0 0 5px rgba(0, 255, 0, 0.5);
  transition: all 0.2s ease;
}

.assistant-send-button:hover {
  background-color: rgba(0, 60, 0, 0.8);
  box-shadow: 0 0 10px rgba(0, 255, 0, 0.5);
}

/* Quick action buttons */
.assistant-quick-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 15px;
}

.quick-action-button {
  background-color: rgba(0, 30, 0, 0.8);
  border: 1px solid rgba(0, 255, 0, 0.5);
  border-radius: 4px;
  color: #00ff00;
  padding: 5px 10px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  text-shadow: 0 0 3px rgba(0, 255, 0, 0.3);
}

.quick-action-button:hover {
  background-color: rgba(0, 50, 0, 0.8);
  box-shadow: 0 0 8px rgba(0, 255, 0, 0.4);
}

/* Resize handles */
.resize-handle {
  position: absolute;
  width: 10px;
  height: 10px;
  background-color: rgba(0, 255, 0, 0.5);
  border: 1px solid #00ff00;
  border-radius: 50%;
  z-index: 10;
}

.top-left {
  top: -5px;
  left: -5px;
  cursor: nwse-resize;
}

.top-right {
  top: -5px;
  right: -5px;
  cursor: nesw-resize;
}

.bottom-left {
  bottom: -5px;
  left: -5px;
  cursor: nesw-resize;
}

.bottom-right {
  bottom: -5px;
  right: -5px;
  cursor: nwse-resize;
}

/* Glowing effect on hover */
.n8n-ai-assistant:hover {
  box-shadow: 0 0 25px rgba(0, 255, 0, 0.4), 0 0 50px rgba(0, 255, 0, 0.2);
}

/* Typing animation */
.typing-indicator {
  display: inline-flex;
  align-items: center;
  gap: 3px;
}

.typing-dot {
  width: 4px;
  height: 4px;
  background-color: #00ff00;
  border-radius: 50%;
  animation: typingAnimation 1.4s infinite;
}

.typing-dot:nth-child(2) {
  animation-delay: 0.2s;
}

.typing-dot:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes typingAnimation {
  0%, 60%, 100% { transform: translateY(0); opacity: 0.5; }
  30% { transform: translateY(-4px); opacity: 1; }
}

/* Scan line effect */
.n8n-ai-assistant::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 2px;
  background-color: rgba(0, 255, 0, 0.2);
  box-shadow: 0 0 10px rgba(0, 255, 0, 0.5);
  animation: scanline 8s linear infinite;
  pointer-events: none;
  z-index: 1;
}

@keyframes scanline {
  0% { top: 0; }
  100% { top: 100%; }
}

/* Minimized state */
.n8n-ai-assistant.minimized {
  height: auto;
}
</style>
