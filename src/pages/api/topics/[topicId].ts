import { NextApiRequest, NextApiResponse } from "next";

interface Error {
  error?: string 
}

// Get Topic by ID
async function GET(req: NextApiRequest, res: NextApiResponse) {
  console.log('GET /api/topics/[topicId] (App Router)');

  const { topicId } = req.query;

  if (!topicId) {
    return res.status(400).json({ error: 'Topic ID is required' });
  }

  try {
    const route = `topics/${topicId}`;
    const token = req.headers.authorization;
    const nodeServer = process.env.SERVER_BASE_URL;

    const rawResponse = await fetch(
      `${nodeServer}${route}`,
      {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          "Authorization" : token
        },
      }
    );

    if (!rawResponse.ok) {
      throw new Error('Failed to fetch topic');
    }

    const response = await rawResponse.json();
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({ error: 'Topic GET: ' + error.message });
  }
}

async function handler(req: NextApiRequest, res: NextApiResponse){
  if (req.method === 'GET') 
    return await GET(req, res)
  else 
    return res.status(405).json({ error: 'Method not allowed'});
}

export const config = {
  api: {
    responseLimit: false,
    bodyParser: true,
  },
}

export default handler; 