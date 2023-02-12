import { useAuth } from "hooks/useAuth.hook";
import Words from "components/words/words";
import ErrorBoundary from "../errorBoundary/ErrorBoundary";

const CommonWordsPage = () => {
   const { isAdmin } = useAuth();

   return (
      <ErrorBoundary>
         <Words isAdmin={isAdmin} wordsFrom="common" />
      </ErrorBoundary>
   );
};

export default CommonWordsPage;
