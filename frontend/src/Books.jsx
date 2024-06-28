import { Link } from 'react-router-dom';
import './App.css'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { useEffect, useState } from 'react';
import { Button } from './components/ui/button';

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

  let list;

  if (books.length > 0) {
    list = books.map(book =>
      <div key={book.isbn}>
        <Card>
          <CardHeader className="list-card">
            <CardTitle>{book.authors}</CardTitle>
            <CardDescription>{book.title}</CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  } else {
    list = <div>
      <CardTitle>Book List Empty</CardTitle>
      <CardDescription>Please Add Books</CardDescription>
    </div>
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Book List</CardTitle>
        </CardHeader>
        <CardContent>
          <div>{list}</div>

          <Button variant="ghost" className="button">Import Books</Button> <Button variant="ghost" className="button">Add New Book</Button>
        </CardContent>
      </Card>
    </>
  )
}

export default Books