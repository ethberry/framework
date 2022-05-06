import { FC } from "react";

import { FormDialog } from "@gemunion/mui-dialog-form";
import { TextInput } from "@gemunion/mui-inputs-core";
import { RichTextEditor } from "@gemunion/mui-inputs-draft";
import { IErc1155Recipe } from "@framework/types";
import { EntityInput } from "@gemunion/mui-inputs-entity";

import { validationSchema } from "./validation";
import { Ingredients } from "./ingredients";

export interface IRecipeTokenDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: (values: Partial<IErc1155Recipe>, formikBag: any) => Promise<void>;
  initialValues: IErc1155Recipe;
}

export const Erc1155RecipeEditDialog: FC<IRecipeTokenDialogProps> = props => {
  const { initialValues, ...rest } = props;

  const { id, title, description, erc1155TokenId, ingredients, recipeStatus } = initialValues;
  const fixedValues = {
    id,
    title,
    description,
    erc1155TokenId,
    recipeStatus,
    ingredients: ingredients.map(({ erc1155TokenId, amount }) => ({ erc1155TokenId, amount })),
  };

  return (
    <FormDialog
      initialValues={fixedValues}
      validationSchema={validationSchema}
      message={"dialogs.edit"}
      data-testid="Erc1155RecipeEditDialog"
      {...rest}
    >
      <TextInput name="title" readOnly={!!id} />
      <RichTextEditor name="description" />
      <EntityInput name="erc1155TokenId" controller="erc1155-tokens" readOnly={!!id} />
      <Ingredients name="ingredients" />
    </FormDialog>
  );
};
