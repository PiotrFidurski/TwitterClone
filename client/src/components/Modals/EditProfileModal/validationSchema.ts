import * as yup from "yup";

export const schema = yup.object().shape({
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
          .nullable()
  ),
});
