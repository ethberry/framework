import { Theme } from "@mui/material/styles";
import { makeStyles } from "@mui/styles";

export const useStyles = makeStyles<Theme>(
  theme => ({
    total: {
      textAlign: "right",
    },
    paper: {
      marginBottom: theme.spacing(2),
      padding: theme.spacing(2),
    },
  }),
  { name: "CheckoutCart" },
);
