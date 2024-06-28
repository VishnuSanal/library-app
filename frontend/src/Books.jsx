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
import { List } from "lucide-react";

function Books() {

  const [title, setTitle] = useState("Book List");
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
        <Card>
          <CardHeader className="list-card">
            <CardTitle>{book.authors}</CardTitle>
            <CardDescription>{book.title}</CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  } else {
    content = <div>
      <CardDescription>{title} Empty</CardDescription>
    </div>
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div>{content}</div>
        </CardContent>
        <CardFooter>
          < SearchBooksDialog />
        </CardFooter>
      </Card>
    </>
  )
}

const SearchBooksDialog = () => {

  const [formValue, setFormValue] = useState({});
  const [result, setResult] = useState([])

  const [dialogContent, setDialogContent] = useState()

  const onClick = () => {

    let link = "https://library-app-6cyw.onrender.com/api/v1/fetch?"

    {
      ['title', 'authors', 'isbn', 'publisher', 'page']
        .map(value => {
          if (formValue[value] !== undefined)
            link += value + "=" + formValue[value] + "&"
        }
        )
    }

    {
      fetch(link)
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          setResult(data);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }

  useEffect(() => {

    if (result.length > 0) {
      setDialogContent(
        <div className="w-max-max">

          <DialogContent className="flex flex-col h-screen overflow-scroll">

            <DialogHeader>
              <DialogTitle>Search</DialogTitle>
            </DialogHeader>

            <div>
              {
                result?.map(book =>
                  <div key={book.isbn}>

                    <Card className="list-card m-4">
                      <CardHeader>
                        <CardTitle>{book.authors}</CardTitle>
                        <CardDescription>{book.title}</CardDescription>
                      </CardHeader>
                    </Card>

                  </div>
                )
              }
            </div>

            <DialogFooter> <Button type="submit" onClick={onClick}>Search</Button> </DialogFooter>

          </DialogContent>

        </div>
      )
    } else {
      setDialogContent(
        <div className="grid gap-4 py-4">
          <DialogContent className="flex flex-col">

            <DialogHeader>
              <DialogTitle>Search</DialogTitle>
            </DialogHeader>

            <DialogDescription>Enter the search keywords. Leave empty if not applicable</DialogDescription>
            {
              ['Title', 'Authors', 'ISBN', 'Publisher', 'Page']
                .map(currentItem =>
                  <div className="grid grid-cols-4 items-center gap-4" key={currentItem}>
                    <Label htmlFor={currentItem.toLowerCase()} className="text-right">
                      {currentItem}
                    </Label>
                    <Input
                      id={currentItem.toLowerCase()}
                      defaultValue=""
                      onChange={function (e) {
                        setFormValue({ ...formValue, [currentItem.toLowerCase()]: e.target.value })
                      }}
                      className="col-span-3"
                    />
                  </div>
                )
            }

            <DialogFooter> <Button type="submit" onClick={onClick}>Search</Button> </DialogFooter>

          </DialogContent>
        </div>
      )
    }

  }, [result])

  return (
    <Dialog>

      <DialogTrigger asChild>
        <Button variant="ghost" className="button">Search Books</Button>
      </DialogTrigger>

      {dialogContent}

    </Dialog >

  )
}

export default Books