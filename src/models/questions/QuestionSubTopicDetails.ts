import { SubTopicHintDetails } from "../subTopic/subTopicHintDetails"

export interface QuestionSubTopicDetails {
    id : string 
    name : string 
    description : string 
    createdAt : string 
    hints : SubTopicHintDetails[]
    progress : number   
}