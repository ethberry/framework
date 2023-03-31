import React, { FC } from "react";

import { FormDialog } from "@gemunion/mui-dialog-form";
import { AutoSave } from "@gemunion/mui-form";

import { validationSchema } from "./validation";
import { FileInput } from "./file-input";
import { CollectionInfoPopover } from "./popover";

export interface ICollectionUploadDto {
  files: Array<File>;
}

export interface ICollectionUploadDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: (values: any, form: any) => Promise<void>;
  initialValues: ICollectionUploadDto;
}

export const CollectionUploadDialog: FC<ICollectionUploadDialogProps> = props => {
  const { initialValues, onConfirm, ...rest } = props;

  return (
    <FormDialog
      initialValues={initialValues}
      validationSchema={validationSchema}
      message="dialogs.upload"
      testId="CollectionUploadDialog"
      onConfirm={onConfirm}
      action={<CollectionInfoPopover />}
      {...rest}
    >
      <FileInput />
      <AutoSave onSubmit={onConfirm} />
    </FormDialog>
  );
};
