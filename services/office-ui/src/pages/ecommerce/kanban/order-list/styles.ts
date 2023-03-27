import { Theme } from "@mui/material/styles";
import { makeStyles } from "@mui/styles";

export const useStyles = makeStyles<Theme>(
  theme => ({
    wrapper: {
      display: "flex",
      flexDirection: "column",
      marginTop: theme.spacing(2),
      userSelect: "none",
      width: "100%",
      height: "100%",
      overflowY: "auto",

      padding: theme.spacing(0.75),
      backgroundColor: theme.palette.grey[100],
      borderRadius: theme.spacing(0.5),
    },
    dropZone: {
      height: "100%",
    },
  }),
  { name: "BoardList" },
);
