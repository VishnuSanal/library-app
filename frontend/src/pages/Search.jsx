import '../App.css'

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { useEffect, useState } from 'react';
import { Button } from '../components/ui/button';
import { Label } from "../components/ui/label";
import { Input } from "../components/ui/input";
import { useNavigate } from "react-router-dom";
import { RotatingLines } from 'react-loader-spinner';

function Search() {

  let link = sessionStorage.getItem('books_search_link')

  const [books, setBooks] = useState([]);

  const [loading, setLoading] = useState(true);

  const [uploadItems, setUploadItems] = useState([])

  const nav = useNavigate()

  useEffect(() => {
    fetch(link)
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        setBooks(data);
        setLoading(false)
      })
      .catch((error) => {
        console.log(error);
      });
  }, [])

  const onImportClick = () => {

    uploadItems?.forEach((book) => {

      fetch('https://library-app-6cyw.onrender.com/api/v1/book', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(book)
      }).then(response => response.text())
        .then(data => console.log(data))

    })

    setUploadItems([])

    nav(-1);
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Search Results</CardTitle>
        </CardHeader>
        <CardContent>

          <div className='flex justify-center'>
            <RotatingLines
              strokeColor="grey"
              strokeWidth="5"
              animationDuration="0.75"
              width="48"
              visible={loading} />
          </div>

          <div>{

            (books.length > 0) ?
              books.map(book =>
                <div key={book.bookID}>
                  <Card className="list-card m-4">
                    <CardHeader>
                      <CardTitle>{book.title}</CardTitle>
                      <CardDescription>{book.authors}</CardDescription>
                    </CardHeader>

                    <CardContent>

                      <div className="flex justify-between items-center w-full">

                        <Label htmlFor="count" className="text-xl m-2">Count:</Label>

                        <Input id="count" defaultValue="0" onChange={function (e) {
                          book.book_count = e.target.value

                          setUploadItems(uploadItems => uploadItems.filter(b => b.bookID !== book.bookID))

                          if (e.target.value != 0) {
                            setUploadItems(uploadItems => [...uploadItems, book])
                          }

                        }} />

                      </div>

                    </CardContent>

                  </Card>
                </div>
              )
              :
              <div>
                <CardDescription>Search Result Empty</CardDescription>
              </div>

          }</div>
        </CardContent>
        <CardFooter className="flex items-center justify-center w-full">

          <Button type="submit" variant="ghost" className="w-full m-2" onClick={() => {
            onImportClick()
          }}
          >Import</Button>

        </CardFooter >
      </Card >
    </>
  )
}

export default Search