import { Theme } from "@mui/material/styles";
import { makeStyles } from "@mui/styles";

export const useStyles = makeStyles<Theme>(
  theme => ({
    balance: {
      fontSize: theme.typography.body2.fontSize,
      color: theme.palette.grey[500],
    },
  }),
  { name: "TokenSearch" },
);
