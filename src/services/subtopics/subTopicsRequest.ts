import { toast } from "@/hooks/use-toast";
import { QuestionDetails } from "@/models/questions/questionDetails";
import { SubTopicDetails } from "@/models/subTopic/subTopicDetails";
import { SubTopicReqParams } from "@/models/subTopic/subTopicReqParams";
import { formatGetReqJson, removeNulls } from "@/services/utils";

interface returnType {
    data?: SubTopicDetails[];
    amount?: number;
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

        return await rawResponse.json() as {data : SubTopicDetails[] , amount : number};
    }
    catch(e){
        toast({ title: 'Error fetching list of subtopics', style: { background: 'red', color: 'white' }, duration: 3500 })
        console.log('Questions error', e);
        return {error : 'Failed to fetch subtopics'}
    }
}

export {handleFetchSubTopics};