"use client"

import { notFound, redirect } from 'next/navigation'
import Image from 'next/image'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, FileText } from 'lucide-react'
import BookCard from '@/components/book-card'
import { BookType } from '@/lib/types'
import { useEffect, useState } from 'react'
import axios, { AxiosError } from 'axios'
import { API_URL } from '@/lib/constants'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

export default function BookPage() {
    const searchParams = useSearchParams()
    const index = searchParams.get('index')
    if (!index) {
        notFound()
    }
    const [loading, setLoading] = useState(true);
    const [loadingRelated, setLoadingRelated] = useState(true);
    const [error, setError] = useState('');
    const [content, setContent] = useState('');
    
  
    const [book, setBook] = useState<BookType | null>(null);
    const [relatedBooks, setRelatedBooks] = useState<BookType[]>([]);
    const loadBook = (index: string) => {
        setLoading(true);
        axios.post(`${API_URL}/book`, {
            index: index
        }).then((res) => {
            setBook(res.data);
        }).catch((err: AxiosError | any) => {
            setError(`Error: ${err.response?.data.detail}`);
            setTimeout(() => setError(''), 3000);
        }).finally(() => {
          setLoading(false);
        })
        axios.post(`${API_URL}/related`, {
            index: index
        }).then((res) => {
            setRelatedBooks(res.data.results);
        }).catch((err: AxiosError | any) => {
            setError(`Error: ${err.response?.data.detail}`);
            setTimeout(() => setError(''), 3000);
        }).finally(() => {
            setLoadingRelated(false);
        })
    }
    useEffect(() => {
        loadBook(index);
    }, [])
    // useEffect(() => {
    //     if(!(book && book.content)) return;
    //     axios.get(`${book.content}`).then((res) => {
    //         // Simple method to extract keywords by frequency (filter out common stopwords)
    //         // const stopwords = ['the', 'and', 'for', 'to', 'of', 'is', 'a', 'on', 'in', 'that', 'with', 'it', 'as', 'this', 'by', 'an', 'be', 'are', 'was', 'were'];
    //         // const words: string[] = res.data.toLowerCase().split(/\s+/); // Split text into words
    //         // const wordCount: { [key: string]: number } = {};

    //         // words.forEach(word => {
    //         //     if (!stopwords.includes(word) && word.length > 2) {
    //         //         wordCount[word] = (wordCount[word] || 0) + 1;
    //         //     }
    //         // });
    //         // const keywords = Object.entries(wordCount)
    //         //     .sort(([, a], [, b]) => b - a)
    //         //     .slice(0, 15) // Get the top 5 most frequent keywords
    //         //     .map(([word]) => word).join(', ');
    //         const sentences = res.data.split('.').slice(0, 20); // First 3 sentences
    //         setContent(`${sentences.join('.')}...`)
    //         // setContent(`${keywords} | ${sentences.join('.') + (sentences.length < 3 ? '' : '.')}`)
    //         // setContent(`${res.data.slice(1024*4, 1024*6)}...`);
    //     }).catch((err: AxiosError | any) => {
    //         setError(`Error: ${err.response?.data.detail}`);
    //         setTimeout(() => setError(''), 3000);
    //     }).finally(() => {
          
    //     })
    // }, [book])
    if (loading) {
        return <>Loading</>
    }
    if (!book) {
        notFound()
    }

    return (
      <div className="container max-w-[767px] mx-auto p-4">
        <Link href={'/'}>
            <h1 className="text-4xl font-bold mb-8 text-center">
            Book Search Engine
            </h1>
        </Link>
        {error && <div className="text-red-500 text-xl text-center mb-4 py-2 rounded-sm -mt-4 bg-red-100">{error}</div>}
        <Card className="mb-8">
          <div className="md:flex">
            <div className="md:w-1/3 p-4">
              <Image
                src={book.thumbnail || '/placeholder.svg'}
                alt={`Cover of ${book.filename}`}
                width={300}
                height={400}
                className="object-cover w-full h-auto border border-black rounded-t-xl"
              />
            </div>
            <div className="md:w-2/3 p-4">
              <CardHeader>
                <CardTitle className="text-2xl mb-2 break-words">{book.path[book.path.length - 1]}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center mb-4">
                  <span className="text-sm font-medium bg-primary/10 text-primary px-2 py-1 rounded mr-2">
                    {book.file_type.toUpperCase()}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {book.size.toFixed(2)} MB
                  </span>
                </div>
                <p className="text-muted-foreground mb-4">
                  Path: {book.path.join(' > ')}
                </p>
                <p className="mb-4">
                  {
                      book.relevance_score && 
                      <><strong>Relevance Score:</strong> {(book.relevance_score * 100).toFixed(2)}%</>
                  }
                </p>
                <Button asChild>
                    <Link href={`https://huggingface.co/datasets/thefcraft/gentoomen-lib/resolve/main/${book.path.join('/')}`}>
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Link>
                </Button>
              </CardContent>
            </div>
          </div>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Content Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              {content || "No content preview available for this book."}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Related Books</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {relatedBooks.map((relatedBook) => (
                <BookCard key={relatedBook.index} book={relatedBook} callback={loadBook} />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
  )
}

