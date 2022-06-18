import { FC } from "react";

import { FormDialog } from "@gemunion/mui-dialog-form";
import { IErc998Recipe } from "@framework/types";

import { validationSchema } from "./validation";
import { Ingredients } from "./ingredients";
import { RandomInput } from "./random-input";

export interface IRecipeTokenDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: (values: Partial<IErc998Recipe>, form: any) => Promise<void>;
  initialValues: IErc998Recipe;
}

export const Erc998RecipeEditDialog: FC<IRecipeTokenDialogProps> = props => {
  const { initialValues, ...rest } = props;

  const { id, erc998TemplateId, erc998DropboxId, ingredients } = initialValues;
  const fixedValues = {
    id,
    erc998TemplateId,
    erc998DropboxId,
    random: !!erc998DropboxId,
    ingredients: ingredients.map(({ erc1155TokenId, amount }) => ({ erc1155TokenId, amount })),
  };

  return (
    <FormDialog
      initialValues={fixedValues}
      validationSchema={validationSchema}
      message={"dialogs.edit"}
      data-testid="Erc998RecipeEditDialog"
      {...rest}
    >
      <RandomInput name="random" />
      <Ingredients name="ingredients" />
    </FormDialog>
  );
};
