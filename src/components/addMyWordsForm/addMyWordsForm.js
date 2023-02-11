import { Formik, Form } from "formik";
import * as Yup from "yup";
import { MyTextInput } from "../../utils/MyTextInput";

const AddMyWordsForm = ({ handleClick, onClose }) => {
   return (
      <Formik
         initialValues={{
            title: "",
         }}
         validationSchema={Yup.object({
            title: Yup.string()
               .required("Required field")
               .min(1, "1 char minimum."),
         })}
         onSubmit={(values, { resetForm }) => {
            handleClick(values.title);
            resetForm({});
            onClose();
         }}
      >
         <Form className="add-words-form form">
            <MyTextInput
               className="form-input"
               id="title"
               name="title"
               type="text"
               placeholder="My words title"
            />
            <button className="form-btn btn" type="submit">
               Add
            </button>
         </Form>
      </Formik>
   );
};

export default AddMyWordsForm;
