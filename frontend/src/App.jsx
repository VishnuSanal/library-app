import './App.css'

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useEffect, useState } from 'react';


function App() {

  let [target, setTarget] = useState(['Books', 'Issues', 'Members'])
  let [screen, setScreen] = useState('Dashboard')

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Library Management System</CardTitle>
        </CardHeader>
        <CardContent>

          {
            target
              .map(item =>
                <Card className='card'
                  key={item}
                  onClick={function () {

                    setScreen(item)

                    switch (screen) {
                      case 'Books':
                        setTarget(['Import Books'])
                        break;
                      case 'Issues':
                        setTarget(['New Issue'])
                        break;
                      case 'Members':
                        setTarget(['Add Members'])
                        break;
                      default:
                        setTarget(['Books', 'Issues', 'Members'])
                    }

                  }}>
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
