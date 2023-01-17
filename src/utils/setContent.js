// import ErrorMessage from "../components/errorMessage/ErrorMessage";
// import Spinner from "../components/spinner/Spinner";
// import Skeleton from "../components/skeleton/Skeleton";

const setContent = (process, Component, data) => {
   switch (process) {
      case "waiting":
         return "Nothing";
      // return <Skeleton />;
      case "loading":
         return "Now loading...";
      // return <Spinner />;
      case "confirmed":
         return <Component data={data} />;
      case "error":
         return "Omg... Wow! Something went wrong))";
      // return <ErrorMessage />;
      default:
         throw new Error("Unexpected process state");
   }
};

export default setContent;
