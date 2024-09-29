import { FC } from "react";

import { FormDialog } from "@ethberry/mui-dialog-form";
import { SelectInput, TextInput } from "@ethberry/mui-inputs-core";
import { RichTextEditor } from "@ethberry/mui-inputs-draft";
import { EntityInput } from "@ethberry/mui-inputs-entity";
import { ProductStatus } from "@framework/types";
import type { ICategory, IProduct } from "@framework/types";

import { ParameterSelectInput } from "../../../../components/inputs/parameter-select";
import { validationSchema } from "./validation";

export interface IEditProductDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: (values: Partial<IProduct>, form: any) => Promise<void>;
  initialValues: IProduct;
}

export const EditProductDialog: FC<IEditProductDialogProps> = props => {
  const { initialValues, ...rest } = props;

  const { id, title, description, categories, productStatus } = initialValues;
  const fixedValues = {
    id,
    title,
    description,
    parameters: [],
    productItems: [],
    productStatus,
    categoryIds: categories.map((category: ICategory) => category.id),
  };

  const message = id ? "dialogs.edit" : "dialogs.create";

  return (
    <FormDialog initialValues={fixedValues} validationSchema={validationSchema} message={message} {...rest}>
      <TextInput name="title" />
      <RichTextEditor name="description" />
      <EntityInput name="categoryIds" controller="ecommerce/categories" multiple />
      <ParameterSelectInput multiple prefix="parameters" />
      {id ? <SelectInput name="productStatus" options={ProductStatus} /> : null}
    </FormDialog>
  );
};
