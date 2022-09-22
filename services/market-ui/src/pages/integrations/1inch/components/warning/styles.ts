import { Theme } from "@mui/material/styles";
import { makeStyles } from "@mui/styles";

export const useStyles = makeStyles<Theme>(
  theme => ({
    container: {
      margin: theme.spacing(2, "auto"),
      width: 600,
      position: "absolute",
      left: 0,
      right: 0,
    },
  }),
  { name: "Warning" },
);
