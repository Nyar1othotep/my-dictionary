import { useHttp } from "../hooks/http.hook";

const useMyDictionarylService = () => {
   const { request, clearError, process, setProcess } = useHttp();

   const _apiKey = "...";

   const getAllWords = async () => {
      const res = await request(_apiKey);
      return res.data.results.map(_transfromWords);
   };

   const _transfromWords = (words) => {
      return {
         id: words.id,
         en: words.en,
         ru: words.ru,
      };
   };

   return {
      getAllWords,
      process,
      setProcess,
      clearError,
   };
};

export default useMyDictionarylService;
