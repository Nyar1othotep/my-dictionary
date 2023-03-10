import { useHttp } from "../hooks/shttp.hook";

const useMyDictionarylService = () => {
   const { request, clearError, process, setProcess } = useHttp();

   const _apiKey =
      "https://gist.githubusercontent.com/Nyar1othotep/b990d08471011a5e447ea8b75a74c449/raw/79a8c01b0fa1fea2650360e3dd45d18d8c6900c5/my-dictionary.json";

   const getAllWords = async () => {
      const res = await request(_apiKey);
      return res.map(_transfromWords);
   };

   const _transfromWords = (words) => {
      return {
         id: words.id,
         en: words.en,
         ru: words.ru
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
