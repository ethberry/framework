import React, { FC } from "react";

import { FormDialog } from "@gemunion/mui-dialog-form";
import { ProgressOverlay } from "@gemunion/mui-page-layout";

import { ICollectionRow } from "../index";
import { validationSchema } from "./validation";
import { FileInput } from "./file-input";
import { CollectionInfoPopover } from "./popover";

export interface ICollectionUploadDto {
  files: Array<File>;
  tokens: ICollectionRow[];
}

export interface ICollectionUploadDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: (values: any, form: any) => Promise<void>;
  initialValues: ICollectionUploadDto;
  isLoading: boolean;
}

export const CollectionUploadDialog: FC<ICollectionUploadDialogProps> = props => {
  const { initialValues, isLoading, ...rest } = props;

  return (
    <FormDialog
      initialValues={initialValues}
      validationSchema={validationSchema}
      message="dialogs.upload"
      testId="CollectionUploadDialog"
      action={<CollectionInfoPopover />}
      {...rest}
    >
      <ProgressOverlay isLoading={isLoading}>
        <FileInput initialValues={initialValues} />
      </ProgressOverlay>
    </FormDialog>
  );
};
