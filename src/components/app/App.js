import { HashRouter, Route, Routes } from "react-router-dom";
import {
   MainPage,
   LoginPage,
   RegistrationPage,
   ProfilePage,
   WordsPage,
   CommonWordsPage,
   Page404,
} from "../pages";
import { useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useDispatch } from "react-redux";
import { setUser } from "store/slices/userSlice";
import ErrorBoundary from "../errorBoundary/ErrorBoundary";

const App = () => {
   const dispatch = useDispatch();
   const auth = getAuth();

   useEffect(() => {
      onAuthStateChanged(auth, (data) => {
         if (data !== null) {
            dispatch(
               setUser({
                  email: data.email,
                  userUID: data.uid,
                  token: data.accessToken,
               })
            );
         }
      });
      // eslint-disable-next-line
   }, []);

   return (
      <HashRouter>
         <div className="app">
            <main>
               <Routes>
                  <Route path="/" element={<MainPage />} />
                  <Route path="/user/login" element={<LoginPage />} />
                  <Route
                     path="/user/registration"
                     element={<RegistrationPage />}
                  />
                  <Route
                     path="/user/profile"
                     element={
                        <ErrorBoundary
                           styles={{
                              width: "100%",
                              height: "100vh",
                           }}
                        >
                           <ProfilePage />
                        </ErrorBoundary>
                     }
                  />
                  <Route path="/words" element={<WordsPage />} />
                  <Route path="/common-words" element={<CommonWordsPage />} />
                  <Route path="*" element={<Page404 />} />
               </Routes>
            </main>
         </div>
      </HashRouter>
   );
};
export default App;
