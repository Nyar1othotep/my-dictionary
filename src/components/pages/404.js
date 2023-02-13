import ErrorMessage from "../errorMessage/ErrorMessage";
import Helmet from "react-helmet";

const Page404 = () => {
   return (
      <>
         <Helmet>
            <meta
               name="description"
               content={`My dictionary - This page does not exist.`}
            />
            <title>This page does not exist</title>
         </Helmet>
         <ErrorMessage
            styles={{
               width: "100%",
               height: "100vh",
            }}
            page404Text="Error 404 - This page does not exist."
         />
      </>
   );
};

export default Page404;
