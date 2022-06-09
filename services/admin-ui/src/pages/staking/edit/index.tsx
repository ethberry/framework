import { FC } from "react";
import { Grid } from "@mui/material";

import { FormDialog } from "@gemunion/mui-dialog-form";
import { TextInput } from "@gemunion/mui-inputs-core";
import { RichTextEditor } from "@gemunion/mui-inputs-draft";
import { IStaking } from "@framework/types";

import { validationSchema } from "./validation";
import { ItemTypeInput } from "./item-type-input";
import { ItemType } from "./interfaces";
import { TokenInput } from "./token-input";

export interface IStakingEditDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: (values: Partial<IStaking>, form: any) => Promise<void>;
  initialValues: IStaking;
}

export const StakingEditDialog: FC<IStakingEditDialogProps> = props => {
  const { initialValues, ...rest } = props;

  const { id, title, description } = initialValues;
  const fixedValues = {
    id,
    title,
    description,
    deposit: {
      itemType: ItemType.NATIVE,
    },
    reward: {
      itemType: ItemType.NATIVE,
    },
  };

  return (
    <FormDialog
      initialValues={fixedValues}
      validationSchema={validationSchema}
      message={"dialogs.edit"}
      data-testid="StakingEditDialog"
      {...rest}
    >
      <TextInput name="title" />
      <RichTextEditor name="description" />

      <Grid container spacing={2}>
        <Grid item xs={6}>
          <ItemTypeInput prefix="deposit" />
          <TokenInput prefix="deposit" />
        </Grid>
        <Grid item xs={6}>
          <ItemTypeInput prefix="reward" />
          <TokenInput prefix="reward" />
        </Grid>
      </Grid>
    </FormDialog>
  );
};
