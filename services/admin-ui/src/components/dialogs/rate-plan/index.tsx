import { FC } from "react";
import { Dialog, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import { RatePlansSelection } from "../../common/rate-plan";

export interface IUpgradeRatePlanDialogProps {
  onClose: () => void;
  open: boolean;
}

export const UpgradeRatePlanDialog: FC<IUpgradeRatePlanDialogProps> = props => {
  const { onClose, open } = props;

  return (
    <Dialog onClose={onClose} open={open}>
      <DialogTitle>Time to upgrade!</DialogTitle>
      <DialogContent>
        <DialogContentText>
          It looks like you have reached the limits of your current rate plan and it is time to upgrade
        </DialogContentText>
        <RatePlansSelection />
      </DialogContent>
    </Dialog>
  );
};
