import { FC } from "react";
import { Dialog, DialogContent, DialogTitle } from "@mui/material";
import { FormattedMessage } from "react-intl";

import { CloseButton } from "../../close-button";
import { SlippageSettings } from "./slippage";
import { GasSettings } from "./gas";

export interface IAdvancedSettingsDialogProps {
  open: boolean;
  onClose: () => void;
}

export const AdvancedSettingsDialog: FC<IAdvancedSettingsDialogProps> = props => {
  const { open, onClose } = props;

  const handleClose = () => {
    onClose();
  };

  return (
    <Dialog onClose={handleClose} open={open} fullWidth maxWidth="sm">
      <DialogTitle>
        <FormattedMessage id="pages.dex.1inch.advanced-settings.title" />
        <CloseButton onClick={handleClose} />
      </DialogTitle>
      <DialogContent>
        <GasSettings />
        <br />
        <SlippageSettings />
      </DialogContent>
    </Dialog>
  );
};
