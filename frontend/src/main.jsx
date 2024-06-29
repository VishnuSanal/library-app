import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import Books from './Books.jsx';
import Members from './Members.jsx';
import Issues from './Issues.jsx';
import Search from './Search.jsx';
import NewIssue from './NewIssue.jsx';

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
    path: "/books/new_issue",
    element: < NewIssue />,
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
