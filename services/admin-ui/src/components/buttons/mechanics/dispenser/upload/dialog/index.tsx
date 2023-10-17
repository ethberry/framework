import React, { FC } from "react";
import { Box } from "@mui/material";

import { FormDialog } from "@gemunion/mui-dialog-form";
import { ProgressOverlay } from "@gemunion/mui-page-layout";

import { validationSchema } from "./validation";
import type { IDispenserUploadDto } from "./file-input";
import { FileInput } from "./file-input";
import { DispenserInfoPopover } from "./popover";

export interface IDispenserUploadDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: (values: any, form: any) => Promise<void>;
  initialValues: IDispenserUploadDto;
  isLoading: boolean;
}

export const DispenserUploadDialog: FC<IDispenserUploadDialogProps> = props => {
  const { initialValues, isLoading, ...rest } = props;

  return (
    <FormDialog
      initialValues={initialValues}
      validationSchema={validationSchema}
      message="dialogs.upload"
      testId="ClaimUploadDialog"
      action={<DispenserInfoPopover />}
      {...rest}
    >
      <ProgressOverlay isLoading={isLoading}>
        <Box sx={{ mt: 2 }}>
          <FileInput initialValues={initialValues} />
        </Box>
      </ProgressOverlay>
    </FormDialog>
  );
};
