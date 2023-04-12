import * as Yup from "yup";
import { useFormik } from "formik";
import { ReactElement } from "react";
import Inputgenerator from "./inputgenerate/input.generator";
import Styles from "./form.module.scss";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../../../features/store/store";
import {
  useAddTodoMutation,
  useUpdateTodoMutation,
} from "../../../../../../features/api/apiSlice";
import { toast, ToastContainer } from "react-toastify";
import {
  addTodoToItems,
  hndleAction,
} from "../../../../../../features/slices/itemSlice";
////////////////////////////////////////////set Type for our form include props / children
type initialInputes = {
  children?: ReactElement | ReactElement[];

  title?: string;
  id?: string | number;
  description?: string;
  dueDate?: Date | string;
  setOpen?: React.Dispatch<React.SetStateAction<boolean>> | undefined;
  open?: boolean | undefined;
};
////////////////////////////////////////////////////////////////////////////////
/**
 * @default the form below is the defualt version of our component
 * @param all props are optional
 * @returns return a react form element
 */
////////////////////////////////////////////////////////////////////////////////////
const Form = ({
  children,
  title,
  id,
  description,
  dueDate,
  open,
  setOpen,
}: initialInputes) => {
  ///////////////////////////////////////////////////////////////////////////////////////
  // state section => select the action and item from slice of redux toolkit in feautures
  ///////////use updateTodo mutation for update the card
  /// use add Todo for add new Item

  const todoType = useSelector((state: RootState) => state.itemSlice.todoType);
  const actiontype = useSelector((state: RootState) => state.itemSlice.action);
  const [addTodo, { isLoading, isSuccess }] = useAddTodoMutation();
  const [updateTodo] = useUpdateTodoMutation();
  const dispatch = useDispatch();
  //////////////////////////////////////////////////////////////////////
  /// we use formik to hndle error and patterns easily and firsst we gave it the initial values

  const formik = useFormik({
    initialValues: {
      title: title ? title : "",
      description: description ? description : "",
      date: dueDate ? dueDate : "",
    },
    validationSchema: Yup.object({
      title: Yup.string().required(" you should write the title !"),
      description: Yup.string().required("you should write the description"),
      date: Yup.string().required("you shoul choose the date"),
    }),
    ////////////////////////now we ucreate a submit func for hndling submit
    onSubmit: async (value: any) => {
      try {
        const title = value.title;
        const date = value.date;
        const description = value.description;
        console.log(title, date, description, todoType);

        ///// we use a action guard for check the action <if Add> add a new item else <Edit with update todo mutation>
        if (actiontype === "Add") {
          addTodo({ dueDate: date, title, description, type: todoType });
          dispatch(
            addTodoToItems({
              dueDate: date,
              title,
              description,
              type: todoType,
            })
          );
        }
        if (actiontype === "Edit") {
          updateTodo({ id, title, description, date, todoType });
          if (setOpen !== undefined) {
            setTimeout(() => setOpen(!open), 1000);
          }
          dispatch(hndleAction("Add"));
        }

        toast.success(
          actiontype === "Add" ? "todo added !" : "Todo Edited successfully",
          {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
          }
        );
      } catch (error) {
        alert(error);
      }
    },
  });
  return (
    <>
      <form
        id={actiontype === "Add" ? "addTodo" : "EditTodo"}
        onSubmit={formik.handleSubmit}
        className={Styles["form-container"]}
      >
        <Inputgenerator
          title="Title"
          inputType="text"
          name={"title"}
          placeholder="Enter todo title"
          id="userName"
          errorMsg={
            formik.touched.title && formik.errors.title && formik.errors.title
          }
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.title}
          isvalid={formik.touched.title && formik.errors.title ? true : false}
        />
        <Inputgenerator
          errorMsg={
            formik.touched.description &&
            formik.errors.description &&
            formik.errors.description
          }
          title="Discription"
          inputType="text"
          name={"description"}
          placeholder="Enter todo  description "
          id="userName"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.description}
          isvalid={
            formik.touched.description && formik.errors.description
              ? true
              : false
          }
        />
        <Inputgenerator
          errorMsg={
            formik.touched.date && formik.errors.date && formik.errors.date
          }
          title="Due Date"
          inputType="date"
          name={"date"}
          id="date"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.date}
          isvalid={formik.touched.date && formik.errors.date ? true : false}
        />
        <input
          type="submit"
          className={Styles["btn"]}
          value={"Edit"}
          style={{ visibility: actiontype === "Add" ? "hidden" : "visible" }}
        />
      </form>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </>
  );
};

export default Form;
