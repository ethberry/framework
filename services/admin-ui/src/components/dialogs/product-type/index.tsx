import { FC } from "react";
import { Dialog, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import { useIntl } from "react-intl";

import { ProductTypeSelection } from "@gemunion/license-pages";

export interface IUpgradeProductTypeDialogProps {
  onClose: () => void;
  open: boolean;
}

export const UpgradeProductTypeDialog: FC<IUpgradeProductTypeDialogProps> = props => {
  const { onClose, open } = props;
  const { formatMessage } = useIntl();

  return (
    <Dialog onClose={onClose} open={open} maxWidth="lg">
      <DialogTitle>{formatMessage({ id: "pages.productType.dialog.title" })}</DialogTitle>
      <DialogContent>
        <DialogContentText fontSize={16} fontWeight={500} marginBottom={2}>
          {formatMessage({ id: "pages.productType.dialog.text" })}
        </DialogContentText>
        <ProductTypeSelection />
      </DialogContent>
    </Dialog>
  );
};
