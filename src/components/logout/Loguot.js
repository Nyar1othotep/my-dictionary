import { useDispatch } from "react-redux";
import { useAuth } from "hooks/useAuth.hook";
import { removeUser } from "store/slices/userSlice";
import { signOut, getAuth } from "firebase/auth";

const Logout = () => {
   const dispatch = useDispatch();
   const { email, isAdmin } = useAuth();
   const auth = getAuth();

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
