import { Link } from 'react-router-dom';
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
                  <Link to={item.toLowerCase()} key={item}>

                    <Card className='card'>
                      <CardHeader>
                        <CardTitle>{item}</CardTitle>
                      </CardHeader>

                    </Card>
                  </Link>
                )
            }
          </>
        </CardContent>
      </Card>
    </>
  )
}

export default App