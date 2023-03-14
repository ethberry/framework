import { Theme } from "@mui/material/styles";
import { makeStyles } from "@mui/styles";

export const useStyles = makeStyles<Theme>(
  theme => ({
    root: {
      overflowY: "auto",
      overflowX: "hidden",
      display: "flex",
      minHeight: "100vh",
      position: "relative",
    },
    container: {
      paddingTop: theme.spacing(11),
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(2),
      [theme.breakpoints.up("sm")]: {
        paddingLeft: theme.spacing(3),
        paddingRight: theme.spacing(3),
      },
    },
  }),
  { name: "Layout" },
);
