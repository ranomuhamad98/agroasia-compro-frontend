export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);

    console.log('body: ', body)
    
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
    
    return {
      success: true,
      data: response,
      message: 'Login successful'
    };
    
  } catch (error: any) {
    console.log('error: ', error.data)
    throw error; // Re-throw error sudah dihandle di proxy utility
  }
});
