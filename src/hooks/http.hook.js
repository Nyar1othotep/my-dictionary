import { useState, useCallback } from "react";
import axios from "axios";

export const useHttp = () => {
   const [process, setProcess] = useState("waiting");

   const request = useCallback(async (url) => {
      setProcess("loading");

      try {
         const response = await axios.get(url);

         if (!response.status === 200)
            throw new Error(
               `Could not fetch ${url}, status: ${response.status}`
            );

         const data = await response.data;

         return data;
      } catch (error) {
         setProcess("error");
         throw error;
      }
   }, []);

   const clearError = useCallback(() => {
      setProcess("loading");
   }, []);

   return { request, clearError, process, setProcess };
};
