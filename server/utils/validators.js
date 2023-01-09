export const loginValidator = (values) => {
  let errors = {};
  for (const key in values) {
    if (!values[key]) {
      errors[key] = `${key}_empty`;
    }
  }

  return { errors, isInvalid: Object.keys(errors).length > 0 };
};
