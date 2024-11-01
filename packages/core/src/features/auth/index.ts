import { Auth0Provider } from './providers/auth0';
import type { AuthConfig } from '../../types';

export class AuthManager {
  private provider: Auth0Provider;

  constructor(config: AuthConfig) {
    this.provider = new Auth0Provider(config.auth0);
  }

  middleware() {
    return this.provider.middleware();
  }

  async verify(token: string) {
    return this.provider.verify(token);
  }
}