export default function (error: any) {
  let errorObj: any = {};

  if (error.path) {
    errorObj[error.path] = error.errors[0];
    return errorObj;
  }
  errorObj[error[0].properties.path] = error[0].properties.message;

  return errorObj;
}
