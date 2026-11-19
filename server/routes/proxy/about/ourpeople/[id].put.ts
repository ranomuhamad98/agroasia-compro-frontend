export default defineEventHandler(async (event) => {
    try {
      console.log('📝 Our People update request received');
      
      // Get person ID from URL params
      const id = getRouterParam(event, 'id');
      
      if (!id) {
        throw createError({
          statusCode: 400,
          statusMessage: 'Person ID is required'
        });
      }
      
      // Read JSON body data
      const body = await readBody(event);
      
      if (!body) {
        throw createError({
          statusCode: 400,
          statusMessage: 'No request body received'
        });
      }
      
      // Validate required fields
      if (!body.name) {
        throw createError({
          statusCode: 400,
          statusMessage: 'Name is required'
        });
      }
      
      if (!body.image_link) {
        throw createError({
          statusCode: 400,
          statusMessage: 'Image link is required'
        });
      }
      
      if (!body.title) {
        throw createError({
          statusCode: 400,
          statusMessage: 'Title is required'
        });
      }
      
      if (!body.lokasi) {
        throw createError({
          statusCode: 400,
          statusMessage: 'Location is required'
        });
      }
      
      console.log('📋 Our People update data received:', {
        id,
        name: body.name,
        image_link: body.image_link,
        title: body.title,
        lokasi: body.lokasi,
        bertani_sejak: body.bertani_sejak,
        bermitra_sejak: body.bermitra_sejak,
        keterangan: body.keterangan,
        status: body.status
      });
      
      // Use proxy utility for updating our people
      const response = await proxyToExternalApi(event, {
        endpoint: `/about-us/our-people/${id}`,
        method: 'PUT',
        body: {
          image_link: body.image_link,
          name: body.name,
          title: body.title,
          lokasi: body.lokasi,
          bertani_sejak: body.bertani_sejak || 0,
          bermitra_sejak: body.bermitra_sejak || 0,
          keterangan: body.keterangan || '',
          status: body.status !== undefined ? body.status : true
        },
        requireAuth: true
      });
  
      console.log('✅ Our People updated successfully, forwarding response');
      
      return {
        success: true,
        data: response,
        message: 'Our People updated successfully'
      };
      
    } catch (error: any) {
      console.error('❌ Our People update proxy error:', error);
      throw error; // Re-throw error sudah dihandle di proxy utility
    }
  }); 