const fetch = require('node-fetch');

exports.handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  };

  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: '',
    };
  }

  try {
    // Extract the API path from the event
    const path = event.path.replace('/.netlify/functions/api-proxy', '');
    const backendUrl = process.env.BACKEND_URL || 'http://localhost:8000';
    
    // Construct the backend URL
    const url = `${backendUrl}/api/v1${path}${event.queryStringParameters ? '?' + new URLSearchParams(event.queryStringParameters).toString() : ''}`;

    const fetchOptions = {
      method: event.httpMethod,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': event.headers.authorization || '',
      },
    };

    // Add body for POST/PUT requests
    if (event.body && ['POST', 'PUT', 'PATCH'].includes(event.httpMethod)) {
      fetchOptions.body = event.body;
    }

    console.log(`Proxying request to: ${url}`);
    const response = await fetch(url, fetchOptions);

    if (!response.ok) {
      console.error(`Backend error: ${response.status} ${response.statusText}`);
      return {
        statusCode: response.status,
        headers: { ...headers, 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          error: `Backend responded with status: ${response.status}`,
          message: response.statusText 
        }),
      };
    }

    const data = await response.json();
    
    return {
      statusCode: 200,
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    };
  } catch (error) {
    console.error('API proxy error:', error);
    return {
      statusCode: 500,
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Failed to proxy request to backend' }),
    };
  }
}; 