import { HTTP_REQUEST_INTERVAL, HTTP_REQUEST_LIMIT } from "@/constants/rateLimitParams";
import { QuestionDetails } from "@/models/questions/questionDetails";
import rateLimit from "@/services/rateLimit";
import { formatGetReqJson } from "@/services/utils";
import { NextApiRequest, NextApiResponse } from "next";

interface Error {
  error?: string
}


// Get Course By Id
async function GET(req: NextApiRequest, res: NextApiResponse) {
  // const isRateLimit = rateLimit(HTTP_REQUEST_LIMIT, HTTP_REQUEST_INTERVAL)
  // if( !(await isRateLimit(req , res) )){
  //   return res.status(429).json({ error: 'Too many requests, please try again later.' } );
  // }

  const { courseId } = req.query
  console.log(`GET /api/courses/${courseId} (App Router)`);



  if (!courseId || isNaN(Number(courseId))) {
    return res.status(200).json({ error: 'Invalid course id' });
  }


  try {
    const route = `courses/${courseId}`;
    const token = req.headers.authorization;
    const apiKey = process.env.API_KEY;
    const nodeServer = process.env.SERVER_BASE_URL;

    const rawResponse = await fetch(
      `${nodeServer}${route}`,
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
      throw new Error('Failed to fetch courses');
    }

    const response = await rawResponse.json()

    // console.log(`GET /api/courses/${courseId} (Response):`, response);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({ error: 'Subjects GET: ' + error.message });
  }
}

//
async function PUT(req: NextApiRequest, res: NextApiResponse) {
  // const isRateLimit = rateLimit(HTTP_REQUEST_LIMIT, HTTP_REQUEST_INTERVAL)
  // if( !(await isRateLimit(req , res) )){
  //   return res.status(429).json({ error: 'Too many requests, please try again later.' } );
  // }


  const { courseId } = req.query

  console.log(`GET /api/courses/${courseId} (App Router)`);

  if (!courseId || isNaN(Number(courseId))) {
    return res.status(200).json({ error: 'Invalid course id' });
  }

  const courseDetails = await req.body;

  console.log('body', req.body)

  if (!courseDetails?.title) {
    return res.status(400).json({ error: 'Title is required' });
  }
  else if (!courseDetails.description) {
    return res.status(400).json({ error: 'Description is required' });
  }


  try {
    const route =`courses/${courseId}`;
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
          "Authorization": token
        },
        body : JSON.stringify(courseDetails)
      }
    );

    if (!rawResponse.ok) {
      throw new Error('Failed to update course');
    }

    const response = await rawResponse.json()

    // console.log(`PUT /api/courses/${courseId} (Response):`, response);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({ error: 'Subjects PUT: ' + error.message });
  }
}

async function DELETE(req: NextApiRequest, res: NextApiResponse) {
  // const isRateLimit = rateLimit(HTTP_REQUEST_LIMIT, HTTP_REQUEST_INTERVAL)
  // if( !(await isRateLimit(req , res) )){
  //   return res.status(429).json({ error: 'Too many requests, please try again later.' } );
  // }

  const { courseId } = req.query
  console.log(`DELETE /api/courses/${courseId} (App Router)`);



  if (!courseId || isNaN(Number(courseId))) {
    return res.status(200).json({ error: 'Invalid course id' });
  }


  try {
    const route = `courses/${courseId}`;
    const token = req.headers.authorization;
    const apiKey = process.env.API_KEY;
    const nodeServer = process.env.SERVER_BASE_URL;

    const rawResponse = await fetch(
      `${nodeServer}${route}`,
      {
        method: 'DELETE',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          "Authorization": token
        },
      }
    );

    if (!rawResponse.ok) {
      throw new Error('Failed to delete course');
    }


    // console.log(`DELETE /api/courses/${courseId} (Response):`, response);
    return res.status(200).end('');
  } catch (error) {
    return res.status(500).json({ error: 'Subjects GET: ' + error.message });
  }
}



async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET')
    return await GET(req, res)
  // else if  (req.method === 'POSTT') 
  //   return await POST(req , res)
  else if (req.method === 'PUT')
    return await PUT(req, res)
  else if (req.method === 'DELETE')
    return await DELETE(req, res)
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