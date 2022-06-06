import { FC } from "react";

import { FormDialog } from "@gemunion/mui-dialog-form";
import { IErc721Recipe } from "@framework/types";

import { validationSchema } from "./validation";
import { Ingredients } from "./ingredients";
import { RandomInput } from "./random-input";

export interface IRecipeTokenDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: (values: Partial<IErc721Recipe>, form: any) => Promise<void>;
  initialValues: IErc721Recipe;
}

export const Erc721RecipeEditDialog: FC<IRecipeTokenDialogProps> = props => {
  const { initialValues, ...rest } = props;

  const { id, erc721TemplateId, erc721DropboxId, ingredients } = initialValues;
  const fixedValues = {
    id,
    erc721TemplateId,
    erc721DropboxId,
    random: !!erc721DropboxId,
    ingredients: ingredients.map(({ erc1155TokenId, amount }) => ({ erc1155TokenId, amount })),
  };

  return (
    <FormDialog
      initialValues={fixedValues}
      validationSchema={validationSchema}
      message={"dialogs.edit"}
      data-testid="Erc721RecipeEditDialog"
      {...rest}
    >
      <RandomInput name="random" />
      <Ingredients name="ingredients" />
    </FormDialog>
  );
};
