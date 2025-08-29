export interface Book {
  id: string
  title: string
  author: string
  description?: string
  publishedYear?: number
  genre?: string
  isbn?: string
  coverImage?: string
}

export interface CD {
  id: string
  title: string
  artist: string
  description?: string
  releaseYear?: number
  genre?: string
  duration?: string
  coverImage?: string
}