import { FC } from "react";

import { FormDialog } from "@gemunion/mui-dialog-form";
import { TextInput } from "@gemunion/mui-inputs-core";
import { RichTextEditor } from "@gemunion/mui-inputs-draft";
import { IStaking } from "@framework/types";

import { validationSchema } from "./validation";

export interface IStakingEditDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: (values: Partial<IStaking>, form: any) => Promise<void>;
  initialValues: IStaking;
}

export const StakingEditDialog: FC<IStakingEditDialogProps> = props => {
  const { initialValues, ...rest } = props;

  const { id } = initialValues;
  const fixedValues = {
    id,
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
    </FormDialog>
  );
};
