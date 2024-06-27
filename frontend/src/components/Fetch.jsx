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
        data.forEach(book => {
          setBooks(data);
        });
      })
      .catch((error) => {
        // reject(error);
      });
  }, []);

  return (
    books.map(book =>
      <div key={book.isbn}>
        <Card>
          <CardHeader>
            <CardTitle>{book.authors}</CardTitle>
          </CardHeader>
          <CardContent>{book.title}</CardContent>
        </Card>
      </div>
    )
  );
};

export default Fetch;
