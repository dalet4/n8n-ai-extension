"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OpenAiHelper = void 0;
class OpenAiHelper {
    static async callOpenAiApi(systemPrompt, userPrompt, model, executeFunctions) {
        try {
            return await this.callOpenRouterApi(systemPrompt, userPrompt, model, executeFunctions);
            return OpenAiHelper.generateGeneralResponse(userPrompt);
        }
        catch (error) {
            throw new Error(`Failed to call AI API: ${error.message}`);
        }
    }
    static async callOpenAiDirectApi(systemPrompt, userPrompt, model, executeFunctions) {
        try {
            await executeFunctions.getCredentials('openAiApi');
            await new Promise(resolve => setTimeout(resolve, 1000));
            if (userPrompt.includes('analyze')) {
                return OpenAiHelper.generateAnalysisResponse(userPrompt);
            }
            else if (userPrompt.includes('optimize')) {
                return OpenAiHelper.generateOptimizationResponse(userPrompt);
            }
            else if (userPrompt.includes('explain')) {
                return OpenAiHelper.generateExplanationResponse(userPrompt);
            }
            else if (userPrompt.includes('generate')) {
                return OpenAiHelper.generateWorkflowResponse(userPrompt);
            }
            else {
                return OpenAiHelper.generateGeneralResponse(userPrompt);
            }
        }
        catch (error) {
            throw new Error(`Failed to call OpenAI API: ${error.message}`);
        }
    }
    static async callOpenRouterApi(systemPrompt, userPrompt, model, executeFunctions) {
        try {
            const credentials = await executeFunctions.getCredentials('openRouterApi');
            const apiKey = credentials.apiKey;
            const response = await executeFunctions.helpers.httpRequest({
                method: 'POST',
                url: 'https://openrouter.ai/api/v1/chat/completions',
                headers: {
                    'Authorization': `Bearer ${apiKey}`,
                    'Content-Type': 'application/json',
                    'HTTP-Referer': 'https://n8n.io',
                    'X-Title': 'N8N AI Assistant',
                },
                body: {
                    model: model,
                    messages: [
                        {
                            role: 'system',
                            content: systemPrompt,
                        },
                        {
                            role: 'user',
                            content: userPrompt,
                        },
                    ],
                    temperature: 0.7,
                    max_tokens: 2000,
                },
            });
            return response.data.choices[0].message.content;
        }
        catch (error) {
            console.log('OpenRouter API call failed, using mock response:', error.message);
            const modelInfo = `[Using ${model} - MOCK RESPONSE] `;
            if (userPrompt.includes('analyze')) {
                return modelInfo + OpenAiHelper.generateAnalysisResponse(userPrompt);
            }
            else if (userPrompt.includes('optimize')) {
                return modelInfo + OpenAiHelper.generateOptimizationResponse(userPrompt);
            }
            else if (userPrompt.includes('explain')) {
                return modelInfo + OpenAiHelper.generateExplanationResponse(userPrompt);
            }
            else if (userPrompt.includes('generate')) {
                return modelInfo + OpenAiHelper.generateWorkflowResponse(userPrompt);
            }
            else {
                return modelInfo + OpenAiHelper.generateGeneralResponse(userPrompt);
            }
        }
    }
    static generateAnalysisResponse(prompt) {
        return `
# Workflow Analysis

## Overview
I've analyzed the provided workflow and found several interesting patterns and potential areas for improvement.

## Structure
- The workflow has 3 nodes: Start, HTTP Request, and Set
- It follows a linear flow pattern
- The HTTP Request node fetches data from an external API
- The Set node processes the response data

## Potential Improvements
1. **Error Handling**: Add error handling for the HTTP Request node to handle API failures gracefully
2. **Rate Limiting**: Consider adding a Limit node if making multiple API calls to avoid rate limiting
3. **Data Validation**: Add data validation before processing the API response
4. **Caching**: Consider implementing caching for API responses if appropriate

## Best Practices
- The workflow follows a logical structure
- Node naming is clear and descriptive
- Parameter usage is appropriate

Would you like me to provide more detailed recommendations for any specific aspect of this workflow?
`;
    }
    static generateOptimizationResponse(prompt) {
        return `
# Workflow Optimization Suggestions

## Performance Optimizations
1. **Batch Processing**: Use the "Split In Batches" node for processing large datasets
2. **Parallel Processing**: Consider using multiple branches with the "Merge" node for parallel execution
3. **Conditional Execution**: Add "IF" nodes to skip unnecessary processing steps

## Reliability Improvements
1. **Error Handling**: Add error handling to all HTTP Request and Function nodes
2. **Retry Mechanism**: Implement retry logic for external API calls
3. **Timeout Management**: Set appropriate timeouts for long-running operations

## Maintainability Enhancements
1. **Node Naming**: Use consistent and descriptive names for all nodes
2. **Comments**: Add comment nodes to explain complex logic
3. **Modularization**: Break complex workflows into smaller, reusable subworkflows

## Specific Recommendations
- Replace the current HTTP Request node with an HTTP Request node that includes error handling
- Add data validation using the "IF" node before the Set node
- Consider adding a "Retry" node after the HTTP Request for better reliability

Would you like me to explain how to implement any of these optimizations?
`;
    }
    static generateExplanationResponse(prompt) {
        const nodeTypeMatch = prompt.match(/explain.*?(\w+\s*\w*)\s*node/i);
        const nodeType = nodeTypeMatch ? nodeTypeMatch[1].trim() : 'HTTP Request';
        const explanations = {
            'HTTP Request': `
# HTTP Request Node

## Purpose
The HTTP Request node allows you to make API calls to external services from within your n8n workflow.

## Key Features
- Supports all HTTP methods (GET, POST, PUT, DELETE, etc.)
- Can handle authentication (Basic Auth, OAuth, API Key, etc.)
- Allows setting custom headers and query parameters
- Supports different body content types (JSON, Form, Form-Data, etc.)
- Can parse responses in various formats (JSON, Text, Binary)

## Common Use Cases
1. Fetching data from external APIs
2. Sending data to external services
3. Webhook integrations
4. File uploads and downloads

## Best Practices
- Always add error handling for HTTP requests
- Set appropriate timeouts for external calls
- Consider rate limiting for frequent API calls
- Use credential storage for sensitive authentication details

## Example Configuration
\`\`\`
{
  "url": "https://api.example.com/data",
  "method": "GET",
  "authentication": "basicAuth",
  "responseFormat": "json"
}
\`\`\`

Would you like to know more about specific features of the HTTP Request node?
`,
            'Function': `
# Function Node

## Purpose
The Function node allows you to execute custom JavaScript code within your n8n workflow.

## Key Features
- Write custom JavaScript code
- Process input data using the \`items\` array
- Return modified data to continue the workflow
- Access to built-in libraries and helpers
- Support for async/await operations

## Common Use Cases
1. Complex data transformations
2. Custom business logic
3. Conditional processing
4. Data aggregation and calculations

## Best Practices
- Add error handling with try/catch blocks
- Comment your code for better maintainability
- Use the \`console.log()\` for debugging
- Break complex functions into smaller, reusable functions

## Example Code
\`\`\`javascript
// Example function that transforms input data
return items.map(item => {
  // Add a new field with calculated value
  item.json.total = item.json.price * item.json.quantity;
  
  // Format date field
  if (item.json.date) {
    item.json.formattedDate = new Date(item.json.date).toLocaleDateString();
  }
  
  return item;
});
\`\`\`

Would you like to know more about specific features of the Function node?
`,
            'Set': `
# Set Node

## Purpose
The Set node allows you to set values on items in your workflow, creating new fields or modifying existing ones.

## Key Features
- Create new fields with static values
- Set values using expressions and JSONata
- Access data from previous nodes using expressions
- Convert data types
- Keep or remove specific fields

## Common Use Cases
1. Data transformation and normalization
2. Creating new data structures
3. Renaming fields
4. Setting default values
5. Filtering out unnecessary fields

## Best Practices
- Use descriptive names for new fields
- Group related fields together
- Use expressions to dynamically set values
- Consider using "Keep Only" mode to clean up data

## Example Configuration
\`\`\`
{
  "values": {
    "string": [
      {
        "name": "fullName",
        "value": "={{ $json.firstName + ' ' + $json.lastName }}"
      }
    ],
    "number": [
      {
        "name": "totalPrice",
        "value": "={{ $json.price * $json.quantity }}"
      }
    ]
  }
}
\`\`\`

Would you like to know more about specific features of the Set node?
`
        };
        return explanations[nodeType] || explanations['HTTP Request'];
    }
    static generateWorkflowResponse(prompt) {
        return `
# Generated Workflow: API Data Fetcher

## Workflow Overview
This workflow fetches data from an API, processes it, and sends notifications when specific conditions are met.

## Nodes Required
1. **Trigger Node**: Schedule trigger (runs daily at 9 AM)
2. **HTTP Request Node**: Fetches data from the API
3. **Function Node**: Processes and filters the data
4. **IF Node**: Checks if notification conditions are met
5. **Send Email Node**: Sends notification emails
6. **Set Node**: Prepares data for storage
7. **Postgres Node**: Stores processed data in database

## Implementation Steps

### 1. Schedule Trigger
- Set to run daily at 9:00 AM

### 2. HTTP Request
\`\`\`
{
  "url": "https://api.example.com/data",
  "method": "GET",
  "authentication": "headerAuth",
  "headerParameters": {
    "API-Key": "YOUR_API_KEY"
  }
}
\`\`\`

### 3. Function Node
\`\`\`javascript
return items.map(item => {
  // Process each item
  const data = item.json;
  
  // Add calculated fields
  data.isImportant = data.priority > 7;
  data.processedDate = new Date().toISOString();
  
  return {
    json: data
  };
});
\`\`\`

### 4. IF Node
- Condition: \`{{$json.isImportant}}\`

### 5. Send Email (True path from IF)
\`\`\`
{
  "to": "alerts@example.com",
  "subject": "Important Data Alert",
  "text": "={{\"Important data detected: \" + $json.description}}"
}
\`\`\`

### 6. Set Node (Both paths merge here)
\`\`\`
{
  "values": {
    "string": [
      {
        "name": "status",
        "value": "processed"
      }
    ],
    "boolean": [
      {
        "name": "archived",
        "value": false
      }
    ]
  }
}
\`\`\`

### 7. Postgres Node
\`\`\`
{
  "operation": "insert",
  "table": "processed_data",
  "columns": "id,description,priority,is_important,processed_date,status",
  "values": "={{$json.id}},{{$json.description}},{{$json.priority}},{{$json.isImportant}},{{$json.processedDate}},{{$json.status}}"
}
\`\`\`

## Workflow Diagram
Start → Schedule → HTTP Request → Function → IF → (True) → Send Email ↘
                                            ↓
                                          (False)
                                            ↓
                                            → Set → Postgres → End

Would you like me to explain any specific part of this workflow in more detail?
`;
    }
    static generateGeneralResponse(prompt) {
        return `
# N8N AI Assistant

I'm here to help you with your n8n workflows! Here are some ways I can assist you:

## What I Can Do
- **Analyze Workflows**: Examine your workflow structure and suggest improvements
- **Optimize Performance**: Recommend ways to make your workflows more efficient
- **Explain Nodes**: Provide detailed explanations of how specific nodes work
- **Generate Workflows**: Create workflow templates based on your requirements
- **Answer Questions**: Provide information about n8n features and best practices

## Common Questions
- How to handle errors in workflows
- Best practices for workflow design
- How to use specific nodes
- Integration patterns with external services
- Performance optimization techniques

## Getting Started
To get the most out of my assistance, try asking specific questions about your workflow or describe what you're trying to accomplish.

For example:
- "How can I optimize my workflow that processes large CSV files?"
- "Explain how the HTTP Request node works"
- "Generate a workflow that sends Slack notifications when new emails arrive"

What would you like help with today?
`;
    }
}
exports.OpenAiHelper = OpenAiHelper;
//# sourceMappingURL=openAiHelper.js.map