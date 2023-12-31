import ReactDOM from 'react-dom/client';
import './index.css';
import { NotAuthenticateSpace, AuthenticateSpace, authenticateLoader } from './App';

import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import SigninPage from './pages/Singin/SigninPage';
import SignupPage from './pages/Signup/SignupPage';
import ForgotPasswordPage from './pages/ForgotPassword/ForgotPasswordPage';
import ProfileCurrentUser from './pages/Profile/ProfileCurrentUser/ProfileCurrentUser';

import ResetPasswordPage from './pages/ResetPassword/ResetPasswordPage';
import ProfileUser from './pages/Profile/ProfileUser/ProfileUser';
import ErrorPage from './pages/ErrorPage/ErrorPage';
import Search from './pages/Search/Search';
import SearchElement from './pages/SearchElement/SearchElement';

const router = createBrowserRouter([
  {
    path: "",
    element: <NotAuthenticateSpace />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "",
        element: <SigninPage />
      },
      {
        path: "/signin",
        element: <SigninPage />
      },
      {
        path: "signin/password",
        element: <ForgotPasswordPage />
      },
      {
        path: "signin/resetPassword",
        element: <ResetPasswordPage />
      },
      {
        path: "signup",
        element: <SignupPage />
      }
    ]
  },
  {
    path: "",
    element: <AuthenticateSpace />,
    loader: authenticateLoader,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "profile",
        element: <ProfileCurrentUser />
      },
      {
        path: "/profile/:id",
        element: <ProfileUser />
      },
      {
        path: "/search",
        element: <Search />
      },
      {
        path: "/search/:imdb_code",
        element: <SearchElement />
      }
    ]
  }
])

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <RouterProvider router={router} />
);