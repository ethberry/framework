import React, { FC } from "react";

import { FormDialog } from "@gemunion/mui-dialog-form";
import { ProgressOverlay } from "@gemunion/mui-page-layout";
import type { IVestingClaimUploadDto } from "@framework/types";

import { validationSchema } from "./validation";
import { FileInput } from "./file-input";
import { VestingClaimInfoPopover } from "./popover";

export interface IVestingClaimUploadDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: (values: any, form: any) => Promise<void>;
  isLoading: boolean;
  initialValues: IVestingClaimUploadDto;
}

export const VestingClaimUploadDialog: FC<IVestingClaimUploadDialogProps> = props => {
  const { isLoading, initialValues, ...rest } = props;

  return (
    <FormDialog
      initialValues={initialValues}
      validationSchema={validationSchema}
      message="dialogs.upload"
      testId="VestingClaimUploadDialog"
      action={<VestingClaimInfoPopover />}
      {...rest}
    >
      <ProgressOverlay isLoading={isLoading}>
        <FileInput initialValues={initialValues} />
      </ProgressOverlay>
    </FormDialog>
  );
};
