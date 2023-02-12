import { useAuth } from "hooks/useAuth.hook";
import Words from "components/words/words";

const CommonWordsPage = () => {
   const { isAdmin } = useAuth();

   return <Words isAdmin={isAdmin} wordsFrom="common" />;
};

export default CommonWordsPage;
