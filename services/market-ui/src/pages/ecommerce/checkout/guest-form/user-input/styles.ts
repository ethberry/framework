import { Theme } from "@mui/material/styles";
import { makeStyles } from "@mui/styles";

export const useStyles = makeStyles<Theme>(
  theme => ({
    paper: {
      padding: theme.spacing(2),
    },
  }),
  { name: "CheckoutGuestFormUserInput" },
);
