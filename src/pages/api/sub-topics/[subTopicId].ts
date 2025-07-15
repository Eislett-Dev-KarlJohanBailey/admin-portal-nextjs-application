import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { subTopicId } = req.query

  if (req.method === 'GET') {
    try {
      // Forward the request to the backend API
      const backendUrl = process.env.SERVER_BASE_URL || 'http://localhost:8000'
      const response = await fetch(`${backendUrl}/api/v1/sub-topics/${subTopicId}`, {
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
      res.status(200).json({ data })
    } catch (error) {
      console.error('Error fetching subtopic:', error)
      res.status(500).json({ error: 'Failed to fetch subtopic' })
    }
  } else if (req.method === 'PUT') {
    try {
      // Forward the request to the backend API
      const backendUrl = process.env.SERVER_BASE_URL || 'http://localhost:8000'
      const response = await fetch(`${backendUrl}/api/v1/sub-topics/${subTopicId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': req.headers.authorization || '',
        },
        body: JSON.stringify(req.body),
      })

      if (!response.ok) {
        throw new Error(`Backend responded with status: ${response.status}`)
      }

      const data = await response.json()
      res.status(200).json({ data })
    } catch (error) {
      console.error('Error updating subtopic:', error)
      res.status(500).json({ error: 'Failed to update subtopic' })
    }
  } else if (req.method === 'DELETE') {
    try {
      // Forward the request to the backend API
      const backendUrl = process.env.SERVER_BASE_URL || 'http://localhost:8000'
      const response = await fetch(`${backendUrl}/api/v1/sub-topics/${subTopicId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': req.headers.authorization || '',
        },
      })

      if (!response.ok) {
        throw new Error(`Backend responded with status: ${response.status}`)
      }

      res.status(200).json({ message: 'Subtopic deleted successfully' })
    } catch (error) {
      console.error('Error deleting subtopic:', error)
      res.status(500).json({ error: 'Failed to delete subtopic' })
    }
  } else {
    res.setHeader('Allow', ['GET', 'PUT', 'DELETE'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
} 