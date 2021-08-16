import React, { FC } from "react";

import { FormDialog } from "@gemunion/material-ui-dialog-form";
import { NumberInput, SelectInput, TextInput } from "@gemunion/material-ui-inputs-core";
import { CurrencyInput } from "@gemunion/material-ui-inputs-mask";
import { RichTextEditor } from "@gemunion/framework-material-ui-rte";
import { EntityInput } from "@gemunion/material-ui-inputs-entity";
import { PhotoInput } from "@gemunion/material-ui-inputs-image-s3";
import { ICategory, IProduct, ProductStatus } from "@gemunion/framework-types";

import { validationSchema } from "./validation";

export interface IEditProductDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: (values: Partial<IProduct>, formikBag: any) => Promise<void>;
  initialValues: IProduct;
}

export const EditProductDialog: FC<IEditProductDialogProps> = props => {
  const { initialValues, ...rest } = props;

  const { id, title, description, categories, price, amount, productStatus, merchantId, photos } = initialValues;
  const fixedValues = {
    id,
    title,
    description,
    price,
    amount,
    merchantId,
    photos,
    categoryIds: categories.map((category: ICategory) => category.id),
  };

  if (id) {
    Object.assign(fixedValues, { productStatus });
  }

  const message = id ? "dialogs.add" : "dialogs.edit";

  return (
    <FormDialog initialValues={fixedValues} validationSchema={validationSchema} message={message} {...rest}>
      <TextInput name="title" />
      <RichTextEditor name="description" />
      <EntityInput name="categoryIds" controller="categories" multiple />
      <CurrencyInput name="price" />
      <NumberInput name="amount" />
      {id ? <SelectInput name="productStatus" options={ProductStatus} /> : null}
      <EntityInput name="merchantId" controller="merchants" />
      <PhotoInput name="photos" />
    </FormDialog>
  );
};
