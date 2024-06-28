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
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { useEffect, useState } from 'react';
import { Button } from './components/ui/button';
import { Label } from "./components/ui/label";
import { Input } from "./components/ui/input";

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
      <CardDescription>List Empty</CardDescription>
    </div>
  }

  const [formValue, setFormValue] = useState({});

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div>{list}</div>

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


        </CardContent>
      </Card>
    </>
  )
}

export default Books