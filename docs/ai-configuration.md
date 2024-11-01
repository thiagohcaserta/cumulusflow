# AI Configuration in CumulusFlow

CumulusFlow supports multiple AI providers for code analysis, test generation, and performance optimization.

## Configuration

In your `cumulus.config.js`:

```javascript
export default {
  name: 'my-app',
  ai: {
    // Use OpenAI GPT-4 Turbo
    provider: 'openai',
    openaiKey: process.env.OPENAI_API_KEY,
    model: 'gpt-4-0125-preview', // Optional, defaults to gpt-4-0125-preview

    // Or use Anthropic Claude
    // provider: 'anthropic',
    // anthropicKey: process.env.ANTHROPIC_API_KEY
  }
};
```

## Features

- Code Analysis
- Test Generation
- Performance Optimization
- Real-time Suggestions

## Usage Example

```javascript
import { useAI } from 'cumulusflow/ai';

function CodeEditor() {
  const { analyzeCode, generateTests } = useAI();

  const handleAnalyze = async () => {
    const suggestions = await analyzeCode(code);
    console.log(suggestions);
  };
}
```

## Models

### OpenAI
- Default: GPT-4 Turbo (gpt-4-0125-preview)
- Configurable through `model` option
- Supports all OpenAI models

### Anthropic
- Uses Claude 3 Sonnet
- Efficient code analysis
- Advanced reasoning capabilities
- Cost-effective for most use cases