import { useAuth } from "hooks/useAuth.hook";
import { Link } from "react-router-dom";
import { useEffect, useState, useMemo } from "react";
import { db } from "../../firebase";
import { collection, addDoc, deleteDoc, doc } from "firebase/firestore";
import setContent from "../../utils/setContent";
import svg from "../../resourses/svg/sprites.svg";
import { useDispatch } from "react-redux";
import { useHttp } from "hooks/http.hook";
import { setWords } from "store/slices/wordsSlice";
import Popup from "reactjs-popup";
import AddMyWordsForm from "components/addMyWordsForm/addMyWordsForm";
import { useAlert } from "react-alert";

const CommonWords = () => {
   const alert = useAlert();
   const dispatch = useDispatch();
   const { isAdmin } = useAuth();
   const [wordsList, setWordsList] = useState([]);
   const [isDelete, setIsDelete] = useState(false);
   const usersWordsCollectionRef = collection(db, "commonWords");

   const { request, process, setProcess } = useHttp();

   useEffect(() => {
      onRequest();
      // eslint-disable-next-line
   }, [isDelete]);

   const onRequest = () => {
      request(usersWordsCollectionRef)
         .then(onWordsListLoaded)
         .then(() => setProcess("confirmed"));
   };

   const onWordsListLoaded = (data) => {
      setWordsList((wordsList) =>
         data.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
      );
   };

   const addNewDoc = async (title) => {
      await addDoc(collection(db, "commonWords"), {
         title,
         wordsArray: [],
      });
      onRequest();
      alert.success("Item added!");
   };

   const deleteItem = async (id) => {
      try {
         const itemDoc = doc(db, "commonWords", id);
         await deleteDoc(itemDoc);
         onRequest();
      } catch (error) {
         console.error(error.message);
      }
   };

   const onRemove = (itemID) => {
      if (window.confirm("Are you sure you want to delete this item?")) {
         deleteItem(itemID);
         alert.success("Item deleted!");
      }
   };

   function renderItems(arr) {
      if (arr.length === 0) {
         return (
            <div className="common-words__empy">There is nothing here yet.</div>
         );
      }

      const items = arr.map((item, i) => {
         return !isDelete ? (
            <Link
               to="/common-words"
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
                     {item.title.length > 28
                        ? item.title.substring(0, 28) + "..."
                        : item.title}
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
                     {item.title.length > 28
                        ? item.title.substring(0, 28) + "..."
                        : item.title}
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
            {items}
            {isAdmin ? (
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
            ) : null}
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

   return (
      <div className="common-words">
         <div className="common-words__container _container">
            <div className="common-words__body">
               <div className="profile-page__row">
                  <div className="profile-page__title">Common words</div>
                  {isAdmin ? (
                     !isDelete ? (
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
                     )
                  ) : null}
               </div>
               {elements}
            </div>
         </div>
      </div>
   );
};

export default CommonWords;
