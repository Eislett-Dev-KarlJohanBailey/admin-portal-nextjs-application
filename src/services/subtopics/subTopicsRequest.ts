import { toast } from "@/hooks/use-toast";
import { SubTopicDetails } from "@/models/subTopic/subTopicDetails";
import { SubTopicReqParams } from "@/models/subTopic/subTopicReqParams";
import { SubTopicResponse } from "@/models/subTopic/subTopicResponse";
import { formatGetReqJson, removeNulls } from "@/services/utils";

interface returnType {
    data?: SubTopicDetails[];
    amount?: number;
    pagination?: {
        page_size: number;
        page_number: number;
        total_pages: number;
    };
    error?: string;
}

interface SingleSubTopicReturnType {
    data?: SubTopicDetails;
    error?: string;
}

interface UpdateSubTopicData {
    name: string;
    description: string;
    topicId: string;
    order?: number;
}

// Interface for single subtopic response from API
interface SingleSubTopicResponse {
    data: {
        id: string;
        name: string;
        description: string;
        topicId?: string; // Made optional since it might be missing from backend
        order?: number;
        createdAt?: string;
        progress?: number;
        hints?: any[];
        topicIds?: string[];
    };
}

async function handleFetchSubTopics(token : string, page_number: number, page_size: number, topicId?: string): Promise<returnType> {

    try {
        const params: SubTopicReqParams = { page_number, page_size, topicId: topicId }
        
        removeNulls(params);
        
        const rawResponse = await fetch(`/api/sub-topics?${formatGetReqJson(params)}`,
            {
                method: 'GET',
                headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'Content-Type': 'application/json',
                    "Authorization" : `Bearer ${token}`
                },
                
            }
        );

        if (!rawResponse.ok) {
            throw new Error('Failed to fetch subtopics');
        }

        const response = await rawResponse.json() as SubTopicResponse;
        return {
            data: response.data,
            amount: response.amount,
            pagination: response.pagination
        };
    }
    catch(e){
        toast({ title: 'Error fetching list of subtopics', style: { background: 'red', color: 'white' }, duration: 3500 })
        console.log('Subtopics error', e);
        return {error : 'Failed to fetch subtopics'}
    }
}

async function handleFetchSubTopic(token: string, subtopicId: string): Promise<SingleSubTopicReturnType> {
    try {
        const rawResponse = await fetch(`/api/sub-topics/${subtopicId}`,
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
            throw new Error('Failed to fetch subtopic');
        }

        const response = await rawResponse.json() as SingleSubTopicResponse;
        return {
            data: {
                id: response.data.id,
                name: response.data.name,
                description: response.data.description,
                topicId: response.data.topicId,
                order: response.data.order,
                createdAt: response.data.createdAt
            }
        };
    } catch (e) {
        toast({ title: 'Error fetching subtopic details', style: { background: 'red', color: 'white' }, duration: 3500 })
        console.log('Subtopic fetch error', e);
        return { error: 'Failed to fetch subtopic' };
    }
}

async function handleUpdateSubTopic(token: string, subtopicId: string, data: UpdateSubTopicData): Promise<SingleSubTopicReturnType> {
    try {
        const rawResponse = await fetch(`/api/sub-topics/${subtopicId}`,
            {
                method: 'PUT',
                headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'Content-Type': 'application/json',
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(data)
            }
        );

        if (!rawResponse.ok) {
            throw new Error('Failed to update subtopic');
        }

        const response = await rawResponse.json() as SingleSubTopicResponse;
        return {
            data: {
                id: response.data.id,
                name: response.data.name,
                description: response.data.description,
                topicId: response.data.topicId,
                order: response.data.order,
                createdAt: response.data.createdAt
            }
        };
    } catch (e) {
        toast({ title: 'Error updating subtopic', style: { background: 'red', color: 'white' }, duration: 3500 })
        console.log('Subtopic update error', e);
        return { error: 'Failed to update subtopic' };
    }
}

export {handleFetchSubTopics, handleFetchSubTopic, handleUpdateSubTopic};
export type { UpdateSubTopicData };