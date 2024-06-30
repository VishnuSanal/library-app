import '../App.css'

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { useEffect, useState } from 'react';
import { Button } from '../components/ui/button';
import { Label } from "../components/ui/label";
import { Input } from "../components/ui/input";
import { Link } from "react-router-dom";
import { RotatingLines } from 'react-loader-spinner';
import { DeleteIcon, Trash } from 'lucide-react';
import { IconButton, Text } from 'rsuite';
import { Toaster, toast } from 'sonner';

function Books() {
  const [books, setBooks] = useState([]);

  const [loading, setLoading] = useState(true);

  const [formValue, setFormValue] = useState({});

  const deleteBook = (book) => {

    fetch('https://library-app-6cyw.onrender.com/api/v1/book?bookID=' + book.bookID, {
      method: 'DELETE',
    }).then(response => response.json())
      .then(data => { setBooks(data); })

  }

  useEffect(() => {
    fetch('https://library-app-6cyw.onrender.com/api/v1/book/')
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        setLoading(false)
        setBooks(data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [loading])

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Book List</CardTitle>
          <CardDescription>Click on a book to issue</CardDescription>
        </CardHeader>
        <CardContent>

          <div className='flex justify-center'>
            <RotatingLines
              strokeColor="grey"
              strokeWidth="5"
              animationDuration="0.75"
              width="48"
              visible={loading} />
          </div>

          <div>
            {
              (books.length >= 0) ?
                books.map(book =>
                  <div key={book.bookID}>

                    <Card className="list-card m-4">
                      <CardHeader>
                        <CardTitle>{book.title}</CardTitle>
                        <CardDescription>{book.authors}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Text className='m-4'> Stock Left: {book.book_count} </Text>
                        <div className='flex align-middle'>

                          <Link to="members" >
                            <Button
                              variant="ghost"
                              className='mr-auto'
                              onClick={() => {
                                sessionStorage.setItem('new_issue_item', JSON.stringify(book))
                              }}
                            >Issue Book</Button>
                          </Link>

                          <IconButton
                            id='delete_book_icon'
                            onClick={() => {

                              toast('Delete Book?', {
                                action: {
                                  label: "Conirm",
                                  onClick: () => deleteBook(book),
                                },
                              })

                            }}
                            className='m-4 ml-auto'
                            icon={<Trash />} />
                        </div>
                      </CardContent>
                    </Card>

                  </div>
                )
                :
                <div>
                  <CardDescription>Book List Empty</CardDescription>
                </div>
            }

          </div>
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

                sessionStorage.setItem('books_search_link', new URL(link).href)

              }}>Search</Button>

            </Link>
          </Card>

          <Toaster />

        </CardFooter >
      </Card >
    </>
  )
}

export default Books