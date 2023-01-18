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
import EditCategory, { editAction, createAction, destroyAction } from './routes/edit';
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
        path: '/categories/new',
        element: <EditCategory />,
        action: createAction,
      },
      {
        path: '/categories/:conceptId',
        element: <Category />,
        loader: categoryLoader,
      },
      {
        path: '/categories/:conceptId/edit',
        element: <EditCategory />,
        errorElement: <div>There was a problem updating your concept.</div>,
        loader: categoryLoader,
        action: editAction,
      },
      {
        path: '/categories/:conceptId/destroy',
        action: destroyAction,
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
