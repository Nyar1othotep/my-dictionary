import Header from "components/header/header";
import MyWords from "components/myWords/myWords";
import CommonWords from "components/commonWords/commonWords";
import { useAuth } from "hooks/useAuth.hook";
import { Navigate } from "react-router-dom";
import ErrorBoundary from "../errorBoundary/ErrorBoundary";
import Helmet from "react-helmet";

const MainPage = () => {
   const { isAuth } = useAuth();

   return isAuth ? (
      <div className="main-page">
			<Helmet>
            <meta name="description" content={`My dictionary main page`} />
            <title>My dictionary</title>
         </Helmet>
         <Header />
         <ErrorBoundary>
            <MyWords />
         </ErrorBoundary>
         <ErrorBoundary>
            <CommonWords />
         </ErrorBoundary>
         <div className="words__footer">
            Created by{" "}
            <a href="https://github.com/Nyar1othotep">Nyar1othotep</a> © 2023
         </div>
      </div>
   ) : (
      <Navigate to="/user/login" />
   );
};

export default MainPage;
