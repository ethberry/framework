import { FC } from "react";
import { Dialog, DialogContent, DialogContentText, DialogTitle, Grid, Typography } from "@mui/material";

export interface IUpgradeRatePlanPopoverProps {
  onClose: () => void;
  open: boolean;
}

export const UpgradeRatePlanDialog: FC<IUpgradeRatePlanPopoverProps> = props => {
  const { onClose, open } = props;

  return (
    <Dialog onClose={onClose} open={open}>
      <DialogTitle>Time to upgrade!</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Not all our features available for launchpad. If you see this dialog it may be the time to upgrade to
          self-hosted version.
        </DialogContentText>
        <Grid container>
          <Grid item xs={4} sx={{ textAlign: "center" }}>
            <Typography>Bronze</Typography>
          </Grid>
          <Grid item xs={4} sx={{ textAlign: "center" }}>
            <Typography>Silver</Typography>
          </Grid>
          <Grid item xs={4} sx={{ textAlign: "center" }}>
            <Typography>Gold</Typography>
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
};
