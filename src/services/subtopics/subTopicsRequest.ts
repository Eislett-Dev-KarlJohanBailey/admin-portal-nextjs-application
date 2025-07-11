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

async function handleFetchSubTopics(token : string, page_number: number, page_size: number, topic_id?: string): Promise<returnType> {

    try {
        const params: SubTopicReqParams = { page_number, page_size, topic_id: topic_id }
        
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

export {handleFetchSubTopics};