import Image from 'next/image'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Book, FileText, Download } from 'lucide-react'
import { BookType } from '@/lib/types'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { redirect } from 'next/navigation'
interface BookCardProps {
  book: BookType,
  callback?: (index: string) => void
}

export default function BookCard({ book, callback }: BookCardProps) {
  const thumbnailUrl = book.file_type === 'pdf' 
    ? book.thumbnail || '/placeholder.svg'
    : '/unknown-type.svg'

  return (
    <Card className="overflow-hidden transition-all hover:shadow-lg">
      <div className="aspect-[3/4] relative">
        <Link href={`/book?index=${book.index}`} onClick={() => callback && callback(book.index)}>
          <Image
            src={thumbnailUrl}
            alt={`Cover of ${book.filename}`}
            fill
            className="object-cover border border-black rounded-t-xl cursor-pointer"
          />
        </Link>
      </div>
      <CardHeader>
        <CardTitle className="line-clamp-2 text-lg">{book.path[book.path.length - 1]}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium bg-primary/10 text-primary px-2 py-1 rounded">
            {book.file_type.toUpperCase()}
          </span>
          <span className="text-sm text-muted-foreground">
            {book.size.toFixed(2)} MB
          </span>
        </div>
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
          Path: {book.path.join(' > ')}
        </p>
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium">
            {book.relevance_score && 
              <>Relevance: {(book.relevance_score * 100).toFixed(2)}%</>
            }
          </p>
          <Button asChild size="sm" variant="outline" >
            <Link href={`https://huggingface.co/datasets/thefcraft/gentoomen-lib/resolve/main/${book.path.join('/')}`}>
              <Download className="w-4 h-4 mr-2" />
              Download
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

