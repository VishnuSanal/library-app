import './App.css'
import Fetch from './components/Fetch'

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

function App() {
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Library Management System</CardTitle>
          <CardDescription>Welcome!</CardDescription>
        </CardHeader>
        <CardContent>

          <Card>
            <CardHeader>
              <CardDescription>Import Books</CardDescription>
            </CardHeader>
            <CardContent>
              {Fetch('https://library-app-6cyw.onrender.com/api/v1/init/')}
            </CardContent>
          </Card>

        </CardContent>
      </Card>

    </>
  )
}

export default App
