import { Formik, Form } from "formik";
import * as Yup from "yup";
import { MyTextInput } from "../../utils/MyTextInput";

const AddWordsForm = ({ handleClick }) => {
   return (
      <Formik
         initialValues={{
            en: "",
            ru: "",
         }}
         validationSchema={Yup.object({
            en: Yup.string()
               .required("Required field")
               .min(1, "1 char minimum."),
            ru: Yup.string()
               .required("Required field")
               .min(1, "1 char minimum."),
         })}
         onSubmit={(values, { resetForm }) => {
            handleClick(values.en, values.ru);
            resetForm({});
         }}
      >
         <Form className="add-words-form form">
            <div className="add-words-form__row">
               <MyTextInput
                  className="form-input"
                  id="en"
                  name="en"
                  type="text"
                  placeholder="English word"
               />
               <MyTextInput
                  className="form-input"
                  id="ru"
                  name="ru"
                  type="text"
                  placeholder="Russian word"
               />
            </div>
            <button className="form-btn btn" type="submit">
               Add
            </button>
         </Form>
      </Formik>
   );
};

export default AddWordsForm;
