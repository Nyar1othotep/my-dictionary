import { useAuth } from "hooks/useAuth.hook";
import { Link } from "react-router-dom";
import { useEffect, useState, useMemo } from "react";
import { db } from "../../firebase";
import { collection, query, where } from "firebase/firestore";
import setContent from "../../utils/setContent";
import svg from "../../resourses/svg/sprites.svg";
import { useDispatch } from "react-redux";
import { useHttp } from "hooks/http.hook";
import { setWords } from "store/slices/wordsSlice";

const MyWords = () => {
   const dispatch = useDispatch();
   const { userUID } = useAuth();
   const [wordsList, setWordsList] = useState([]);
   const usersWordsCollectionRef = collection(db, "usersWords");
   const q = query(usersWordsCollectionRef, where("UserUID", "==", userUID));

   const { request, process, setProcess } = useHttp();

   useEffect(() => {
      onRequest();
      // eslint-disable-next-line
   }, []);

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

   function renderItems(arr) {
      if (arr.length === 0) {
         return (
            <div className="my-words__empy">
               There is nothing here yet.{" "}
               <Link to="/user/profile">Go to profile.</Link>
            </div>
         );
      }

      const items = arr.map((item, i) => {
         return (
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
                     {item.title.length > 28
                        ? item.title.substring(0, 28) + "..."
                        : item.title}
                  </div>
                  <svg>
                     <use href={`${svg}#go`}></use>
                  </svg>
               </li>
            </Link>
         );
      });
      return <ul className="btn-words__list">{items}</ul>;
   }

   const elements = useMemo(
      () => {
         return setContent(process, () => renderItems(wordsList));
      },
      // eslint-disable-next-line
      [process]
   );

   return (
      <div className="my-words">
         <div className="my-words__container _container">
            <div className="my-words__body">
               <div className="my-words__title">My words</div>
               {elements}
            </div>
         </div>
      </div>
   );
};

export default MyWords;
