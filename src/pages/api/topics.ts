import { HTTP_REQUEST_INTERVAL, HTTP_REQUEST_LIMIT } from "@/constants/rateLimitParams";
import rateLimit from "@/services/rateLimit";
import { formatGetReqJson } from "@/services/utils";
import { NextApiRequest, NextApiResponse } from "next";

interface Error {
  error?: string 
}

// Get All Topics
async function GET(req: NextApiRequest, res: NextApiResponse) {
  // const isRateLimit = rateLimit(HTTP_REQUEST_LIMIT, HTTP_REQUEST_INTERVAL)
  // if( !(await isRateLimit(req , res) )){
  //   return res.status(429).json({ error: 'Too many requests, please try again later.' } );
  // }
  
  console.log('GET /api/topics (App Router)');

  const query = req.query; // { page_number: '1', page_size: '5' }

  console.log('query', req.query)

  if (!query?.page_number) {
    return res.status(400).json({ error: 'Page Number is required' });
  }
  else if (!query.page_size) {
    return res.status(400).json({ error: 'Page Size is required' });
  }

  try {
    const route = 'topics';
    const token = req.headers.authorization;
    const apiKey = process.env.API_KEY;
    const nodeServer = process.env.SERVER_BASE_URL;

    const rawResponse = await fetch(
      `${nodeServer}${route}?${formatGetReqJson(query)}`,
      {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          "Authorization": token
        },
      }
    );

    if (!rawResponse.ok) {
      throw new Error('Failed to fetch topics');
    }

    const response = await rawResponse.json()

    // console.log('GET /api/topics (Response):', response);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({ error: 'Topics GET: ' + error.message });
  }
}

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') 
    return await GET(req, res)
  else 
    return res.status(500).json({ error: 'Invalid request' });
}

export const config = {
  api: {
    responseLimit: false,
    bodyParser: true, // to parse data
  },
}

export default handler; 