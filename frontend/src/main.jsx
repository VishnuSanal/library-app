import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import Books from './Books.jsx';
import Members from './Members.jsx';
import Search from './Search.jsx';

const router = createBrowserRouter([
  {
    path: "/",
    element: < App />,
  },
  {
    path: "books",
    element: < Books />,
  },
  {
    path: "/books/search",
    element: < Search />,
  },
  {
    path: "/books/members",
    element: < Members />,
  },
  

  {
    path: "members",
    element: < Members />,
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <RouterProvider router={router} />
)
