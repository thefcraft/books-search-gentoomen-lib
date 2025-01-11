"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Book, Search } from "lucide-react";
import BookCard from "@/components/book-card";
import { BookType } from "@/lib/types";
import axios, { AxiosError } from "axios";
import { API_URL } from "@/lib/constants";
import { notFound, useSearchParams } from "next/navigation";
import Link from "next/link";
import { redirect } from "next/navigation";


export default function BookSearch() {
  const searchParams = useSearchParams()
  const search = searchParams.get('search')
  
  const [searchQuery, setSearchQuery] = useState(search || "");
  const [searchResult, setSearchResult] = useState<BookType[]>([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  const [error, setError] = useState('');
  const setRandomResult = () => {
    setLoading(true);
    axios.get(`${API_URL}?max_results=${8}`).then((res) => {
      setSearchResult(res.data.results);
    }).catch((err: AxiosError | any) => {
      setError(`Error: ${err.response?.data.detail}`);
      setTimeout(() => setError(''), 3000);
    }).finally(() => {
      setLoading(false);
      setInitialLoading(false);
    })
  }
  
  const handleSubmit = () => {
    if (!searchQuery) {
      setRandomResult();
      return;
    }
    setLoading(true);
    axios.post("http://localhost:8000/search", {
      "query": searchQuery,
      "max_results": 20
    }).then((res) => {
      setSearchResult(res.data.results);
    }).catch((err: AxiosError | any) => {
      setError(`Error: ${err.response?.data.detail}`);
      setTimeout(() => setError(''), 3000);
    }).finally(() => {
      setLoading(false);
      setInitialLoading(false);
    })
  }

  useEffect(() => {
    if(!search) setRandomResult();
    else handleSubmit();
  }, [])

  if (initialLoading) {
    return <>Loading...</>
  }
  return (
    <div className="container mx-auto p-4">
      <Link href={'/'}>
        <h1 className="text-4xl font-bold mb-8 text-center">
          Book Search Engine
        </h1>
      </Link>

      <div className="bg-card rounded-lg shadow-md p-6 mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-grow">
            <Input
              type="text"
              placeholder="Search for books..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !loading && (() => {
                handleSubmit();
                redirect(`?search=${searchQuery}`);
              })()}
              className="w-full"
            />
          </div>
          <Button className="w-full md:w-auto cursor-pointer" disabled={loading} onClick={handleSubmit}>
            <Link href={`?search=${searchQuery}`} className="flex">
                <Search className="mr-2 h-4 w-4" /> Search
            </Link>
          </Button>
        </div>
      </div>
      {error && <div className="text-red-500 text-xl text-center mb-4 py-2 rounded-sm -mt-4 bg-red-100">{error}</div>}
      <div className="grid gap-6 max-w-[450px] mx-auto md:max-w-[unset] md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {searchResult.map((book, index) => (
          <BookCard key={index} book={book} />
        ))}
      </div>

      {searchResult.length === 0 && (
        <div className="text-center py-24 md:py-48">
          <Book className="mx-auto h-12 w-12 text-muted-foreground" />
          <h2 className="mt-4 text-lg font-semibold">No books found</h2>
          <p className="mt-2 text-muted-foreground">
            Try adjusting your search or filters to find what you're looking
            for.
          </p>
        </div>
      )}
    </div>
  );
}
