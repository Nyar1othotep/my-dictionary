import { useAuth } from "hooks/useAuth.hook";
import Words from "components/words/words";
import ErrorBoundary from "../errorBoundary/ErrorBoundary";

const CommonWordsPage = () => {
   const { isAdmin } = useAuth();

   return (
      <>
         <ErrorBoundary
            styles={{
               width: "100%",
               height: "100vh",
            }}
         >
            <Words isAdmin={isAdmin} wordsFrom="common" />
         </ErrorBoundary>
         <footer className="words__footer">
            Created by{" "}
            <a href="https://github.com/Nyar1othotep">Nyar1othotep</a> © 2023
         </footer>
      </>
   );
};

export default CommonWordsPage;
