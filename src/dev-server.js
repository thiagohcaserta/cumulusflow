import { WebSocketServer } from 'ws';
import { createServer } from 'http';
import chokidar from 'chokidar';
import { AIAssistant } from './ai/assistant.js';

export function startDevServer() {
  const server = createServer();
  const wss = new WebSocketServer({ server });
  const ai = new AIAssistant({ apiKey: process.env.OPENAI_API_KEY });

  // File watcher for HMR and AI analysis
  const watcher = chokidar.watch('src/**/*.{js,jsx}');
  
  watcher.on('change', async (path) => {
    // Notify connected clients
    wss.clients.forEach(client => {
      client.send(JSON.stringify({ type: 'hmr', path }));
    });

    // AI-powered analysis
    try {
      const code = await fs.readFile(path, 'utf-8');
      const suggestions = await ai.suggestOptimizations(code);
      console.log(`\nAI Suggestions for ${path}:\n${suggestions}`);
    } catch (error) {
      console.error('AI analysis error:', error);
    }
  });

  // WebSocket connection handling
  wss.on('connection', (ws) => {
    ws.on('message', async (data) => {
      const message = JSON.parse(data);
      
      if (message.type === 'analyze') {
        const suggestions = await ai.analyzePerformance(message.metrics);
        ws.send(JSON.stringify({ type: 'analysis', suggestions }));
      }
    });
  });

  server.listen(3000, () => {
    console.log('Development server running on http://localhost:3000');
    console.log('AI-powered development assistance enabled');
  });
}