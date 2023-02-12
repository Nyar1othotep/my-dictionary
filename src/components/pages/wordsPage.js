import { useAuth } from "hooks/useAuth.hook";
import Words from "components/words/words";

const WordsPage = () => {
   const { isAdmin } = useAuth();

   return <Words isAdmin={isAdmin} wordsFrom="private" />;
};

export default WordsPage;
