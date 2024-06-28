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
import { Checkbox } from "./components/ui/checkbox";

function Books() {

  const [title, setTitle] = useState("Book List");
  const [books, setBooks] = useState([]);

  const [selectedItems, setSelectedItems] = useState([]);

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
        <Card onClick={function (event) {
          if (!selectedItems.some(e => e.bookID === book.bookID)) {
            setSelectedItems(selectedItems => [...selectedItems, book])
          } else {
            setSelectedItems(selectedItems.filter(e => e.bookID !== book.bookID))
          }
        }}>
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
          <div>
            < SearchBooksDialog setTitle={setTitle} setBooks={setBooks} /> < ImportBooksDialog setTitle={setTitle} selectedItems={selectedItems} />
          </div>
        </CardFooter>
      </Card>
    </>
  )
}

const ImportBooksDialog = ({ setTitle, selectedItems }) => {

  const [formValue, setFormValue] = useState({});

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" className="button">Import Books</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Search</DialogTitle>
          <DialogDescription>
            Enter the search keywords. Leave empty if not applicable
          </DialogDescription>
        </DialogHeader>

        {/* {console.log(selectedItems)} */}

        <div>

        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button type="submit" onClick={function (event) {
              setTitle("Book List")
            }
            }>
              Submit
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>

  )
}

const SearchBooksDialog = ({ setTitle, setBooks }) => {

  const [formValue, setFormValue] = useState({});

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" className="button">Search Books</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Search</DialogTitle>
          <DialogDescription>
            Enter the search keywords. Leave empty if not applicable
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
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
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button type="submit" onClick={function (event) {

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
                    setTitle("Search Results")
                    setBooks(data);
                  })
                  .catch((error) => {
                    console.log(error);
                  });
              }

            }
            }>
              Search
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>

  )
}

export default Books