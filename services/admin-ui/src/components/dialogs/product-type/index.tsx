import { FC } from "react";
import { Dialog, DialogContent, DialogContentText, DialogTitle } from "@mui/material";

import { ProductTypeSelection } from "../../common/product-type";

export interface IUpgradeProductTypeDialogProps {
  onClose: () => void;
  open: boolean;
}

export const UpgradeProductTypeDialog: FC<IUpgradeProductTypeDialogProps> = props => {
  const { onClose, open } = props;

  return (
    <Dialog onClose={onClose} open={open}>
      <DialogTitle>Time to upgrade!</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Not all our features available for launchpad. If you see this dialog it may be the time to upgrade to
          self-hosted version.
        </DialogContentText>
        <ProductTypeSelection />
      </DialogContent>
    </Dialog>
  );
};
