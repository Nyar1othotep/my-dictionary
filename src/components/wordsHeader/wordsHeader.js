import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import Toggle from "../toggle/toggle";
import { ThemeContext, themes } from "../../contexts/themeContext";
import svg from "../../resourses/svg/sprites.svg";
import { useEffect, useRef } from "react";
import AnchorLink from "react-anchor-link-smooth-scroll";
import { useNavigate } from "react-router-dom";

const WordsHeader = ({
   title,
   words,
   onEnHideFunc,
   onHideEn,
   onHideRu,
   onRuHideFunc,
   setShuffle,
   shuffle,
   wordsFrom,
}) => {
   let navigate = useNavigate();
   const settings = useRef();
   const wordsBody = useRef();

   useEffect(() => {
      gsap.registerPlugin(ScrollTrigger);
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
            self.direction === -1
               ? showBtnsUpDown.play()
               : showBtnsUpDown.reverse();
         },
      });
      // eslint-disable-next-line
   }, []);

   const toggleSettings = () => {
      settings.current.classList.toggle("active");
      wordsBody.current.classList.toggle("active");
   };

   return (
      <>
         <div className="words__header">
            <div className="words__container _container">
               <div className="words__body" ref={wordsBody}>
                  <div className="words__row">
                     <div
                        className="words__return"
                        onClick={() => {
                           wordsFrom === "common"
                              ? navigate("/")
                              : navigate("/user/profile");
                        }}
                     >
                        <svg>
                           <use href={`${svg}#return`}></use>
                        </svg>
                     </div>
                     <div className="words__info">
                        <div className="words__title">
                           {title.substring(0, 15) + ""}
                        </div>
                        <div className="words__total">
                           Total words: {words.length}
                        </div>
                     </div>
                     <div
                        className="words__settigns"
                        ref={settings}
                        onClick={toggleSettings}
                     >
                        <svg>
                           <use href={`${svg}#settings`}></use>
                        </svg>
                     </div>
                  </div>
                  <div className="words__controll">
                     <button
                        className="words__en-ru-btn words__btn btn"
                        onClick={() => onEnHideFunc()}
                     >
                        {!onHideEn ? "En-ru" : "Show words"}
                     </button>
                     <button
                        className="words__ru-en-btn words__btn btn"
                        onClick={() => onRuHideFunc(".ru")}
                     >
                        {!onHideRu ? "Ru-en" : "Show words"}
                     </button>
                     <button
                        className="words__shuffle-btn words__btn btn"
                        onClick={() => setShuffle((shuffle) => !shuffle)}
                     >
                        {!shuffle ? "Shuffle" : "In order"}
                     </button>
                     <div className="words__theme">
                        <ThemeContext.Consumer>
                           {({ theme, setTheme }) => (
                              <Toggle
                                 onChange={() => {
                                    if (theme === themes.light)
                                       setTheme(themes.dark);
                                    if (theme === themes.dark)
                                       setTheme(themes.light);
                                 }}
                                 value={theme === themes.dark}
                              />
                           )}
                        </ThemeContext.Consumer>
                     </div>
                  </div>
               </div>
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
      </>
   );
};

export default WordsHeader;
