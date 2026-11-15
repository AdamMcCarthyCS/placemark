export function validationError(request, h, error) {
  console.log(error.message);
  // added to make error messages more visable when debugging
  throw error
}
