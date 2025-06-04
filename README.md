# N8N AI Assistant Extension

A sophisticated AI-powered assistant for N8N workflows featuring a floating, draggable, and resizable UI component with a premium terminal-like design.

![N8N AI Assistant](./docs/assistant-preview.png)

## Features

- **Floating UI**: Draggable, resizable assistant interface that overlays the N8N workflow editor
- **AI-Powered Analysis**: Analyze workflows, optimize performance, and get intelligent suggestions
- **Node Explanations**: Get detailed explanations of any node's functionality and use cases
- **Workflow Generation**: Generate workflow templates based on natural language descriptions
- **Context-Aware**: Understands your current workflow structure, nodes, and connections
- **Premium Design**: Terminal-like interface with glowing green text and sophisticated animations

## Installation

### Railway Deployment

1. Download the latest release zip file from the GitHub Releases page
2. Set the following environment variables in your Railway N8N deployment:
   ```
   N8N_CUSTOM_EXTENSIONS=true
   N8N_CUSTOM_EXTENSIONS_URLS=https://github.com/yourusername/n8n-ai-extension/releases/download/v1.0.0/n8n-ai-extension.zip
   ```
3. Restart your N8N instance

### Local Development

1. Clone this repository:
   ```bash
   git clone https://github.com/yourusername/n8n-ai-extension.git
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Build the extension:
   ```bash
   npm run build
   ```

4. Set environment variables and start n8n:
   ```bash
   export N8N_CUSTOM_EXTENSIONS=true
   export N8N_CUSTOM_EXTENSIONS_URLS=/path/to/n8n-ai-extension.zip
   n8n start
   ```
   ```

2. Restart your n8n instance to load the extension.

## Usage

### AI Assistant Interface

The AI Assistant appears as a floating window in the N8N workflow editor. You can:

- **Drag** the assistant by its header to reposition it
- **Resize** using the corner handles
- **Minimize/Maximize** with the minimize button
- **Close** with the close button (reopen using the toolbar button)

### Quick Actions

The assistant provides quick action buttons for common tasks:

- **Analyze Workflow**: Get insights about your current workflow structure
- **Optimize**: Receive optimization suggestions for your workflow
- **Explain Node**: Get detailed explanation of the selected node
- **Help**: View assistant documentation and capabilities

### Chat Interface

You can interact with the assistant through the chat interface:

1. Type your question or request in the input field
2. Press Enter or click Send
3. The assistant will process your request and provide a response

### Example Queries

- "Analyze my current workflow for potential issues"
- "How can I optimize this workflow for better performance?"
- "Explain how the HTTP Request node works"
- "Generate a workflow that fetches data from an API and sends it to Slack"
- "What's the best way to handle errors in my workflow?"

## Configuration

The AI Assistant uses OpenAI's API for generating responses. You'll need to configure your API credentials:

1. Go to N8N Credentials
2. Add new "OpenAI API" credentials
3. Enter your OpenAI API key

## Development

### Project Structure

- `src/nodes/` - Contains the N8N node implementation
- `src/credentials/` - Contains the OpenAI API credentials implementation
- `src/components/` - Contains the Vue components for the UI
- `src/components/AiAssistant.vue` - Main assistant UI component
- `src/components/registerComponent.ts` - Registers UI components with N8N

### Building

```bash
npm run build
```

### Linting

```bash
npm run lint
```

## License

MIT

## Credits

Developed by [Your Name]
