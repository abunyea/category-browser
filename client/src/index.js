import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  createBrowserRouter,
  RouterProvider,
} from 'react-router-dom';
import './index.css';
import ErrorPage from './error-page';
import Root from './routes/root';
import Categories, { loader as categoriesLoader, searchLoader } from './routes/categories';
import Category, { loader as categoryLoader } from './routes/category';
import reportWebVitals from './reportWebVitals';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />, 
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <Categories />,
        loader: categoriesLoader,
      },
      {
        path: 'search',
        element: <Categories />,
        loader: searchLoader,
      },
      {
        path: 'categories/:conceptId',
        element: <Category />,
        loader: categoryLoader,
      }
    ],
  },
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
