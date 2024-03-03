import { array, number, object } from "yup";

import { tokenAssetValidationSchema } from "@gemunion/mui-inputs-asset";

function findAllDuplicateIndices<T>(array: T[]): number[] {
  const seen = new Set<T>();
  const duplicateIndices: number[] = [];

  for (let i = 0; i < array.length; i++) {
    if (seen.has(array[i])) {
      duplicateIndices.push(i); // Добавляем индекс дубликата
    } else {
      seen.add(array[i]);
    }
  }

  return duplicateIndices; // Возвращаем массив индексов дубликатов
}

export const validationSchema = object().shape({
  tokens: array()
    .of(
      object().shape({
        tokenId: number().min(1, "form.validations.rangeUnderflow").required("form.validations.required"),
      }),
    )
    .test("isUnique", (value = [], { createError }) => {
      const duplicateIndexes = findAllDuplicateIndices(value.map(item => item.tokenId));
      if (duplicateIndexes.length) {
        return createError({
          path: `tokens[${duplicateIndexes[0]}].tokenId`,
          message: "form.validations.duplicate",
        });
      }
      return value.length === [...new Set(value.map(item => item.tokenId))].length;
    })
    .required("form.validations.required"),
  tokenEntities: array().of(tokenAssetValidationSchema).required("form.validations.required"),
  tokenIds: array().of(number().required("form.validations.required")).required("form.validations.required"),
});
