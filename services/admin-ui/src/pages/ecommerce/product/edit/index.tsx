import { FC } from "react";

import { FormDialog } from "@gemunion/mui-dialog-form";
import { NumberInput, SelectInput, TextInput } from "@gemunion/mui-inputs-core";
import { RichTextEditor } from "@gemunion/mui-inputs-draft";
import { EntityInput } from "@gemunion/mui-inputs-entity";
import { PhotoInput } from "@gemunion/mui-inputs-image-firebase";
import { TemplateAssetInput } from "@gemunion/mui-inputs-asset";
import { ICategory, IProduct, ProductStatus, TokenType } from "@framework/types";

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

  const { id, title, description, categories, price, amount, productStatus, merchantId, photos } = initialValues;
  const fixedValues = {
    id,
    title,
    description,
    price,
    amount,
    merchantId,
    photos,
    parameters: [],
    productStatus,
    categoryIds: categories.map((category: ICategory) => category.id),
  };

  const message = id ? "dialogs.edit" : "dialogs.create";

  return (
    <FormDialog initialValues={fixedValues} validationSchema={validationSchema} message={message} {...rest}>
      <TextInput name="title" />
      <RichTextEditor name="description" />
      <EntityInput name="categoryIds" controller="categories" multiple />
      <TemplateAssetInput
        multiple
        prefix="price"
        tokenType={{ disabledOptions: [TokenType.NATIVE, TokenType.ERC721, TokenType.ERC998, TokenType.ERC1155] }}
      />
      <ParameterSelectInput multiple prefix="parameters" />
      <NumberInput name="amount" />
      {id ? <SelectInput name="productStatus" options={ProductStatus} /> : null}
      <EntityInput name="merchantId" controller="merchants" autoselect />
      <PhotoInput name="photos" />
    </FormDialog>
  );
};
