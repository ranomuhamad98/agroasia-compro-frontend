export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    
    console.log('🔐 Login proxy request received:', { email: body.email });
    
    // Use proxy utility for login
    const response = await proxyToExternalApi(event, {
      endpoint: '/auth/login',
      method: 'POST',
      body: {
        email: body.email,
        password: body.password
      },
      requireAuth: false // Login tidak perlu auth
    });

    console.log('✅ Login successful, forwarding response');
    
    return {
      success: true,
      data: response,
      message: 'Login successful'
    };
    
  } catch (error: any) {
    console.error('❌ Login proxy error:', error);
    throw error; // Re-throw error sudah dihandle di proxy utility
  }
});
