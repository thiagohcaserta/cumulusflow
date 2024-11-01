export const config = {
  rateLimit: {
    windowMs: 60000,
    max: 10,
    burst: 2,
    costPerRequest: 5
  }
};

export default async function handler(req) {
  // Simulate expensive operation
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return new Response(JSON.stringify({
    message: 'Expensive operation completed',
    timestamp: new Date().toISOString()
  }), {
    headers: { 'Content-Type': 'application/json' }
  });
}