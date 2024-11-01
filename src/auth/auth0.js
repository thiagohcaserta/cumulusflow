export class Auth0Provider {
  constructor(config) {
    this.domain = config.domain;
    this.clientId = config.clientId;
    this.clientSecret = config.clientSecret;
  }

  async authenticate(request) {
    const token = this.extractToken(request);
    if (!token) return null;
    
    return await this.verifyToken(token);
  }

  async verifyToken(token) {
    try {
      const response = await fetch(`https://${this.domain}/.well-known/jwks.json`);
      const jwks = await response.json();
      
      return new Promise((resolve, reject) => {
        jwt.verify(
          token,
          getKey.bind(null, jwks),
          { algorithms: ['RS256'] },
          (err, decoded) => err ? reject(err) : resolve(decoded)
        );
      });
    } catch (error) {
      return null;
    }
  }

  extractToken(request) {
    const authHeader = request.headers.get('authorization');
    return authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;
  }

  middleware() {
    return async (request, next) => {
      const user = await this.authenticate(request);
      if (!user) {
        return new Response('Unauthorized', { status: 401 });
      }
      request.user = user;
      return next(request);
    };
  }
}