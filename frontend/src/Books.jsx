import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

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
        </Card>
      </div>
    )
  } else {
    content = <div>
      <CardDescription>Book List Empty</CardDescription>
    </div>
  }

  const [formValue, setFormValue] = useState({});

  const [result, setResult] = useState([])

  // const [uploadItems, setUploadItems] = useState([])

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
    setResult([])
  }

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

            <Dialog className="m-20">

              <DialogTrigger asChild className="w-full">
                <Button type="submit" variant="ghost" className="w-full m-2" onClick={function () {

                  let link = "https://library-app-6cyw.onrender.com/api/v1/fetch?"

                  {
                    ['title', 'authors', 'isbn', 'publisher', 'page']
                      .map(value => {
                        if (formValue[value] !== undefined)
                          link += value + "=" + formValue[value] + "&"
                      }
                      )
                  }

                  fetch(link)
                    .then((response) => {
                      return response.json();
                    })
                    .then((data) => {
                      console.log(data)
                      setResult(data);
                    })
                    .catch((error) => {
                      console.log(error);
                    });

                }}>Search</Button>
              </DialogTrigger>

              <DialogContent className="flex flex-col h-screen items-center overflow-scroll w-full">

                <DialogHeader>
                  <DialogTitle>Import</DialogTitle>
                </DialogHeader>
                {
                  result.map(book =>
                    <div key={book.isbn} className="w-full">

                      <Card className="list-card m-4 w-full">
                        <CardHeader>
                          <CardTitle>{book.authors}</CardTitle>
                          <CardDescription>{book.title}</CardDescription>

                          <CardContent>

                            <div class="flex justify-between items-center w-full">

                              <Label htmlFor="count" className="text-xl">Count:</Label>
                              <Input id="count" defaultValue="0" onChange={function (e) {
                                book.book_count = e.target.value

                                setUploadItems(uploadItems => uploadItems.filter(b => b.bookID !== book.bookID))

                                if (e.target.value != 0) {
                                  setUploadItems(uploadItems => [...uploadItems, book])
                                }

                              }} />

                            </div>
                          </CardContent>

                        </CardHeader>
                      </Card>
                    </div>
                  )
                }

                <DialogClose>
                  <DialogFooter>
                    <Button type="submit" onClick={onImportClick}>Import Selected</Button>
                  </DialogFooter>
                </DialogClose>

              </DialogContent>

            </Dialog >

          </Card>

        </CardFooter>
      </Card>
    </>
  )
}

export default Books