import ErrorMessage from "../errorMessage/ErrorMessage";

const Page404 = () => {
   return (
      <ErrorMessage
         styles={{
            width: "100%",
            height: "100vh",
         }}
         page404Text="Error 404 - This page does not exist."
      />
   );
};

export default Page404;
