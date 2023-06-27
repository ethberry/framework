import React, { FC } from "react";

import { FormDialog } from "@gemunion/mui-dialog-form";
import { ProgressOverlay } from "@gemunion/mui-page-layout";

import { validationSchema } from "./validation";
import type { IClaimUploadDto } from "./file-input";
import { FileInput } from "./file-input";
import { VestingClaimInfoPopover } from "./popover";

export interface IClaimUploadDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: (values: any, form: any) => Promise<void>;
  isLoading: boolean;
  initialValues: IClaimUploadDto;
}

export const VestingClaimUploadDialog: FC<IClaimUploadDialogProps> = props => {
  const { isLoading, initialValues, onConfirm, ...rest } = props;

  return (
    <FormDialog
      initialValues={initialValues}
      validationSchema={validationSchema}
      message="dialogs.upload"
      testId="VestingClaimUploadDialog"
      onConfirm={onConfirm}
      action={<VestingClaimInfoPopover />}
      {...rest}
    >
      <ProgressOverlay isLoading={isLoading}>
        <FileInput initialValues={initialValues} />
      </ProgressOverlay>
    </FormDialog>
  );
};
