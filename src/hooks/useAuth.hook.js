import { useSelector } from "react-redux";

export function useAuth() {
   const { email, token, userUID } = useSelector((state) => state.user);

   return {
      isAdmin: email === "nyarlothotephoro@gmail.com" ? true : false,
      isAuth: !!email,
      email,
      token,
      userUID,
   };
}
