import { Link, useNavigate } from 'react-router-dom';
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

import './App.css'

import { useEffect, useState } from 'react';
import { Button } from './components/ui/button';
import { Label } from "./components/ui/label";
import { Input } from "./components/ui/input";

function Members() {

  const [members, setMembers] = useState([]);

  const nav = useNavigate();

  const onIssueClick = (member) => {

    fetch('https://library-app-6cyw.onrender.com/api/v1/issue', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(
        { 'member_id': member.id, 'book_id': book['bookID'] }
      )
    }).then(response => response.text())
      .then(data => console.log(data))

    sessionStorage.setItem('new_issue_item', "{}")

    nav("/books");
  }

  useEffect(() => {
    fetch('https://library-app-6cyw.onrender.com/api/v1/member/')
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

  const book = JSON.parse(sessionStorage.getItem('new_issue_item'))

  let content;

  if (members.length > 0 && book == {}) {
    content = members.map(member =>
      <div key={member._id}>
        <Card className="list-card m-4">
          <CardHeader>
            <CardTitle>{member.name}</CardTitle>
            <CardDescription>Amount Due: {member.amount_due}</CardDescription>
          </CardHeader>
          <CardContent>
            <CardDescription>Books Issued: {member.books_issued}</CardDescription>
            <CardDescription>Dates: {member.issue_dates}</CardDescription>
          </CardContent>
        </Card>
      </div>
    )
  } else if (book != {}) {

    content = members.map(member =>

      <Dialog key={member.id}>

        <DialogTrigger className='w-full' key={member.id} >

          <Card className="list-card m-4" onClick={() => { }}>
            <CardHeader>
              <CardTitle>{member.name}</CardTitle>
              <CardDescription>Amount Due: {member.amount_due}</CardDescription>
            </CardHeader>
            <CardContent>
              <CardDescription>{member.books_issued}</CardDescription>
              <CardDescription>{member.issue_dates}</CardDescription>
            </CardContent>
          </Card>

        </DialogTrigger>

        <DialogContent className="flex flex-col">
          <DialogHeader>
            <DialogTitle>Confirm</DialogTitle>
          </DialogHeader>

          <DialogDescription>Confirm issue {book['title']} to {member.name}</DialogDescription>

          <DialogClose asChild >

            <DialogFooter> <Button variant="ghost" type="clear">Cancel</Button> <Button type="submit" variant="ghost" onClick={() => onIssueClick(member)}>Submit</Button> </DialogFooter>

          </DialogClose>
        </DialogContent>
      </Dialog >

    )

  } else {
    content = <div>
      <CardDescription>Member List Empty</CardDescription>
    </div>
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Member List</CardTitle>
        </CardHeader>
        <CardContent>
          <div>{content}</div>
        </CardContent>
        <CardFooter>
          < NewMemberDialog />
        </CardFooter>
      </Card>
    </>
  )
}

const NewMemberDialog = () => {

  const [formValue, setFormValue] = useState({});

  const onClick = () => {

    fetch('https://library-app-6cyw.onrender.com/api/v1/member', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 'name': formValue['name'] })
    }).then(response => response.text())
      .then(data => console.log(data))

    setFormValue({})
  }

  return (
    <Dialog>

      <DialogTrigger asChild>
        <Button variant="ghost" className="button">Add New Member</Button>
      </DialogTrigger>

      <DialogContent className="flex flex-col">

        <DialogHeader>
          <DialogTitle>New Member</DialogTitle>
        </DialogHeader>

        <DialogDescription>Enter Member Details</DialogDescription>
        {
          ['Name']
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

        <DialogClose asChild >

          <DialogFooter> <Button type="submit" onClick={onClick}>Search</Button> </DialogFooter>

        </DialogClose>

      </DialogContent>

    </Dialog >

  )
}

export default Members