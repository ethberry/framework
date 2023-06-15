import React, { FC } from "react";
import { Box } from "@mui/material";

import { FormDialog } from "@gemunion/mui-dialog-form";
import { ProgressOverlay } from "@gemunion/mui-page-layout";

import { validationSchema } from "./validation";
import { FileInput } from "./file-input";
import { DisperseInfoPopover } from "./popover";
import { IDisperseRow } from "../index";

export interface IDisperseUploadDto {
  files: Array<File>;
  disperses: IDisperseRow[];
}

export interface IDisperseUploadDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: (values: any, form: any) => Promise<void>;
  initialValues: IDisperseUploadDto;
  isLoading: boolean;
}

export const DisperseUploadDialog: FC<IDisperseUploadDialogProps> = props => {
  const { initialValues, isLoading, onConfirm, ...rest } = props;

  return (
    <FormDialog
      initialValues={initialValues}
      validationSchema={validationSchema}
      message="dialogs.upload"
      testId="ClaimUploadDialog"
      onConfirm={onConfirm}
      action={<DisperseInfoPopover />}
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
