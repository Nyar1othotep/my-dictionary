import ErrorMessage from "../components/errorMessage/ErrorMessage";
import Spinner from "../components/spinner/spinner";

const setContent = (process, Component, data) => {
   switch (process) {
      case "waiting":
         return "Nothing";
      case "loading":
      return <Spinner />;
      case "confirmed":
         return <Component data={data} />;
      case "error":
      return <ErrorMessage />;
      default:
         throw new Error("Unexpected process state");
   }
};

export default setContent;
