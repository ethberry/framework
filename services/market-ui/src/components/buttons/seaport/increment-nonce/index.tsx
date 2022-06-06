import { FC, useState } from "react";
import { Button } from "@mui/material";
import { FormattedMessage } from "react-intl";

import { ConfirmationDialog } from "@gemunion/mui-dialog-confirmation";

import { useSeaport } from "../../../providers/seaport";

export const SeaportIncrementNonceButton: FC = () => {
  const [isConfirmationDialogOpen, setIsConfirmationDialogOpen] = useState(false);

  const seaport = useSeaport();

  const handleIncrementNonce = () => {
    setIsConfirmationDialogOpen(true);
  };

  const handleConfirm = () => {
    return seaport.incrementNonce();
  };

  const handleCancel = () => {
    setIsConfirmationDialogOpen(false);
  };

  return (
    <>
      <Button onClick={handleIncrementNonce} data-testid="SeaportIncrementNonceButton">
        <FormattedMessage id="form.buttons.nonce" />
      </Button>
      <ConfirmationDialog
        maxWidth="xs"
        data-testid="SeaportIncrementNonceDialog"
        onConfirm={handleConfirm}
        onCancel={handleCancel}
        open={isConfirmationDialogOpen}
      >
        <FormattedMessage id="dialogs.nonce" />
      </ConfirmationDialog>
    </>
  );
};
