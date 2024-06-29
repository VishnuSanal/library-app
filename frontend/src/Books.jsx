import './App.css'

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { useEffect, useState } from 'react';
import { Button } from './components/ui/button';
import { Label } from "./components/ui/label";
import { Input } from "./components/ui/input";
import { Link } from "react-router-dom";

function Books() {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    fetch('https://library-app-6cyw.onrender.com/api/v1/book/')
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        setBooks(data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [])

  let content;

  if (books.length > 0) {
    content = books.map(book =>
      <div key={book.isbn}>
        <Card className="list-card m-4">
          <CardHeader>
            <CardTitle>{book.authors}</CardTitle>
            <CardDescription>{book.title}</CardDescription>
          </CardHeader>
          <CardContent>
            Stock Left: {book.book_count}
          </CardContent>
        </Card>
      </div>
    )
  } else {
    content = <div>
      <CardDescription>Book List Empty</CardDescription>
    </div>
  }

  const [formValue, setFormValue] = useState({});

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Book List</CardTitle>
        </CardHeader>
        <CardContent>
          <div>{content}</div>
        </CardContent>
        <CardFooter className="flex items-center justify-center w-full">

          <Card className="p-8 ">

            {
              ['Title', 'Authors', 'ISBN', 'Publisher', 'Page']
                .map(currentItem =>
                  <div className="grid grid-cols-4 items-center gap-4" key={currentItem}>
                    <Label htmlFor={currentItem.toLowerCase()} className="text-right">
                      {currentItem}
                    </Label>
                    <Input
                      id={currentItem.toLowerCase()}
                      className="m-2 col-span-3"
                      onChange={function (e) {
                        setFormValue({ ...formValue, [currentItem.toLowerCase()]: e.target.value })
                      }}
                    />
                  </div>
                )
            }

            < Link to="search" >

              <Button type="submit" variant="ghost" className="w-full m-2" onClick={() => {

                let link = "https://library-app-6cyw.onrender.com/api/v1/fetch?"

                {
                  ['title', 'authors', 'isbn', 'publisher', 'page']
                    .map(value => {
                      if (formValue[value] !== undefined)
                        link += value + "=" + formValue[value] + "&"
                    }
                    )
                }

                sessionStorage.setItem('books_search_link', link)

              }}>Search</Button>

            </Link>
          </Card>

        </CardFooter >
      </Card >
    </>
  )
}

export default Books