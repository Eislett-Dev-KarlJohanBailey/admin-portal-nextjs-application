import { HTTP_REQUEST_INTERVAL, HTTP_REQUEST_LIMIT } from "@/constants/rateLimitParams";
import { QuestionDetails } from "@/models/questions/questionDetails";
import rateLimit from "@/services/rateLimit";
import { formatGetReqJson } from "@/services/utils";
import { NextApiRequest, NextApiResponse } from "next";

interface Error {
  error?: string 
}


// Get All Questions
async function GET(req: NextApiRequest, res: NextApiResponse) {
  // const isRateLimit = rateLimit(HTTP_REQUEST_LIMIT, HTTP_REQUEST_INTERVAL)
  // if( !(await isRateLimit(req , res) )){
  //   return res.status(429).json({ error: 'Too many requests, please try again later.' } );
  // }
  
  console.log('GET /api/questions (App Router)');


  const query = req.query ; // { page_number: '1', page_size: '5' }

  console.log('query', req.query)

  if (!query?.page_number) {
    return res.status(400).json({ error: 'Page Number is required' });
  }
  else if (!query.page_size) {
    return res.status(400).json({ error: 'Page Size is required' });
  }


  try {
    const route = 'questions';
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
          "Authorization" : token
        },
      }
    );

    if (!rawResponse.ok) {
      throw new Error('Failed to fetch questions');
    }

    const response = await rawResponse.json()

    // console.log('GET /api/questions (Response):', response);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({ error: 'Questions GET: ' + error.message });
  }
}


// Create Question
async function POST(req: NextApiRequest, res: NextApiResponse<QuestionDetails | Error>) {
  
  // const isRateLimit = rateLimit(HTTP_REQUEST_LIMIT, HTTP_REQUEST_INTERVAL)
  // if( !(await isRateLimit(req , res) )){
  //   return res.status(429).json({ error: 'Too many requests, please try again later.' } );
  // }
  
  console.log('POST /api/questions (App Router)');


  const questionDetails = await req.body;

  // console.log('body', req.body)

  if (!questionDetails.title) {
    return res.status(400).json({ error: 'Title is required' });
  }
  else if (!questionDetails.content) {
    return res.status(400).json({ error: 'Content is required' });
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    // --- Handle Other Methods ---
    console.log(`Method ${req.method} Not Allowed for /api/qeustions`);
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`)
  }

  try {
    const route = 'questions';
    const token = req.headers.authorization;
    const apiKey = process.env.API_KEY;
    const nodeServer = process.env.SERVER_BASE_URL;

    const rawResponse = await fetch(
      `${nodeServer}${route}`,
      {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          "Authorization" : token
        },
        body: JSON.stringify(questionDetails)
      }
    );

    if (!rawResponse.ok) {
      throw new Error('Failed to create');
    }

    const response = await rawResponse.json()

    return res.status(201).json(response);
  } catch (error) {
    return res.status(500).json({ error: 'Questions POST: ' + error.message });
  }
}


// Update Question
async function PUT(req: NextApiRequest, res: NextApiResponse<QuestionDetails | Error>) {
  
  // const isRateLimit = rateLimit(HTTP_REQUEST_LIMIT, HTTP_REQUEST_INTERVAL)
  // if( !(await isRateLimit(req , res) )){
  //   return res.status(429).json({ error: 'Too many requests, please try again later.' } );
  // }
  
  console.log('PUT /api/questions (App Router)');


  const {id , questionDetails} = await req.body;

  // console.log('body', req.body)

  if (!id) {
    return res.status(400).json({ error: 'Question id is required' });
  }

  // Only allow POST requests
  if (req.method !== 'PUT') {
    // --- Handle Other Methods ---
    console.log(`Method ${req.method} Not Allowed for /api/questions`);
    res.setHeader('Allow', ['PUT']);
    return res.status(405).end(`Method ${req.method} Not Allowed`)
  }

  try {
    const route = `questions/${id}`;
    const token = req.headers.authorization;
    const apiKey = process.env.API_KEY;
    const nodeServer = process.env.SERVER_BASE_URL;

    const rawResponse = await fetch(
      `${nodeServer}${route}`,
      {
        method: 'PUT',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          "Authorization" : token
        },
        body: JSON.stringify(questionDetails)
      }
    );

    if (!rawResponse.ok) {
      throw new Error('Failed to update');
    }

    const response = await rawResponse.json()

    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({ error: 'Questions PUT: ' + error.message });
  }
}


async function handler(req: NextApiRequest, res: NextApiResponse){
  if  (req.method === 'GET') 
    return await GET(req , res)
  else if  (req.method === 'POST') 
    return await POST(req , res)
  else if  (req.method === 'PUT') 
    return await PUT(req , res)
  else 
    return res.status(500).json({ error: 'Invalid request'});
}

export const config = {
  api: {
    responseLimit: false,
    bodyParser: true, // to parse data
  },
}

export default handler;