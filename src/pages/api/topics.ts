import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const backendUrl = process.env.BACKEND_URL || 'http://localhost:8000'
      const { page_size = 100, page_number = 1 } = req.query

      const url = `${backendUrl}/api/v1/topics?page_size=${page_size}&page_number=${page_number}`

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': req.headers.authorization || '',
        },
      })

      if (!response.ok) {
        throw new Error(`Backend responded with status: ${response.status}`)
      }

      const data = await response.json()
      res.status(200).json(data)
    } catch (error) {
      console.error('Error fetching topics:', error)
      res.status(500).json({ error: 'Failed to fetch topics' })
    }
  } else {
    res.setHeader('Allow', ['GET'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
} 