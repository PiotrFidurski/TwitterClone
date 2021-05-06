import * as yup from "yup";

export const schema = yup.object().shape({
  name: yup.string().required(),
  username: yup.string().required(),
  email: yup.string().email().required(),
  password: yup
    .string()
    .min(8)
    .max(40)
    .required()
    .matches(
      /^(?=.*[A-Z])/,
      "password must contain at least one capital letter"
    )
    .matches(/^(?=.*[0-9])/, "password must contain at least one number")
    .matches(
      /^(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]/,
      "password must contain at least one special character"
    )
    .matches(/^(?=.*\d)(?=.*[a-z]).{8,}$/),
});
