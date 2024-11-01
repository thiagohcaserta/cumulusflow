import { handleAuth } from '@auth0/nextjs-auth0';

export default handleAuth({
  async login(req) {
    return new Response(JSON.stringify({
      url: `https://${process.env.AUTH0_DOMAIN}/authorize?` +
        `response_type=code&` +
        `client_id=${process.env.AUTH0_CLIENT_ID}&` +
        `redirect_uri=${process.env.AUTH0_REDIRECT_URI}&` +
        `scope=openid profile email`
    }), {
      headers: { 'Content-Type': 'application/json' }
    });
  },

  async callback(req) {
    const url = new URL(req.url);
    const code = url.searchParams.get('code');

    if (!code) {
      return new Response('Missing code parameter', { status: 400 });
    }

    const tokenResponse = await fetch(`https://${process.env.AUTH0_DOMAIN}/oauth/token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        grant_type: 'authorization_code',
        client_id: process.env.AUTH0_CLIENT_ID,
        client_secret: process.env.AUTH0_CLIENT_SECRET,
        code,
        redirect_uri: process.env.AUTH0_REDIRECT_URI
      })
    });

    const tokens = await tokenResponse.json();
    
    return new Response(JSON.stringify({ tokens }), {
      headers: {
        'Content-Type': 'application/json',
        'Set-Cookie': `auth_token=${tokens.access_token}; Path=/; HttpOnly; SameSite=Lax`
      }
    });
  },

  async logout(req) {
    return new Response(null, {
      headers: {
        'Set-Cookie': 'auth_token=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0',
        'Location': '/'
      },
      status: 302
    });
  },

  async profile(req) {
    const token = req.headers.get('cookie')?.split('auth_token=')?.[1]?.split(';')?.[0];

    if (!token) {
      return new Response('Unauthorized', { status: 401 });
    }

    const userResponse = await fetch(`https://${process.env.AUTH0_DOMAIN}/userinfo`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    const user = await userResponse.json();
    return new Response(JSON.stringify(user), {
      headers: { 'Content-Type': 'application/json' }
    });
  }
});