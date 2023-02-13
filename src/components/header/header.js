import Toggle from "../toggle/toggle";
import { ThemeContext, themes } from "../../contexts/themeContext";
import { Link, NavLink } from "react-router-dom";
import svg from "../../resourses/svg/sprites.svg";
import { useAuth } from "hooks/useAuth.hook";

const Header = () => {
   const { isAuth } = useAuth();

   return (
      <header className="header">
         <div className="header__container _container">
            <div className="header__body">
               <div className="header__theme">
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
               <Link className="header__logo" to="/">
                  <svg>
                     <use href={`${svg}#logo`}></use>
                  </svg>
               </Link>
               <NavLink
                  className="header__account"
                  to={isAuth ? "/user/profile" : "/user/login"}
               >
                  <svg>
                     <use href={`${svg}#account`}></use>
                  </svg>
               </NavLink>
            </div>
         </div>
      </header>
   );
};

export default Header;
