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
import { db } from "../../firebase";
import { collection, query, where, deleteDoc, doc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useHttp } from "hooks/http.hook";

const Logout = () => {
   const alert = useAlert();
   const dispatch = useDispatch();
   const { email, isAdmin, userUID } = useAuth();
   const [itemsID, setItemsID] = useState([]);
   const auth = getAuth();
   const { request } = useHttp();

   const usersWordsCollectionRef = collection(db, "usersWords");
   const q = query(usersWordsCollectionRef, where("UserUID", "==", userUID));

   useEffect(() => {
      onRequest();
      // eslint-disable-next-line
   }, []);

   const onRequest = () => {
      request(q).then(onItemsLoaded);
   };

   const onItemsLoaded = (data) => {
      const loadedData = data.docs.map((doc) => ({
         ...doc.data(),
         id: doc.id,
      }));
      setItemsID((items) => loadedData.map((item) => item.id));
   };

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

         deleteItems(itemsID);
         dispatch(removeUser());
         signOut(auth);
         alert.success("Account deleted!");
      } catch (error) {
         return null;
      }
   };

   const deleteItems = async (itemsID) => {
      const items = await itemsID;
      try {
         for (const itemID of items) {
            const itemDoc = doc(db, "usersWords", itemID);
            await deleteDoc(itemDoc);
         }
      } catch (error) {
         console.error(error.message);
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
