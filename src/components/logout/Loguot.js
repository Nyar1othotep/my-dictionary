import { useDispatch } from "react-redux";
import { useAuth } from "hooks/useAuth.hook";
import { removeUser } from "store/slices/userSlice";
import {
   signOut,
   getAuth,
   deleteUser,
   reauthenticateWithCredential,
   EmailAuthProvider,
} from "firebase/auth";
import { useAlert } from "react-alert";
import Popup from "reactjs-popup";
import PasswordConfirmation from "components/passwordConfirmation/passwordConfirmation";

const Logout = () => {
   const alert = useAlert();
   const dispatch = useDispatch();
   const { email, isAdmin } = useAuth();
   const auth = getAuth();

   const deleteSignedUser = async (password) => {
      const credential = EmailAuthProvider.credential(
         auth.currentUser.email,
         password
      );

      try {
         const result = await reauthenticateWithCredential(
            auth.currentUser,
            credential
         ).catch((error) => {
            let errors = (function () {
               let index = error.message.indexOf("(");
               return index > -1 ? error.message.slice(index) : error.message;
            })();
            alert.error(errors);
         });

         await deleteUser(result.user);

         dispatch(removeUser());
         signOut(auth);
         alert.success("Account deleted!");
      } catch (error) {
         return null;
      }
   };

   return (
      <div className="logout">
         <div className="logout__user logout__user-email">
            <div>Email:</div>
            <span>{email}</span>
         </div>
         <div className="logout__user logout__user-role">
            <div>Role:</div>
            <span>{isAdmin ? "admin" : "user"}</span>
         </div>
         <Popup
            trigger={
               <button className="logout__btn form-btn btn btn--black">
                  Delete account
               </button>
            }
            position="top left"
            lockScroll
            closeOnEscape
            modal
         >
            {(close) => (
               <PasswordConfirmation
                  handleClick={deleteSignedUser}
                  onClose={close}
               />
            )}
         </Popup>
         <button
            className="logout__btn form-btn btn btn--black"
            onClick={() => {
               dispatch(removeUser());
               signOut(auth);
            }}
         >
            Log out
         </button>
      </div>
   );
};

export default Logout;
