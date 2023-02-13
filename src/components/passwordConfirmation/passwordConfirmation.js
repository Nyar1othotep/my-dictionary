import { Formik, Form } from "formik";
import * as Yup from "yup";
import { MyTextInput } from "../../utils/MyTextInput";

const PasswordConfirmation = ({ handleClick, onClose }) => {
   return (
      <Formik
         initialValues={{
            password: "",
         }}
         validationSchema={Yup.object({
            password: Yup.string()
               .required("Required field")
               .min(8, "Password is too short - should be 8 chars minimum.")
               .matches(/[a-zA-Z]/, "Password can only contain Latin letters."),
         })}
         onSubmit={(values, { resetForm }) => {
            handleClick(values.password);
            resetForm({});
            onClose();
         }}
      >
         <Form className="add-words-form form">
            <div className="form-info">
               All your data and records will also be deleted!
            </div>
            <MyTextInput
               className="form-input"
               id="password"
               name="password"
               type="password"
               placeholder="Password"
            />
            <button className="form-btn btn" type="submit">
               Confirm password
            </button>
         </Form>
      </Formik>
   );
};

export default PasswordConfirmation;
