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
          <CardTitle>Library Dashboard</CardTitle>
        </CardHeader>
        <CardContent>
          <>
            {
              ['Books', 'Issues', 'Members']
                .map(item =>
                  <Card className='card'
                    key={item}
                    onClick={function () {
                      switch (item) {
                        case 'Books':
                          // setListEndpoint('https://library-app-6cyw.onrender.com/api/v1/book/')
                          break;
                        case 'Issues':
                          break;
                        case 'Members':
                          break;
                        default:
                      }
                    }}>
                    <CardHeader>
                      <CardTitle>{item}</CardTitle>
                    </CardHeader>
                  </Card>
                )
            }
          </>
        </CardContent>
      </Card>

    </>
  )
}

export default App
