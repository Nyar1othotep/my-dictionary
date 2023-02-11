import RegistrationForm from "../registrationForm/RegistrationForm";
import { useDispatch } from "react-redux";
import { setUser } from "store/slices/userSlice";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { useNavigate, Navigate } from "react-router-dom";
import { useAuth } from "hooks/useAuth.hook";

const RegistrationPage = () => {
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
         .catch(console.error);
   };

   return !isAuth ? (
      <div className="registration-page">
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
