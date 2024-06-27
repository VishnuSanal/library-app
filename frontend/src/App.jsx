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
          <CardTitle>Panacea</CardTitle>
          <CardDescription>Welcome to Library</CardDescription>
        </CardHeader>
        <CardContent>

          <Card>
            <CardHeader>
              <CardDescription>Import Books</CardDescription>
            </CardHeader>
            <CardContent>
              {Fetch("")}
            </CardContent>
          </Card>

        </CardContent>
        <CardFooter>
          <p>(C) Vishnu Sanal T</p>
        </CardFooter>
      </Card>

    </>
  )
}

export default App
