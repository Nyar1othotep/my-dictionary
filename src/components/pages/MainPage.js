import Header from "components/header/header";
import MyWords from "components/myWords/myWords";
import CommonWords from "components/commonWords/commonWords";
import { useAuth } from "hooks/useAuth.hook";
import { Navigate } from "react-router-dom";

const MainPage = () => {
   const { isAuth } = useAuth();

   return isAuth ? (
      <>
         <Header />
         <MyWords />
         <CommonWords />
      </>
   ) : (
      <Navigate to="/user/login" />
   );
};

export default MainPage;
