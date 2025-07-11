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

  const topicId = event.path.split('/').pop();
  const backendUrl = process.env.BACKEND_URL || 'http://localhost:8000';

  try {
    let url, method, body;

    switch (event.httpMethod) {
      case 'GET':
        url = `${backendUrl}/api/v1/topics/${topicId}`;
        method = 'GET';
        break;
      case 'PUT':
        url = `${backendUrl}/api/v1/topics/${topicId}`;
        method = 'PUT';
        body = event.body;
        break;
      case 'DELETE':
        url = `${backendUrl}/api/v1/topics/${topicId}`;
        method = 'DELETE';
        break;
      default:
        return {
          statusCode: 405,
          headers: { ...headers, 'Content-Type': 'application/json' },
          body: JSON.stringify({ error: `Method ${event.httpMethod} Not Allowed` }),
        };
    }

    const fetchOptions = {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': event.headers.authorization || '',
      },
    };

    if (body) {
      fetchOptions.body = body;
    }

    const response = await fetch(url, fetchOptions);

    if (!response.ok) {
      throw new Error(`Backend responded with status: ${response.status}`);
    }

    const data = await response.json();
    
    return {
      statusCode: 200,
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    };
  } catch (error) {
    console.error(`Error with topic ${topicId}:`, error);
    return {
      statusCode: 500,
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Failed to process topic request' }),
    };
  }
}; 