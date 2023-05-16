export const getFormData = (object: Record<string, any>) => {
  const formData = new FormData();
  Object.keys(object).forEach(key => formData.append(key, object[key], object[key].name));
  return formData;
};
