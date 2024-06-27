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

  // http://127.0.0.1:5000/api/v1/init/

  fetch('https://frappe.io/api/method/frappe-library')
    .then((response) => {
      return response.json();
    })
    .then((data) => console.log(data));

  const [books, setBooks] = useState([]);

  useEffect(() => {
    fetch(link)
      .then((response) => {
        console.log(response);
        response.json();
      })
      .then((data) => {
        console.log(data);
        setBooks(data);
      })
      .catch((error) => {
        // reject(error);
      });
  }, []);

  console.log(books);

  return (
    <div>
      {books.map((book) => (
        <Card className="w-[350px]">
          <CardHeader>
            <CardTitle>{book.title}</CardTitle>
            <CardDescription>
              {book.authors}
            </CardDescription>
          </CardHeader>
          <CardContent>{book}</CardContent>
        </Card>
      ))}
    </div>
  );
};

export default Fetch;
