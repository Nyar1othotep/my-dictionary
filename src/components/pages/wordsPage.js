import { useAuth } from "hooks/useAuth.hook";
import Words from "components/words/words";
import ErrorBoundary from "../errorBoundary/ErrorBoundary";

const WordsPage = () => {
   const { isAdmin } = useAuth();

   return (
      <ErrorBoundary
         styles={{
            width: "100%",
            height: "100vh",
         }}
      >
         <Words isAdmin={isAdmin} wordsFrom="private" />
      </ErrorBoundary>
   );
};

export default WordsPage;
