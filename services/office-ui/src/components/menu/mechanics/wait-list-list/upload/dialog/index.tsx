import React, { FC } from "react";

import { FormDialog } from "@gemunion/mui-dialog-form";
import { ProgressOverlay } from "@gemunion/mui-page-layout";

import { validationSchema } from "./validation";
import type { IWaitListUploadDto } from "./file-input";
import { FileInput } from "./file-input";
import { WaitListInfoPopover } from "./popover";

export interface IWaitListUploadDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: (values: any, form: any) => Promise<void>;
  isLoading: boolean;
  initialValues: IWaitListUploadDto;
}

export const WaitListUploadDialog: FC<IWaitListUploadDialogProps> = props => {
  const { isLoading, initialValues, onConfirm, ...rest } = props;

  return (
    <FormDialog
      initialValues={initialValues}
      validationSchema={validationSchema}
      message="dialogs.upload"
      testId="WaitListUploadDialog"
      onConfirm={onConfirm}
      action={<WaitListInfoPopover />}
      {...rest}
    >
      <ProgressOverlay isLoading={isLoading}>
        <FileInput initialValues={initialValues} />
      </ProgressOverlay>
    </FormDialog>
  );
};
