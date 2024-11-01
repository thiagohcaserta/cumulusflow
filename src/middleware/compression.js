import { gzip, brotli } from 'zlib';
import { promisify } from 'util';

const gzipAsync = promisify(gzip);
const brotliAsync = promisify(brotli);

export function compressionMiddleware(options = {}) {
  return async (request, next) => {
    const response = await next(request);
    const acceptEncoding = request.headers.get('accept-encoding') || '';

    if (!acceptEncoding) return response;

    const body = await response.text();
    let compressedBody;
    let contentEncoding;

    if (acceptEncoding.includes('br')) {
      compressedBody = await brotliAsync(body);
      contentEncoding = 'br';
    } else if (acceptEncoding.includes('gzip')) {
      compressedBody = await gzipAsync(body);
      contentEncoding = 'gzip';
    }

    if (compressedBody) {
      const headers = new Headers(response.headers);
      headers.set('content-encoding', contentEncoding);
      headers.set('content-length', compressedBody.length);

      return new Response(compressedBody, {
        status: response.status,
        headers
      });
    }

    return response;
  };
}