import * as yup from "yup";

export default yup.object().shape({
  body: yup.string().max(280)
});
