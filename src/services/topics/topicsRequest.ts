import { toast } from "@/hooks/use-toast";

interface TopicDetails {
  id: string;
  name: string;
  description?: string;
  createdAt?: string;
}

interface TopicsResponse {
  data: TopicDetails[];
  amount: number;
  pagination: {
    page_size: number;
    page_number: number;
    total_pages: number;
  };
}

interface returnType {
  data?: TopicDetails;
  error?: string;
}

interface TopicsListReturnType {
  data?: TopicDetails[];
  amount?: number;
  pagination?: {
    page_size: number;
    page_number: number;
    total_pages: number;
  };
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

async function handleFetchAllTopics(token: string, page_number: number = 1, page_size: number = 100): Promise<TopicsListReturnType> {
  try {
    const rawResponse = await fetch(`/api/topics?page_size=${page_size}&page_number=${page_number}`,
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
      throw new Error('Failed to fetch topics');
    }

    const response = await rawResponse.json() as TopicsResponse;
    return {
      data: response.data,
      amount: response.amount,
      pagination: response.pagination
    };
  } catch (e) {
    toast({ 
      title: 'Error fetching topics list', 
      style: { background: 'red', color: 'white' }, 
      duration: 3500 
    });
    console.log('Topics list error', e);
    return { error: 'Failed to fetch topics' };
  }
}

export { handleFetchTopic, handleFetchAllTopics };
export type { TopicDetails }; 