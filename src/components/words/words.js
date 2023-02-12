import svg from "../../resourses/svg/sprites.svg";
import { useState, useEffect } from "react";
import { store } from "store";
import { Navigate } from "react-router-dom";
import AddWordsForm from "components/addWordsForm/addWordsForm";
import { db } from "../../firebase";
import { updateDoc, doc } from "firebase/firestore";
import WordsHeader from "components/wordsHeader/wordsHeader";
import Spinner from "components/spinner/spinner";
import LazyLoad from "react-lazyload";

const Words = ({ isAdmin, wordsFrom }) => {
   const [words, setWords] = useState([]);
   const [title, setTitle] = useState("");
   const [wordsID, setWordsID] = useState(null);
   const [shuffle, setShuffle] = useState(false);
   const [onHideEn, setOnHideEn] = useState(false);
   const [onHideRu, setOnHideRu] = useState(false);
   const [onShowDelete, setOnShowDelete] = useState(false);

   useEffect(() => {
      setWords((words) => store.getState().words.wordsArray);
      setTitle((title) => store.getState().words.title);
      setWordsID((wordsID) => store.getState().words.wordsID);
      // eslint-disable-next-line
   }, []);

   useEffect(() => {
      updateWords(words);
      // eslint-disable-next-line
   }, [words]);

   const shuffleArray = (array) => {
      let m = array.length,
         t,
         i;
      while (m) {
         i = Math.floor(Math.random() * m--);
         t = array[m];
         array[m] = array[i];
         array[i] = t;
      }

      return array;
   };

   const onEnHideFunc = () => {
      setOnHideEn((onHideEn) => !onHideEn);
   };

   const onRuHideFunc = () => {
      setOnHideRu((onHideRu) => !onHideRu);
   };

   const onShowDeleteFunc = () => {
      setOnShowDelete((onShowDelete) => !onShowDelete);
   };

   const showItem = (event) => {
      event.target.classList.remove("hidden");
   };

   const speechSynthesis = (value) => {
      const utterance = new SpeechSynthesisUtterance(value);
      utterance.rate = 0.8;
      window.speechSynthesis.speak(utterance);
   };

   const addWord = (en, ru) => {
      setWords((words) => [
         ...words,
         {
            id: words.length + 1,
            en,
            ru,
         },
      ]);
   };

   const deleteWord = (id) => {
      setWords((words) => words.filter((item) => item.id !== id));
   };

   const updateWords = async (words) => {
      try {
         const wordsDoc = doc(
            db,
            `${wordsFrom === "private" ? "usersWords" : "commonWords"}`,
            wordsID
         );
         const updateFields = {
            wordsArray: words,
         };
         await updateDoc(wordsDoc, updateFields);
      } catch (error) {
         return false;
      }
   };

   function renderItems(arr, method) {
      const newArr = method === "shuffle" ? shuffleArray([...arr]) : arr;
      const items = newArr.map((item, i) => {
         let ru = (function () {
            let index = item.ru.indexOf("(");
            return index > -1 ? (
               <>
                  <div className="words__text">{item.ru.slice(0, index)}</div>
                  <div className="words__descr">
                     {item.ru.slice(index - 1 + 1)}
                  </div>
               </>
            ) : (
               item.ru
            );
         })();

         return (
            <LazyLoad offset={100} className="words__item" key={i}>
               <div
                  className={
                     !onShowDelete ? "words__remove" : "words__remove active"
                  }
                  onClick={() => deleteWord(item.id)}
               >
                  <svg>
                     <use href={`${svg}#remove`}></use>
                  </svg>
               </div>
               <div className="words__number">{i + 1})</div>
               <span
                  className={!onHideEn ? "en" : "hidden en"}
                  onClick={showItem}
               >
                  {item.en}
                  <div className="tts" onClick={() => speechSynthesis(item.en)}>
                     <svg>
                        <use href={`${svg}#play`}></use>
                     </svg>
                  </div>
               </span>
               <span>−</span>
               <span
                  className={!onHideRu ? "ru" : "hidden ru"}
                  onClick={showItem}
               >
                  {ru}
               </span>
            </LazyLoad>
         );
      });
      return <ul className="words__list">{items}</ul>;
   }

   return store.getState().words.wordsID !== null ? (
      <>
         <WordsHeader
            title={title}
            words={words}
            onEnHideFunc={onEnHideFunc}
            onHideEn={onHideEn}
            onHideRu={onHideRu}
            onRuHideFunc={onRuHideFunc}
            setShuffle={setShuffle}
            shuffle={shuffle}
         />
         <div className="words _container">
            <div className="up hidden" id="up"></div>

            {wordsFrom === "private" ? (
               <>
                  <div className="words__add">
                     <span className="words__add-title">Add word</span>
                     <AddWordsForm handleClick={addWord} />
                  </div>
                  <div className="words__delete">
                     <div
                        className="words__delete-show"
                        onClick={onShowDeleteFunc}
                     >
                        {!onShowDelete ? (
                           <svg>
                              <use href={`${svg}#trashbin`}></use>
                           </svg>
                        ) : (
                           <svg>
                              <use href={`${svg}#hide`}></use>
                           </svg>
                        )}

                        {!onShowDelete ? "Show delete" : "Hide delete"}
                     </div>
                  </div>
               </>
            ) : wordsFrom === "common" && isAdmin ? (
               <>
                  <div className="words__add">
                     <span className="words__add-title">Add word</span>
                     <AddWordsForm handleClick={addWord} />
                  </div>
                  <div className="words__delete">
                     <div
                        className="words__delete-show"
                        onClick={onShowDeleteFunc}
                     >
                        {!onShowDelete ? (
                           <svg>
                              <use href={`${svg}#trashbin`}></use>
                           </svg>
                        ) : (
                           <svg>
                              <use href={`${svg}#hide`}></use>
                           </svg>
                        )}
                        {!onShowDelete ? "Show delete" : "Hide delete"}
                     </div>
                  </div>
               </>
            ) : null}

            {words.length === 0 ? (
               <div className="words__empy">There is nothing here yet.</div>
            ) : null}

            {words.length === 0 ? (
               <Spinner />
            ) : !shuffle ? (
               renderItems(words, "defualt")
            ) : (
               renderItems(words, "shuffle")
            )}
            <div className="words__footer">
               Created by{" "}
               <a href="https://github.com/Nyar1othotep">Nyar1othotep</a> © 2023
            </div>
            <div className="down hidden" id="down"></div>
         </div>
      </>
   ) : (
      <Navigate to="/user/login" />
   );
};

export default Words;
