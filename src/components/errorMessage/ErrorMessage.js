import img from "./error.png";

const ErrorMessage = () => {
   return (
      <div
         style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
				flexDirection: "column",
            width: "100%",
            height: "100vh",
         }}
      >
         <img
            style={{
               display: "block",
               width: "200px",
               height: "200px",
               objectFit: "contain",
               margin: "0 auto",
            }}
            src={img}
            alt="error"
         />
         <button
            className="btn-error form-btn btn"
            onClick={() => window.location.reload(true)}
         >
            Refresh page
         </button>
      </div>
   );
};

export default ErrorMessage;
