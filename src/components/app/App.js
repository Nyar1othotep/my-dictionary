import useMyDictionarylService from "../../services/MyDictionaryService";
import { useState, useEffect, useRef, useMemo } from "react";
import setContent from "../../utils/setContent";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import Toggle from "../toggle/toggle";
import { ThemeContext, themes } from "../../contexts/themeContext";
import svg from "../../resourses/svg/sprites.svg";

const App = () => {
   const [wordsList, setWordsList] = useState([]);
   // const [visibleWords, setVisibleWords] = useState();
   const [shuffle, setShuffle] = useState(false);
   const shouldLog = useRef(true);

   const { getAllWords, process, setProcess } = useMyDictionarylService();

   useEffect(() => {
      if (shouldLog.current) {
         shouldLog.current = false;
         onRequest();
      }
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

   const onRequest = () => {
      getAllWords()
         .then(onWordsListLoaded)
         .then(() => setProcess("confirmed"));
   };

   const onWordsListLoaded = (words) => {
      setWordsList((wordsList) => words);
   };

   const onHide = (value) => {
      document.querySelectorAll(".words__item").forEach((item) => {
         item.querySelector(value).classList.add("hidden");
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

   function renderItems(arr, method) {
      const newArr = method === "shuffle" ? shuffleArray(arr) : arr;
      const items = newArr.map((item, i) => {
         return (
            <li className="words__item" key={item.id}>
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
                  {item.ru}
               </span>
            </li>
         );
      });
      return <ul className="words__list">{items}</ul>;
   }

   const elements = useMemo(
      (method = "defualt") => {
         return setContent(process, () => renderItems(wordsList, method));
      },
      // eslint-disable-next-line
      [process]
   );

   const shuffleElements = useMemo(() => {
      return setContent(process, () => renderItems(wordsList, "shuffle"));
      // eslint-disable-next-line
   }, [process]);
	
   return (
      <div className="words _container">
         <div className="up hidden" id="up"></div>
         <div className="words__header main-tool-bar">
            <div className="words__total">Total words: {wordsList.length}</div>
            <div className="words__controll">
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
            <a className="words__btn-up words__btn btn" href="#up">
               <p>❯</p>
            </a>
            <a className="words__btn-down words__btn btn" href="#down">
               <p>❯</p>
            </a>
         </div>
         {!shuffle ? elements : shuffleElements}
         <div className="words__footer">
            Created by{" "}
            <a href="https://github.com/Nyar1othotep">Nyar1othotep</a> © 2023
         </div>
         <div className="down hidden" id="down"></div>
      </div>
   );
};
export default App;
