import './App.css';
import HeaderConnected from './components/Header/HeaderConnected';
import Header from './components/Header/Header';
import { Outlet, redirect, useLoaderData } from 'react-router';
import { getUserPhotoRequest, getUserRequest } from './requests';
import { UserProvider } from './contexts/UserContext';

import movieFilms from './assets/Film rolls-rafiki.svg'

import films from './assets/films.svg'

import './pages/Singin/SigninPage.css'
import VideoProvider from './contexts/VideosProvider';
import { LanguageProvier } from './contexts/language';
import { User } from './types';


export async function authenticateLoader({ request }: any) {
   let user: User | undefined;
   const urlParams = new URLSearchParams(new URL(request.url).search);
   const token = urlParams.get('token');
   if (token) {
      document.cookie = `access_token=${token}; path=/`;
   }
   try {
      const resUser = await getUserRequest();
      user = resUser.data.user;
      if (user && user.userId && user.photoPath) {
         const resPhoto = await getUserPhotoRequest(user.userId)
         user.photo = window.URL.createObjectURL(resPhoto.data)
      }
   }
   catch (e) {
      document.cookie = `access_token=; path=/`;
      return (redirect("/signin"));
   }
   return ({ user })
}

export function NotAuthenticateSpace() {
   return (
      <div className="App">
         <LanguageProvier>
            <Header />
            <div style={{ height: '93vh', width: '100%', position: 'relative', overflow: 'hidden' }}>
               <div className='app-c'>
                  <div className='app-phoneimg-c'>
                     <img src={movieFilms} className='app-phoneimg' />
                  </div>
                  <Outlet />
                  <div className='app-usercarts-c'>
                     <div className='app-carts-c'>
                        <img src={films} className='app-carts' />
                     </div>
                  </div>
               </div>
            </div>
         </LanguageProvier>
         <div className='footer'> Hypertube </div>
      </div>
   );
}

type LoaderReturnType = {
   user?: User
}

export function AuthenticateSpace() {

   const { user }: LoaderReturnType = useLoaderData();

   return (
      <LanguageProvier>
         <UserProvider _user={user}>
            <div className="App">
               <HeaderConnected status="connected" />
               <VideoProvider>
                  <div style={{ height: '93vh', width: '100%', position: 'relative' }}>
                     <Outlet context={{ user }} />
                  </div>
               </VideoProvider>
               <div className='footer'> Hypertube </div>
            </div>
         </UserProvider>
      </LanguageProvier>
   );
}

