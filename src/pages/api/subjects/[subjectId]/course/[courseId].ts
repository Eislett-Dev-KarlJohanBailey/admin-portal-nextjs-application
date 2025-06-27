
import type { NextApiRequest, NextApiResponse } from "next";

//linkQuestionToSubTopic
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<void|{error : string}>,
) {
  
  const method = req.method
  if( method != 'POST' && method != 'DELETE')
     return res.status(500).json({ error: 'Invalid request'});
    
  const {subjectId, courseId } = req.query
    
    
    console.log(`POST /api/subjects/${subjectId}/course/${courseId} (App Router)`);

    if(!courseId || isNaN(Number(courseId)) ){
        return res.status(200).json({error : 'Invalid course id'});
    }


  
    try {
      const route = `subjects/${subjectId}/course/${courseId}`;
      const token = req.headers.authorization;
      const apiKey = process.env.API_KEY;
      const nodeServer = process.env.SERVER_BASE_URL;
  
      const rawResponse = await fetch(
        `${nodeServer}${route}`,
        {
          method: method === 'POST' ? 'POST' : 'DELETE',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            "Authorization" : token
          },
        }
      );
  
      if (!rawResponse.ok) {
        throw new Error('Failed to link subject to course');
      }
  
      // console.log('GET /api/courses (Response):', response);
      return res.status(200).end('');
    } catch (error) {
      return res.status(500).json({ error: 'Link subject: ' + error.message });
    }
}