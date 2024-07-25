import { FC } from "react";

import { FormDialog } from "@gemunion/mui-dialog-form";
import { TextInput } from "@gemunion/mui-inputs-core";

import { validationSchema } from "./validation";

export interface IBaseTokenURIDto {
  baseTokenURI: string;
}

export interface IBaseTokenURIEditDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: (values: IBaseTokenURIDto, form: any) => Promise<void>;
  initialValues: IBaseTokenURIDto;
}

export const BaseTokenURIEditDialog: FC<IBaseTokenURIEditDialogProps> = props => {
  const { initialValues, ...rest } = props;

  return (
    <FormDialog
      initialValues={initialValues}
      validationSchema={validationSchema}
      message="dialogs.edit"
      testId="BaseTokenURIEditForm"
      disabled={false}
      {...rest}
    >
      <TextInput name="baseTokenURI" required />
    </FormDialog>
  );
};
