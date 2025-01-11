export interface BookType {
    index: string
    filename: string
    relevance_score?: number
    thumbnail: string
    content: string
    size: number
    file_type: string
    path: string[]
}