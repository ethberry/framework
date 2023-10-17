import React, { FC } from "react";
import { FormattedMessage } from "react-intl";
import { Alert } from "@mui/material";

import { FormDialog } from "@gemunion/mui-dialog-form";
import { ProgressOverlay } from "@gemunion/mui-page-layout";
import { TextInput } from "@gemunion/mui-inputs-core";
import type { IInvitationCreateDto } from "@framework/types";

import { validationSchema } from "./validation";

export interface IInviteDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: (values: any, form: any) => Promise<void>;
  isLoading: boolean;
  initialValues: IInvitationCreateDto;
}

export const InviteDialog: FC<IInviteDialogProps> = props => {
  const { isLoading, initialValues, ...rest } = props;

  return (
    <FormDialog
      initialValues={initialValues}
      validationSchema={validationSchema}
      message="dialogs.invite"
      testId="InviteDialog"
      {...rest}
    >
      <ProgressOverlay isLoading={isLoading}>
        <Alert severity="warning" sx={{ mt: 2 }}>
          <FormattedMessage id="alert.onlyIfUserExists" />
        </Alert>
        <TextInput name="email" type="email" />
      </ProgressOverlay>
    </FormDialog>
  );
};
