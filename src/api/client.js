const API_BASE_URL = 'https://mixo-fe-backend-task.vercel.app';

export class HttpError extends Error {
  constructor(status, payload) {
    super(`HTTP ${status}`);
    this.status = status;
    this.payload = payload;
    this.name = 'HttpError';
  }
}

async function requestJSON(url, options = {}) {
  const { signal, maxRetries = 2, ...fetchOptions } = options;
  
  let retryCount = 0;
  
  while (retryCount <= maxRetries) {
    try {
      const response = await fetch(url, {
        ...fetchOptions,
        signal,
        headers: {
          'Content-Type': 'application/json',
          ...fetchOptions.headers,
        },
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        
        if (response.status === 429 && retryCount < maxRetries) {
          const retryAfter = payload.retry_after || 1;
          await new Promise(resolve => setTimeout(resolve, retryAfter * 1000));
          retryCount++;
          continue;
        }
        
        throw new HttpError(response.status, payload);
      }

      return await response.json();
    } catch (error) {
      if (error instanceof HttpError) {
        throw error;
      }
      
      if (error.name === 'AbortError') {
        throw error;
      }
      
      if (retryCount < maxRetries) {
        retryCount++;
        await new Promise(resolve => setTimeout(resolve, 1000));
        continue;
      }
      
      throw error;
    }
  }
}

export function createClient(baseURL = API_BASE_URL) {
  return {
    get: (path, options = {}) => {
      return requestJSON(`${baseURL}${path}`, {
        ...options,
        method: 'GET',
      });
    },
  };
}

export const client = createClient();