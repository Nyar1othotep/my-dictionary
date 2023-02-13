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
import { useAlert } from "react-alert";
import Helmet from "react-helmet";
import { useSpeechSynthesis } from "hooks/useSpeechSynthesis";

const Words = ({ isAdmin, wordsFrom }) => {
   const alert = useAlert();
   const [words, setWords] = useState([]);
   const [title, setTitle] = useState("");
   const [wordsID, setWordsID] = useState(null);
   const [shuffle, setShuffle] = useState(false);
   const [onHideEn, setOnHideEn] = useState(false);
   const [onHideRu, setOnHideRu] = useState(false);
   const [onShowDelete, setOnShowDelete] = useState(false);
   const [onShowFavorite, setOnShowFavorite] = useState(false);
   const [onAscending, setOnAscending] = useState(true);
   const [voices, speak] = useSpeechSynthesis();
   const [currentVoice, setCurrentVoice] = useState();

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

   useEffect(() => {
      if (!currentVoice) {
         setCurrentVoice(voices.filter((v) => v.default)[0] || voices[0]);
      }
      // eslint-disable-next-line
   }, [voices]);

   const handleVoiceChange = (e) => {
      setCurrentVoice(voices.filter((v) => v.name === e.target.value)[0]);
   };

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

   const reverseArray = (array) => {
      return array.reverse();
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

   const onHideFavoriteFunc = () => {
      setOnShowFavorite((onShowFavorite) => !onShowFavorite);
   };

   const onAscendingFunc = () => {
      setOnAscending((onAscending) => !onAscending);
   };

   const showItem = (event) => {
      event.target.classList.remove("hidden");
   };

   const speechSynthesis = (value) => {
      speak(value, currentVoice);
   };

   const addWord = (en, ru) => {
      setWords((words) => [
         ...words,
         {
            id: words.length + 1,
            en,
            ru,
            favorite: false,
         },
      ]);
      alert.success("Word added!");
   };

   const deleteWord = (id) => {
      setWords((words) => words.filter((item) => item.id !== id));
      alert.success("Word deleted!");
   };

   const addToFavorite = (id) => {
      setWords((words) =>
         words.map((item) => {
            if (item.id === id) {
               return { ...item, favorite: true };
            }
            return item;
         })
      );
      alert.success("Word added to favorite!");
   };

   const removeFromFavorite = (id) => {
      setWords((words) =>
         words.map((item) => {
            if (item.id === id) {
               return { ...item, favorite: false };
            }
            return item;
         })
      );
      alert.success("Word removed from favorite!");
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
      const newArr =
         method === "shuffle"
            ? shuffleArray([...arr])
            : method === "reverse"
            ? reverseArray([...arr])
            : arr;

      const itemsFavorite = newArr.map((item, i) => {
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
            <>
               {item.favorite ? (
                  <LazyLoad
                     offset={100}
                     className="words__item favorite"
                     key={item.id}
                  >
                     <div
                        className={
                           !onShowDelete
                              ? "words__remove"
                              : "words__remove active"
                        }
                        onClick={() => {
                           if (
                              window.confirm(
                                 "Are you sure you want to delete this word?"
                              )
                           ) {
                              deleteWord(item.id);
                           }
                        }}
                     >
                        <svg>
                           <use href={`${svg}#remove`}></use>
                        </svg>
                     </div>
                     {wordsFrom === "private" ? (
                        <div
                           className={
                              !onShowFavorite
                                 ? "words__favorite added"
                                 : "words__favorite"
                           }
                           onClick={() => {
                              if (
                                 window.confirm(
                                    "Are you sure you want to remove this word from favorite?"
                                 )
                              ) {
                                 removeFromFavorite(item.id);
                              }
                           }}
                        >
                           <svg>
                              <use href={`${svg}#favorite-fill`}></use>
                           </svg>
                        </div>
                     ) : null}
                     <div className="words__number">{i + 1})</div>
                     <span
                        className={!onHideEn ? "en" : "hidden en"}
                        onClick={showItem}
                     >
                        {item.en}
                        <div
                           className="tts"
                           onClick={() => speechSynthesis(item.en)}
                        >
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
               ) : null}
            </>
         );
      });

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
            <>
               {!item.favorite ? (
                  <LazyLoad offset={100} className="words__item" key={item.id}>
                     <div
                        className={
                           !onShowDelete
                              ? "words__remove"
                              : "words__remove active"
                        }
                        onClick={() => {
                           if (
                              window.confirm(
                                 "Are you sure you want to delete this word?"
                              )
                           ) {
                              deleteWord(item.id);
                           }
                        }}
                     >
                        <svg>
                           <use href={`${svg}#remove`}></use>
                        </svg>
                     </div>
                     {wordsFrom === "private" ? (
                        <div
                           className={
                              !onShowFavorite
                                 ? "words__favorite active"
                                 : "words__favorite"
                           }
                           onClick={() => {
                              if (
                                 window.confirm(
                                    "Are you sure you want to add this word to favorite?"
                                 )
                              ) {
                                 addToFavorite(item.id);
                              }
                           }}
                        >
                           <svg>
                              <use href={`${svg}#favorite-border`}></use>
                           </svg>
                        </div>
                     ) : null}
                     <div className="words__number">{i + 1})</div>
                     <span
                        className={!onHideEn ? "en" : "hidden en"}
                        onClick={showItem}
                     >
                        {item.en}
                        <div
                           className="tts"
                           onClick={() => speechSynthesis(item.en)}
                        >
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
               ) : null}
            </>
         );
      });
      return (
         <>
            <ul className="words__lists">
               {wordsFrom === "private" ? (
                  <div>
                     <div className="words__list-title">Favorite</div>
                     <div className="words__favorite-list words__list">
                        {itemsFavorite}
                     </div>
                  </div>
               ) : null}
               <div>
                  <div className="words__list-title">Words</div>
                  <div className="words__list">{items}</div>
               </div>
            </ul>
         </>
      );
   }

   return store.getState().words.wordsID !== null ? (
      <>
         <Helmet>
            <meta
               name="description"
               content={`${title}. My dictionary - words page`}
            />
            <title>{title}</title>
         </Helmet>
         <WordsHeader
            title={title}
            words={words}
            onEnHideFunc={onEnHideFunc}
            onHideEn={onHideEn}
            onHideRu={onHideRu}
            onRuHideFunc={onRuHideFunc}
            setShuffle={setShuffle}
            shuffle={shuffle}
            wordsFrom={wordsFrom}
            currentVoice={currentVoice}
            handleVoiceChange={handleVoiceChange}
            voices={voices}
         />
         <main>
            <div className="words-page">
               <div className="words words__container _container">
                  <div className="up hidden" id="up"></div>

                  {wordsFrom === "private" ? (
                     <WordsControl
                        AddWordsForm={AddWordsForm}
                        addWord={addWord}
                        onShowDeleteFunc={onShowDeleteFunc}
                        onShowDelete={onShowDelete}
                        onAscendingFunc={onAscendingFunc}
                        onAscending={onAscending}
                        onlyFilter={false}
                        onShowFavorite={onShowFavorite}
                        onHideFavoriteFunc={onHideFavoriteFunc}
                     />
                  ) : wordsFrom === "common" && isAdmin ? (
                     <WordsControl
                        AddWordsForm={AddWordsForm}
                        addWord={addWord}
                        onShowDeleteFunc={onShowDeleteFunc}
                        onShowDelete={onShowDelete}
                        onAscendingFunc={onAscendingFunc}
                        onAscending={onAscending}
                        onlyFilter={false}
                        onShowFavorite={onShowFavorite}
                        onHideFavoriteFunc={onHideFavoriteFunc}
                     />
                  ) : wordsFrom === "common" && !isAdmin ? (
                     <WordsControl
                        AddWordsForm={AddWordsForm}
                        addWord={addWord}
                        onShowDeleteFunc={onShowDeleteFunc}
                        onShowDelete={onShowDelete}
                        onAscendingFunc={onAscendingFunc}
                        onAscending={onAscending}
                        onlyFilter={true}
                        onShowFavorite={onShowFavorite}
                        onHideFavoriteFunc={onHideFavoriteFunc}
                     />
                  ) : null}

                  {words.length === 0 ? (
                     <div className="words__empy">
                        There is nothing here yet.
                     </div>
                  ) : null}

                  {words.length === 0 ? (
                     <Spinner />
                  ) : shuffle ? (
                     renderItems(words, "shuffle")
                  ) : !onAscending ? (
                     renderItems(words, "reverse")
                  ) : (
                     renderItems(words, "defualt")
                  )}
                  <div className="down hidden" id="down"></div>
               </div>
            </div>
         </main>
      </>
   ) : (
      <Navigate to="/user/login" />
   );
};

const WordsControl = ({
   AddWordsForm,
   addWord,
   onShowDeleteFunc,
   onShowDelete,
   onAscendingFunc,
   onAscending,
   onlyFilter,
   onShowFavorite,
   onHideFavoriteFunc,
}) => {
   return (
      <>
         {!onlyFilter ? (
            <div className="words__add">
               <span className="words__add-title">Add word</span>
               <AddWordsForm handleClick={addWord} />
            </div>
         ) : null}
         <div className="words__delete-filter">
            {!onlyFilter ? (
               <>
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
                  <div
                     className="words__favorite-show"
                     onClick={onHideFavoriteFunc}
                  >
                     {!onShowFavorite ? (
                        <svg>
                           <use href={`${svg}#hide`}></use>
                        </svg>
                     ) : (
                        <svg>
                           <use href={`${svg}#favorite-fill`}></use>
                        </svg>
                     )}
                     {!onShowFavorite ? "Hide favorite" : "Show favorite"}
                  </div>
               </>
            ) : null}
            <div onClick={onAscendingFunc}>
               <svg>
                  <use href={`${svg}#filter`}></use>
               </svg>
               {onAscending ? "Ascending" : "Descending"}
               {onAscending ? (
                  <svg>
                     <use href={`${svg}#arrow-down`}></use>
                  </svg>
               ) : (
                  <svg style={{ transform: "rotate(180deg)" }}>
                     <use href={`${svg}#arrow-down`}></use>
                  </svg>
               )}
            </div>
         </div>
      </>
   );
};

export default Words;
