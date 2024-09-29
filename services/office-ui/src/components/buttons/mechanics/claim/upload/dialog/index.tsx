import React, { FC } from "react";

import { FormDialog } from "@ethberry/mui-dialog-form";
import { ProgressOverlay } from "@ethberry/mui-page-layout";
import type { IClaimTemplateUploadDto } from "@framework/types";

import { validationSchema } from "./validation";
import { FileInput } from "./file-input";
import { ClaimInfoPopover } from "./popover";

export interface IClaimUploadDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: (values: any, form: any) => Promise<void>;
  isLoading: boolean;
  initialValues: IClaimTemplateUploadDto;
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
