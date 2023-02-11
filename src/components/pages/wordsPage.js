import svg from "../../resourses/svg/sprites.svg";
import { useState, useEffect } from "react";
import { store } from "store";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import Toggle from "../toggle/toggle";
import { ThemeContext, themes } from "../../contexts/themeContext";
import { Navigate, useNavigate } from "react-router-dom";
import AddWordsForm from "components/addWordsForm/addWordsForm";
import { db } from "../../firebase";
import { updateDoc, doc } from "firebase/firestore";
import AnchorLink from "react-anchor-link-smooth-scroll";

const WordsPage = () => {
   const [words, setWords] = useState([]);
   const [title, setTitle] = useState("");
   const [wordsID, setWordsID] = useState(null);
   const [shuffle, setShuffle] = useState(false);
   let navigate = useNavigate();

   useEffect(() => {
      setWords((words) => store.getState().words.wordsArray);
      setTitle((title) => store.getState().words.title);
      setWordsID((wordsID) => store.getState().words.wordsID);

      gsap.registerPlugin(ScrollTrigger);

      const showAnim = gsap
         .from(".main-tool-bar", {
            yPercent: -100,
            paused: true,
            duration: 0.2,
         })
         .progress(1);

      const showBtnsUpDown = gsap
         .from(".words__btns-up-down", {
            xPercent: 200,
            paused: true,
            duration: 0.2,
         })
         .progress(1);

      ScrollTrigger.create({
         start: "top top",
         end: 99999,
         onUpdate: (self) => {
            self.direction === -1 ? showAnim.play() : showAnim.reverse();
         },
      });

      ScrollTrigger.create({
         start: "top top",
         end: 99999,
         onUpdate: (self) => {
            self.direction === -1
               ? showBtnsUpDown.play()
               : showBtnsUpDown.reverse();
         },
      });
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

   const onHide = (value) => {
      document.querySelectorAll(".words__item").forEach((item) => {
         item.querySelector(value).classList.add("hidden");
      });
   };

   const onShowRemove = () => {
      document.querySelectorAll(".words__item").forEach((item) => {
         item.querySelector(".words__remove").classList.add("active");
      });
   };

   const onHideAllRemove = () => {
      document.querySelectorAll(".words__item").forEach((item) => {
         item.querySelector(".words__remove").classList.remove("active");
      });
   };

   const showItem = (event) => {
      event.target.classList.remove("hidden");
   };

   const showAll = () => {
      document.querySelectorAll(".words__item").forEach((item) => {
         item.querySelector(".en").classList.remove("hidden");
         item.querySelector(".ru").classList.remove("hidden");
      });
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
         const wordsDoc = doc(db, "usersWords", wordsID);
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
            <li className="words__item" key={i}>
               <div
                  className="words__remove"
                  onClick={() => deleteWord(item.id)}
               >
                  <svg>
                     <use href={`${svg}#remove`}></use>
                  </svg>
               </div>
               <div className="words__number">{i + 1})</div>
               <span className="en" onClick={showItem}>
                  {item.en}
                  <div className="tts" onClick={() => speechSynthesis(item.en)}>
                     <svg>
                        <use href={`${svg}#play`}></use>
                     </svg>
                  </div>
               </span>
               <span>−</span>
               <span className="ru" onClick={showItem}>
                  {ru}
               </span>
            </li>
         );
      });
      return <ul className="words__list">{items}</ul>;
   }

   const elements = renderItems(words, "defualt");

   const shuffleElements = renderItems(words, "shuffle");

   return store.getState().words.wordsID !== null ? (
      <div className="words _container">
         <div className="up hidden" id="up"></div>
         <div className="words__header main-tool-bar">
            <div className="words__row">
               <div className="words__title">{title.substring(0, 15) + ""}</div>
               <div className="words__total">Total words: {words.length}</div>
            </div>
            <div className="words__controll">
               <button
                  className="words__return-btn words__btn btn"
                  onClick={() => navigate("/user/profile")}
               >
                  <svg>
                     <use href={`${svg}#return`}></use>
                  </svg>
                  Return
               </button>
               <button
                  className="words__en-ru-btn words__btn btn"
                  onClick={() => onHide(".en")}
               >
                  En-ru
               </button>
               <button
                  className="words__ru-en-btn words__btn btn"
                  onClick={() => onHide(".ru")}
               >
                  Ru-en
               </button>
               <button
                  className="words__shuffle-btn words__btn btn"
                  onClick={() => setShuffle(true)}
               >
                  Shuffle
               </button>
               <button
                  className="words__show-all-btn words__btn btn"
                  onClick={showAll}
               >
                  Show all
               </button>
               <ThemeContext.Consumer>
                  {({ theme, setTheme }) => (
                     <Toggle
                        onChange={() => {
                           if (theme === themes.light) setTheme(themes.dark);
                           if (theme === themes.dark) setTheme(themes.light);
                        }}
                        value={theme === themes.dark}
                     />
                  )}
               </ThemeContext.Consumer>
            </div>
         </div>
         <div className="words__btns-up-down">
            <AnchorLink className="words__btn-up words__btn btn" href="#up">
               <p>❯</p>
            </AnchorLink>
            <AnchorLink className="words__btn-down words__btn btn" href="#down">
               <p>❯</p>
            </AnchorLink>
         </div>
         <div className="words__add">
            <span className="words__add-title">Add word</span>
            <AddWordsForm handleClick={addWord} />
         </div>
         <div className="words__delete">
            <div className="words__delete-show" onClick={onShowRemove}>
               <svg>
                  <use href={`${svg}#trashbin`}></use>
               </svg>
               Show delete buttons
            </div>
            <div className="words__delete-show" onClick={onHideAllRemove}>
               <svg>
                  <use href={`${svg}#hide`}></use>
               </svg>
               Hide delete buttons
            </div>
         </div>
         {words.length === 0 ? (
            <div className="words__empy">There is nothing here yet.</div>
         ) : null}
         {!shuffle ? elements : shuffleElements}
         <div className="words__footer">
            Created by{" "}
            <a href="https://github.com/Nyar1othotep">Nyar1othotep</a> © 2023
         </div>
         <div className="down hidden" id="down"></div>
      </div>
   ) : (
      <Navigate to="/user/login" />
   );
};

export default WordsPage;
