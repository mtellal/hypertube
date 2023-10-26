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

export async function authenticateLoader({ request }: any) {
   let user: any;
   const urlParams = new URLSearchParams(new URL(request.url).search);
   const token = urlParams.get('token');
   if (token) {
      document.cookie = `access_token=${token}; path=/`;
   }
   try {
      await getUserRequest()
         .then(async res => {
            user = res.data.user;
            // console.log(user)
            if (user && user.userId && user.photoPath) {
               await getUserPhotoRequest(user.userId)
                  .then((res: any) => { user.photos = [window.URL.createObjectURL(res.data)] })
            }
         })
   }
   catch (e) {
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

export function AuthenticateSpace() {

   const { user, token }: any = useLoaderData();

   return (
      <LanguageProvier>
         <UserProvider _user={user} userId={user.userId} token={token}>
            <div className="App">
               <HeaderConnected status="connected" />
               <VideoProvider>
                  <div style={{ height: '93vh', width: '100%', position: 'relative' }}>
                     <Outlet context={{ user, salut: "dfwfw" }} />
                  </div>
               </VideoProvider>
               <div className='footer'> Hypertube </div>
            </div>
         </UserProvider>
      </LanguageProvier>
   );
}

