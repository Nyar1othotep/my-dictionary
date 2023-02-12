import LoginForm from "../loginForm/LoginForm";
import { useDispatch } from "react-redux";
import { setUser } from "store/slices/userSlice";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate, Navigate } from "react-router-dom";
import { useAuth } from "hooks/useAuth.hook";
import { useAlert } from "react-alert";
import Helmet from "react-helmet";

const LoginPage = () => {
   const alert = useAlert();
   const dispatch = useDispatch();
   let navigate = useNavigate();
   const { isAuth } = useAuth();

   const handleLogin = (email, password) => {
      const auth = getAuth();
      signInWithEmailAndPassword(auth, email, password)
         .then(({ user }) => {
            dispatch(
               setUser({
                  email: user.email,
                  userUID: user.uid,
                  token: user.accessToken,
               })
            );
            navigate("/");
         })
         .catch((error) => {
            let errors = (function () {
               let index = error.message.indexOf("(");
               return index > -1
                  ? error.message.slice(index)
                  : error.message;
            })();
            alert.error(errors);
         });
   };

   return !isAuth ? (
      <div className="login-page">
			<Helmet>
            <meta name="description" content={`My dictionary - login page`} />
            <title>My dictionary - login</title>
         </Helmet>
         <div className="login-page__container _container">
            <div className="login-page__body">
               <LoginForm handleClick={handleLogin} />
            </div>
         </div>
      </div>
   ) : (
      <Navigate to="/" />
   );
};

export default LoginPage;
