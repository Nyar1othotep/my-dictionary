import { useField } from "formik";

export const MyTextInput = ({ label, ...props }) => {
   const [field, meta] = useField(props);

   return (
      <>
         {label ? <label htmlFor={props.name}>{label}</label> : null}
         <div className="input">
            <input {...props} {...field} />
            {meta.touched && meta.error ? (
               <div className="error">{meta.error}</div>
            ) : null}
         </div>
      </>
   );
};