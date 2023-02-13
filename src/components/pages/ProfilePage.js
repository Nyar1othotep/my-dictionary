import Logout from "components/logout/Loguot";
import { useAuth } from "hooks/useAuth.hook";
import { Navigate, Link } from "react-router-dom";
import { useHttp } from "hooks/http.hook";
import { useEffect, useState, useMemo } from "react";
import { db } from "../../firebase";
import {
   collection,
   query,
   where,
   addDoc,
   deleteDoc,
   doc,
} from "firebase/firestore";
import setContent from "../../utils/setContent";
import svg from "../../resourses/svg/sprites.svg";
import Header from "components/header/header";
import { useDispatch } from "react-redux";
import { setWords } from "store/slices/wordsSlice";
import Popup from "reactjs-popup";
import AddMyWordsForm from "components/addMyWordsForm/addMyWordsForm";
import { useAlert } from "react-alert";
import ErrorBoundary from "../errorBoundary/ErrorBoundary";
import Helmet from "react-helmet";

const ProfilePage = () => {
   const alert = useAlert();
   const dispatch = useDispatch();
   const { isAuth, userUID } = useAuth();
   const [wordsList, setWordsList] = useState([]);
   const [isDelete, setIsDelete] = useState(false);

	const { request, process, setProcess } = useHttp();

   const usersWordsCollectionRef = collection(db, "usersWords");
   const q = query(usersWordsCollectionRef, where("UserUID", "==", userUID));

   useEffect(() => {
      onRequest();
      // eslint-disable-next-line
   }, [isDelete]);

   const onRequest = () => {
      request(q)
         .then(onWordsListLoaded)
         .then(() => setProcess("confirmed"));
   };

   const onWordsListLoaded = (data) => {
      setWordsList((wordsList) =>
         data.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
      );
   };

   const addNewDoc = async (title) => {
      await addDoc(collection(db, "usersWords"), {
         UserUID: userUID,
         title,
         wordsArray: [],
      });
      onRequest();
      alert.success("Item added!");
   };

   const deleteItem = async (id) => {
      try {
         const itemDoc = doc(db, "usersWords", id);
         await deleteDoc(itemDoc);
         onRequest();
      } catch (error) {
         console.error(error.message);
      }
   };

   const onRemove = (itemID) => {
      if (window.confirm("Are you sure you want to delete this item?"))
         deleteItem(itemID);
      alert.success("Item deleted!");
   };

   function renderItems(arr) {
      const items = arr.map((item, i) => {
         return !isDelete ? (
            <Link
               to="/words"
               key={item.id}
               onClick={() => {
                  dispatch(
                     setWords({
                        wordsID: item.id,
                        title: item.title,
                        wordsArray: item.wordsArray,
                     })
                  );
               }}
            >
               <li className="btn-words__item item-btn-words">
                  <div className="item-btn-words__title">
                     {item.title.substring(0, 28) + ""}
                  </div>
                  <svg>
                     <use href={`${svg}#go`}></use>
                  </svg>
               </li>
            </Link>
         ) : (
            // eslint-disable-next-line
            <a key={item.id} onClick={() => onRemove(item.id)}>
               <li className="btn-words__item item-btn-words">
                  <div className="item-btn-words__title">
                     {item.title.substring(0, 28) + ""}
                  </div>
                  <svg>
                     <use href={`${svg}#remove`}></use>
                  </svg>
               </li>
            </a>
         );
      });
      return (
         <ul className="btn-words__list">
            <Helmet>
               <meta
                  name="description"
                  content={`My dictionary - profile page`}
               />
               <title>My dictionary - profile</title>
            </Helmet>
            {items}
            <Popup
               trigger={
                  <li className="btn-words__item item-btn-words item-btn-words--add">
                     <svg>
                        <use href={`${svg}#add`}></use>
                     </svg>
                  </li>
               }
               position="top left"
               lockScroll
               closeOnEscape
               modal
            >
               {(close) => (
                  <AddMyWordsForm handleClick={addNewDoc} onClose={close} />
               )}
            </Popup>
         </ul>
      );
   }

   const elements = useMemo(
      () => {
         return setContent(process, () => renderItems(wordsList));
      },
      // eslint-disable-next-line
      [process]
   );

   return isAuth ? (
      <div className="profile">
         <Header />
         <div className="profile-page">
            <div className="profile-page__container _container">
               <div className="profile-page__body">
                  <ErrorBoundary>
                     <Logout />
                  </ErrorBoundary>
                  <div className="profile-page__row">
                     <div className="profile-page__title">My words</div>
                     {!isDelete ? (
                        <div
                           className="profile-page__delete"
                           onClick={() => setIsDelete((isDelete) => !isDelete)}
                        >
                           <svg>
                              <use href={`${svg}#trashbin`}></use>
                           </svg>
                           Show Delete
                        </div>
                     ) : (
                        <div
                           className="profile-page__delete"
                           onClick={() => setIsDelete((isDelete) => !isDelete)}
                        >
                           <svg>
                              <use href={`${svg}#hide`}></use>
                           </svg>
                           Hide Delete
                        </div>
                     )}
                  </div>
                  {elements}
               </div>
            </div>
         </div>
         <div className="words__footer">
            Created by{" "}
            <a href="https://github.com/Nyar1othotep">Nyar1othotep</a> © 2023
         </div>
      </div>
   ) : (
      <Navigate to="/user/login" />
   );
};

export default ProfilePage;
