import img from "./error.png";
import { useNavigate } from "react-router-dom";

const ErrorMessage = ({ styles, page404Text }) => {
   let navigate = useNavigate();

   return (
      <div className="errorMessage" style={styles}>
         <img src={img} alt="error" />
         {page404Text ? <div className="page404">{page404Text}</div> : null}
         <button
            className="btn-error form-btn btn"
            onClick={() => window.location.reload(true)}
         >
            Refresh page
         </button>
         <button
            className="btn-error form-btn btn"
            onClick={() => navigate("/")}
         >
            Go home
         </button>
      </div>
   );
};

export default ErrorMessage;
