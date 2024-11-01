export const config = {
  middleware: ['auth']
};

export default function handler(req) {
  return new Response(JSON.stringify(req.user), {
    headers: { 'Content-Type': 'application/json' }
  });
}