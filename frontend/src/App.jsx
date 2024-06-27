import './App.css'

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

function App() {
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Library Management System</CardTitle>
        </CardHeader>
        <CardContent>

          {
            ['Books', 'Issues', 'Members']
              .map(item =>
                <Card className='card'>
                  <CardHeader>
                    <CardTitle>{item}</CardTitle>
                  </CardHeader>
                </Card>
              )
          }

        </CardContent>
      </Card>

    </>
  )
}

export default App
