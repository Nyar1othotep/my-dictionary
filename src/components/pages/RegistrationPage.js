import RegistrationForm from "../registrationForm/RegistrationForm";
import { useDispatch } from "react-redux";
import { setUser } from "store/slices/userSlice";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { useNavigate, Navigate } from "react-router-dom";
import { useAuth } from "hooks/useAuth.hook";
import { useAlert } from "react-alert";
import Helmet from "react-helmet";

const RegistrationPage = () => {
   const alert = useAlert();
   const dispatch = useDispatch();
   let navigate = useNavigate();
   const { isAuth } = useAuth();

   const handleRegister = (email, password) => {
      const auth = getAuth();
      createUserWithEmailAndPassword(auth, email, password)
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
               return index > -1 ? error.message.slice(index) : error.message;
            })();
            alert.error(errors);
         });
   };

   return !isAuth ? (
      <div className="registration-page">
         <Helmet>
            <meta
               name="description"
               content={`My dictionary - register page`}
            />
            <title>My dictionary - register</title>
         </Helmet>
         <div className="registration-page__container _container">
            <div className="registration-page__body">
               <RegistrationForm handleClick={handleRegister} />
            </div>
         </div>
      </div>
   ) : (
      <Navigate to="/" />
   );
};

export default RegistrationPage;
