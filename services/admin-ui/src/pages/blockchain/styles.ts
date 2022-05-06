import { Theme } from "@mui/material/styles";
import { makeStyles } from "@mui/styles";

export const useStyles = makeStyles<Theme>(
  theme => ({
    root: {
      width: "100%",
      backgroundColor: theme.palette.background.paper,
    },
  }),
  { name: "Dashboard" },
);
