import css from "./NoteForm.module.css";
import { Formik, Form, Field, type FormikHelpers, ErrorMessage } from "formik";
import { useId } from "react";
import * as Yup from "yup";

interface OrderFormValues {
  title: string;
  content: string;
  tag: string;
}

interface NoteFormProps {
  onClose: () => void;

  onSubmit?: (noteData: {
    title: string;
    content: string;
    tag: string;
  }) => void;

  isLoading?: boolean;
}

const initialValues: OrderFormValues = {
  title: "",
  content: "",
  tag: "Todo",
};
const OrderFormSchema = Yup.object().shape({
  title: Yup.string()
    .min(2, "Title must be at least 2 characters")
    .max(30, "Title is too long")
    .required("Title is required"),
});

export default function NoteForm({ onClose, onSubmit }: NoteFormProps) {
  const baseId = useId();

  const handleSubmit = async (
    values: OrderFormValues,
    actions: FormikHelpers<OrderFormValues>
  ) => {
    try {
      onSubmit?.(values);

      actions.resetForm();
      onClose();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={OrderFormSchema}
      onSubmit={handleSubmit}
    >
      <Form className={css.form}>
        <div className={css.formGroup}>
          <label htmlFor={`${baseId}-title`}>Title</label>
          <Field
            id={`${baseId}-title`}
            type="text"
            name="title"
            className={css.input}
          />
          <ErrorMessage name="title" component="span" className={css.error} />
        </div>

        <div className={css.formGroup}>
          <label htmlFor={`${baseId}-content`}>Content</label>
          <Field
            as="textarea"
            id={`${baseId}-content`}
            name="content"
            rows={8}
            className={css.textarea}
          />
          <ErrorMessage name="content" component="span" className={css.error} />
        </div>

        <div className={css.formGroup}>
          <label htmlFor={`${baseId}-tag`}>Tag</label>
          <Field
            as="select"
            id={`${baseId}-tag`}
            name="tag"
            className={css.select}
          >
            <option value="Todo">Todo</option>
            <option value="Work">Work</option>
            <option value="Personal">Personal</option>
            <option value="Meeting">Meeting</option>
            <option value="Shopping">Shopping</option>
          </Field>
        </div>

        <div className={css.actions}>
          <button type="button" className={css.cancelButton} onClick={onClose}>
            Cancel
          </button>

          <button type="submit" className={css.submitButton}>
            Create note
          </button>
        </div>
      </Form>
    </Formik>
  );
}
