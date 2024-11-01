export class BaseAdapter {
  normalizeRequest(request, context) {
    return request;
  }

  normalizeResponse(response) {
    return response;
  }

  normalizeHeaders(headers) {
    return new Headers(headers);
  }

  getEnvironment() {
    return process.env;
  }
}

export function createAdapter(implementation) {
  return class extends BaseAdapter {
    constructor(config) {
      super();
      this.config = config;
    }
    ...implementation
  };
}