import { useHttp } from "../hooks/http.hook";

const useMyDictionarylService = () => {
   const { request, clearError, process, setProcess } = useHttp();

   const _apiKey =
      "https://gist.githubusercontent.com/Nyar1othotep/b990d08471011a5e447ea8b75a74c449/raw/ab55540b7ebc8036143d7f0d32483a88e1586184/my-dictionary.json";

   const getAllWords = async () => {
      const res = await request(_apiKey);
      return res.map(_transfromWords);
   };

   const _transfromWords = (words) => {
      return {
         id: words.id,
         en: words.en,
         ru: (function () {
            let index = words.ru.indexOf("(");
            return index > -1 ? (
               <>
                  <div className="words__text">{words.ru.slice(0, index)}</div>
                  <div className="words__descr">
                     {words.ru.slice(index - 1 + 1)}
                  </div>
               </>
            ) : (
               // <>
               //    <div className="words__text">{words.ru.slice(0, index)}</div>
               //    <div className="words__descr">
               //       {words.ru.slice(index - 1 + 1)}
               //    </div>
               // </>
               words.ru
            );
         })(),
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
