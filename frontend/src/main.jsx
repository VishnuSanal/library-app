import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import Books from './Books.jsx';
import Members from './Members.jsx';
import Issues from './Issues.jsx';

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
    path: "members",
    element: < Members />,
  },
  {
    path: "issues",
    element: < Issues />,
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <RouterProvider router={router} />
)
