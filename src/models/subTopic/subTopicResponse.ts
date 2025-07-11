import { SubTopicDetails } from "./subTopicDetails"

export interface SubTopicResponse {
  data: SubTopicDetails[]
  amount: number
  pagination: {
    page_size: number
    page_number: number
    total_pages: number
  }
}