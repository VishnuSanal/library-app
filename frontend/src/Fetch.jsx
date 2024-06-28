import './App.css'

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { useState, useEffect } from "react";

const Fetch = (link) => {

  const [books, setBooks] = useState([]);

  useEffect(() => {
    fetch(link)
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        setBooks(data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return (
    books.map(book =>
      <div key={book.isbn}>
        <Card>
          <CardHeader className="card-sec">
            <CardTitle>{book.authors}</CardTitle>
            <CardDescription>{book.title}</CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  );
};

export default Fetch;
