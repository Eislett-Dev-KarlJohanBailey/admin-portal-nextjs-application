import { toast } from "@/hooks/use-toast";

interface TopicDetails {
  id: string;
  name: string;
  description?: string;
  createdAt?: string;
}

interface returnType {
  data?: TopicDetails;
  error?: string;
}

async function handleFetchTopic(token: string, topicId: string): Promise<returnType> {
  try {
    const rawResponse = await fetch(`/api/topics/${topicId}`,
      {
        method: 'GET',
        headers: {
          'Accept': 'application/json, text/plain, */*',
          'Content-Type': 'application/json',
          "Authorization": `Bearer ${token}`
        },
      }
    );

    if (!rawResponse.ok) {
      throw new Error('Failed to fetch topic');
    }

    return await rawResponse.json() as { data: TopicDetails };
  } catch (e) {
    toast({ 
      title: 'Error fetching topic details', 
      style: { background: 'red', color: 'white' }, 
      duration: 3500 
    });
    console.log('Topic error', e);
    return { error: 'Failed to fetch topic' };
  }
}

export { handleFetchTopic };
export type { TopicDetails }; 