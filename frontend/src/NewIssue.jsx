import './App.css'

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

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

import { useEffect, useState } from 'react';
import { Button } from './components/ui/button';
import { Label } from "./components/ui/label";
import { Input } from "./components/ui/input";
import { useNavigate } from "react-router-dom";

function NewIssue() {

  const book = JSON.parse(sessionStorage.getItem('new_issue_item'))

  let link = 'https://library-app-6cyw.onrender.com/api/v1/member'

  const [members, setMembers] = useState([]);

  useEffect(() => {
    fetch(link)
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        setMembers(data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [])

  const nav = useNavigate()

  const onSubmitClick = (member) => {

    // https://stackoverflow.com/a/1056730/9652621
    var d = new Date();
    var curr_date = d.getDate();
    var curr_month = d.getMonth() + 1;
    var curr_year = d.getFullYear();
    let date_str = curr_date + "-" + curr_month + "-" + curr_year

    fetch('https://library-app-6cyw.onrender.com/api/v1/issue', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(
        { 'member_id': member.id, 'book_id': book['bookID'], 'issue_date': date_str }
      )
    }).then(response => response.text())
      .then(data => console.log(data))

    nav("/books");
  }

  let content;

  if (members.length > 0) {
    content = members.map(member =>

      <Dialog key={member.id}>

        <DialogTrigger className='w-full' key={member.id}>

          <Card className="list-card m-4" key={member.id}>
            <CardHeader>
              <CardTitle>{member.name}</CardTitle>
              <CardDescription>ID: {member.id}</CardDescription>
            </CardHeader>
          </Card>

        </DialogTrigger>

        <DialogContent className="flex flex-col">
          <DialogHeader>
            <DialogTitle>Confirm</DialogTitle>
          </DialogHeader>

          <DialogDescription>Confirm issue {book['title']} to {member.name}</DialogDescription>

          <DialogClose asChild >

            <DialogFooter> <Button variant="ghost" type="clear">Cancel</Button> <Button type="submit" variant="ghost" onClick={() => onSubmitClick(member)}>Submit</Button> </DialogFooter>

          </DialogClose>
        </DialogContent>
      </Dialog >

    )
  } else {
    content = <div>
      <CardDescription>Search Result Empty</CardDescription>
    </div>
  }



  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>New Book Issue</CardTitle>
          <CardDescription>Select a Member to issue</CardDescription>
        </CardHeader>
        <CardContent>

          {content}

        </CardContent>
      </Card >
    </>
  )
}

export default NewIssue