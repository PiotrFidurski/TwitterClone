import * as yup from "yup";

export default yup.object().shape({
  body: yup.string().min(1).max(280),
});
