import { Formik, Form } from "formik";
import * as Yup from "yup";
import { MyTextInput } from "../../utils/MyTextInput";

const PasswordResetEnterEmail = ({ handleClick, onClose }) => {
   return (
      <Formik
         initialValues={{
            email: "",
         }}
         validationSchema={Yup.object({
            email: Yup.string()
               .matches(
                  // eslint-disable-next-line
                  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                  "Invalid email format."
               )
               .required("Required field."),
         })}
         onSubmit={(values, { resetForm }) => {
            handleClick(values.email);
            resetForm({});
            onClose();
         }}
      >
         <Form className="add-words-form form">
            <div className="form-info">
               A password reset email will be sent to your email.
            </div>
            <MyTextInput
               className="form-input"
               id="email"
               name="email"
               type="email"
               autoFocus
               placeholder="Email"
            />
            <button className="form-btn btn" type="submit">
               Send an email
            </button>
         </Form>
      </Formik>
   );
};

export default PasswordResetEnterEmail;
