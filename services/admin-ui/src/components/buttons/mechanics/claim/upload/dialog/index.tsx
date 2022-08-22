import React, { FC } from "react";

import { FormDialog } from "@gemunion/mui-dialog-form";
import { AutoSave } from "@gemunion/mui-form";

import { validationSchema } from "./validation";
import { FileInput } from "./file-input";

export interface IClaimUploadDto {
  files: Array<File>;
}

export interface IClaimUploadDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: (values: any, form: any) => Promise<void>;
  initialValues: IClaimUploadDto;
}

export const ClaimUploadDialog: FC<IClaimUploadDialogProps> = props => {
  const { initialValues, onConfirm, ...rest } = props;

  return (
    <FormDialog
      initialValues={initialValues}
      validationSchema={validationSchema}
      message="dialogs.upload"
      testId="ClaimUploadDialog"
      onConfirm={onConfirm}
      {...rest}
    >
      <FileInput />
      <AutoSave onSubmit={values => onConfirm(values, null)} />
    </FormDialog>
  );
};
