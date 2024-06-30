import { useLocation, useNavigate } from 'react-router-dom';
import '../App.css'

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
import { Button } from '../components/ui/button';
import { Label } from "../components/ui/label";
import { Input } from "../components/ui/input";
import { toast } from 'sonner';
import { Toaster } from '@/components/ui/sonner';
import { RotatingLines } from 'react-loader-spinner';

function Members() {

  const [members, setMembers] = useState([]);

  const [newName, setNewName] = useState("");

  const [loading, setLoading] = useState(true);

  const location = useLocation();

  const book = JSON.parse(sessionStorage.getItem('new_issue_item'))

  const onIssueClick = (member, book) => {

    fetch('https://library-app-6cyw.onrender.com/api/v1/issue', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(
        { 'member_id': member.id, 'book_id': book['bookID'] }
      )
    }).then(response => response.json())
      .then(data => { setMembers(data); })

    sessionStorage.setItem('new_issue_item', "{}")
  }

  const onReturnClick = (member, book_id) => {

    fetch('https://library-app-6cyw.onrender.com/api/v1/issue', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(
        { 'member_id': member.id, 'book_id': book_id }
      )
    }).then(response => response.json())
      .then(data => { setMembers(data); })

  }

  useEffect(() => {
    fetch('https://library-app-6cyw.onrender.com/api/v1/member/')
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        setMembers(data);
        setLoading(false)
      })
      .catch((error) => {
        console.log(error);
      });
  }, [])

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Member List</CardTitle>
          <CardDescription>Click on a member to issue</CardDescription>
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

          <div>{

            (members.length > 0) ?

              members.map(member =>
                <div key={member._id}>
                  <Card className="list-card m-4" onClick={(e) => {
                    if (location.pathname == "/books/members" && e.target.innerText != "Return Book")
                      toast('Issue book ' + book.title + ' to ' + member.name + '?', {
                        action: {
                          label: "Conirm",
                          onClick: () => onIssueClick(member, book),
                        },
                      })

                  }}>
                    <CardHeader>
                      <CardTitle>{member.name}</CardTitle>
                      <CardDescription>Amount Due: {member.amount_due}</CardDescription>
                    </CardHeader>

                    <CardContent>

                      <CardDescription>Books Issued</CardDescription>

                      {
                        member.books_issued?.map((book_id, idx) =>
                          <Card className="list-card m-4">
                            <CardContent>

                              {/* TODO: add book name here */}
                              <CardDescription>{book_id}</CardDescription>
                              <CardDescription>Issue Date: {member.issue_dates[idx]}</CardDescription>

                            </CardContent>

                            <CardFooter>
                              <Button type="submit" variant="ghost" onClick={() => onReturnClick(member, book_id)}>Return Book</Button>
                            </CardFooter>
                          </Card>
                        )
                      }

                    </CardContent>

                  </Card>
                </div>
              )
              :
              <div>
                <CardDescription>Member List Empty</CardDescription>
              </div>


          }</div>
        </CardContent>
        <CardFooter>

          <Dialog>

            <DialogTrigger asChild>
              <Button variant="ghost" className="button">Add New Member</Button>
            </DialogTrigger>

            <DialogContent className="flex flex-col">

              <DialogHeader>
                <DialogTitle>New Member</DialogTitle>
              </DialogHeader>

              <DialogDescription>Enter Member Details</DialogDescription>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input
                  id="name"
                  defaultValue=""
                  onChange={function (e) {
                    setNewName(e.target.value)
                  }}
                  className="col-span-3"
                />
              </div>

              <DialogClose asChild >

                <DialogFooter>

                  <Button type="submit" onClick={() => {

                    fetch('https://library-app-6cyw.onrender.com/api/v1/member', {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json',
                      },
                      body: JSON.stringify({ 'name': newName })
                    }).then((response) => {
                      return response.json();
                    }).then((data) => {
                      setMembers(data);
                    })

                  }}>Search</Button>

                </DialogFooter>

              </DialogClose>

            </DialogContent>

          </Dialog >

          <Toaster />

        </CardFooter>
      </Card>
    </>
  )
}

export default Members