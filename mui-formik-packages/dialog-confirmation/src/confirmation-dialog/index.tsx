import { FC } from "react";
import { FormattedMessage } from "react-intl";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogProps,
  DialogTitle,
} from "@mui/material";

export interface IConfirmationDialogProps extends DialogProps {
  onCancel: () => void;
  onConfirm: () => void;
  message?: string;
}

export const ConfirmationDialog: FC<IConfirmationDialogProps> = props => {
  const { onCancel, onConfirm, children, message = "dialogs.confirmation", maxWidth = "sm", ...rest } = props;
  return (
    <Dialog
      fullWidth
      maxWidth={maxWidth}
      onClose={onCancel}
      aria-labelledby="confirmation-dialog-title"
      aria-describedby="confirmation-dialog-content"
      data-testid="dialogConfirmation"
      {...rest}
    >
      <DialogTitle id="confirmation-dialog-title">
        <FormattedMessage id={message} />
      </DialogTitle>
      <DialogContent id="confirmation-dialog-content">
        <DialogContentText component="div">{children}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button variant="text" onClick={onCancel} data-testid="dialogCancelButton">
          <FormattedMessage id="form.buttons.cancel" />
        </Button>
        <Button variant="contained" color="primary" onClick={onConfirm} data-testid="dialogConfirmButton">
          <FormattedMessage id="form.buttons.ok" />
        </Button>
      </DialogActions>
    </Dialog>
  );
};
