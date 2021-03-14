import * as yup from "yup";

const loginSchema = yup.object().shape({
  email: yup.string().email().required(),
  password: yup.string().min(6).required(),
});

const registerSchema = yup.object().shape({
  name: yup.string().required(),
  username: yup.string().min(4).required(),
  email: yup.string().email().required(),
  password: yup.string().min(6).required(),
});

const updateSchema = yup.object().shape({
  name: yup.string().required(),
  bio: yup.string().nullable(),
  website: yup.lazy((value) =>
    !value
      ? yup.string()
      : yup
          .string()
          .matches(
            /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/,
            "Invalid url."
          )
  ),
});

export { loginSchema, registerSchema, updateSchema };
