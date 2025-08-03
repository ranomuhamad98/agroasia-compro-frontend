/**
 * Utility untuk menangani proxy request ke external API dengan cookie forwarding
 */

interface ProxyOptions {
  endpoint: string;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  body?: any;
  requireAuth?: boolean;
}

export async function proxyToExternalApi(event: any, options: ProxyOptions) {
  const { endpoint, method = 'GET', body, requireAuth = true } = options;
  
  try {
    console.log(`🌐 Proxying ${method} request to: ${endpoint}`);
    
    // Prepare headers
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'accept': 'application/json'
    };
    
    // Forward cookies if available (for authenticated requests)
    if (requireAuth) {
      console.log('🔍 Checking for authentication cookies...');
      const cookieHeader = getHeader(event, 'cookie');
      console.log('🍪 Raw cookie header:', cookieHeader || 'null');
      
      if (cookieHeader) {
        headers['cookie'] = cookieHeader;
        console.log('🍪 Forwarding cookies to external API:', cookieHeader.substring(0, 100) + '...');
      } else {
        console.warn('⚠️ No cookies found for authenticated request');
        // Log all available headers for debugging
        console.log('🔍 Available headers:', Object.keys(event.headers || {}));
        console.log('🔍 All headers:', event.headers);
      }
    } else {
      console.log('ℹ️ Request does not require auth - skipping cookie forwarding');
    }
    
    // Make request to external API
    const response = await $fetch(`https://agroasiaberdikari.id/api${endpoint}`, {
      method,
      headers,
      body,
      // Handle response with cookies
      onResponse({ response }) {
        // Forward any new cookies from external API to client
        const setCookieHeaders = response.headers.get('set-cookie');
        console.log('🔍 Response cookies from external API:', setCookieHeaders || 'none');
        
        if (setCookieHeaders) {
          console.log('🍪 Forwarding new cookies from external API to client:', setCookieHeaders);
          setHeader(event, 'set-cookie', setCookieHeaders);
        } else {
          console.log('⚠️ No cookies received from external API');
        }
      }
    });
    
    console.log(`✅ Proxy request successful for ${endpoint}`);
    return response;
    
  } catch (error: any) {
    console.error(`❌ Proxy request failed for ${endpoint}:`, error);
    
    // Handle authentication errors
    if (error.status === 401) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Authentication required'
      });
    }
    
    // Handle validation errors
    if (error.status === 422) {
      throw createError({
        statusCode: 422,
        statusMessage: 'Validation error',
        data: error.data
      });
    }
    
    // Handle other errors
    throw createError({
      statusCode: error.status || 500,
      statusMessage: error.message || 'Proxy request failed'
    });
  }
}

/**
 * Extract dan forward cookies dari request
 */
export function forwardCookies(fromEvent: any, toHeaders: Record<string, string>) {
  const cookieHeader = getHeader(fromEvent, 'cookie');
  if (cookieHeader) {
    toHeaders['cookie'] = cookieHeader;
    return true;
  }
  return false;
}

/**
 * Check apakah user sudah authenticated berdasarkan cookies
 */
export function isAuthenticated(event: any): boolean {
  const cookieHeader = getHeader(event, 'cookie');
  // Basic check - bisa diperluas sesuai kebutuhan
  return !!cookieHeader && cookieHeader.includes('token');
}