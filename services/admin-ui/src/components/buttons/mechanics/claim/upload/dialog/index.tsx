import React, { FC } from "react";

import { FormDialog } from "@gemunion/mui-dialog-form";
import { ProgressOverlay } from "@gemunion/mui-page-layout";
import type { IClaimUploadDto } from "@framework/types";

import { validationSchema } from "./validation";
import { FileInput } from "./file-input";
import { ClaimInfoPopover } from "./popover";

export interface IClaimUploadDialogProps {
  open: boolean;
  onCancel: (form?: any) => void;
  onConfirm: (values: any, form: any) => Promise<void>;
  isLoading: boolean;
  initialValues: IClaimUploadDto;
}

export const ClaimUploadDialog: FC<IClaimUploadDialogProps> = props => {
  const { isLoading, initialValues, ...rest } = props;

  return (
    <FormDialog
      initialValues={initialValues}
      validationSchema={validationSchema}
      message="dialogs.upload"
      testId="ClaimUploadDialog"
      action={<ClaimInfoPopover />}
      {...rest}
    >
      <ProgressOverlay isLoading={isLoading}>
        <FileInput initialValues={initialValues} />
      </ProgressOverlay>
    </FormDialog>
  );
};
