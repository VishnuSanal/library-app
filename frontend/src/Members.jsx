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

function Members() {

  const [books, setBooks] = useState([]);

  useEffect(() => {
    fetch('https://library-app-6cyw.onrender.com/api/v1/member/')
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

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Member List</CardTitle>
        </CardHeader>
        <CardContent>
          {
            books.map(book =>
              <div key={book.isbn}>
                <Card>
                  <CardHeader className="list-card">
                    <CardTitle>{book.authors}</CardTitle>
                    <CardDescription>{book.title}</CardDescription>
                  </CardHeader>
                </Card>
              </div>
            )
          }
        </CardContent>
      </Card>
    </>
  )
}

export default Members