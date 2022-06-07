import { FC, useState } from "react";
import { Button } from "@mui/material";
import { FormattedMessage } from "react-intl";

import { ConfirmationDialog } from "@gemunion/mui-dialog-confirmation";

import { useSeaport } from "../../../providers/seaport";

export const BulkCancelOrdersButton: FC = () => {
  const [isConfirmationDialogOpen, setIsConfirmationDialogOpen] = useState(false);

  const seaport = useSeaport();

  const handleIncrementNonce = () => {
    setIsConfirmationDialogOpen(true);
  };

  const handleConfirm = () => {
    return seaport.bulkCancelOrders();
  };

  const handleCancel = () => {
    setIsConfirmationDialogOpen(false);
  };

  return (
    <>
      <Button onClick={handleIncrementNonce} data-testid="SeaportBulkCancelOrderDialog">
        <FormattedMessage id="form.buttons.nonce" />
      </Button>
      <ConfirmationDialog
        maxWidth="xs"
        data-testid="SeaportBulkCancelOrderDialog"
        onConfirm={handleConfirm}
        onCancel={handleCancel}
        open={isConfirmationDialogOpen}
      >
        <FormattedMessage id="dialogs.bulk-cancel-order" />
      </ConfirmationDialog>
    </>
  );
};
