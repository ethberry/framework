import { Theme } from "@mui/material/styles";
import { makeStyles } from "@mui/styles";

export const useStyles = makeStyles<Theme>(
  theme => ({
    container: {
      margin: theme.spacing(0, 1),
      display: "flex",
      flexDirection: "column",
      flex: 1,
      minWidth: 165,
      backgroundColor: theme.palette.grey[100],
      [theme.breakpoints.down("sm")]: {
        "min-width": "calc(100% - 16px)",
      },
    },
    header: {
      padding: 0,
      lineHeight: "28px",
      textTransform: "uppercase",
      fontWeight: 600,
      textAlign: "center",
      marginTop: theme.spacing(1),
      marginBottom: theme.spacing(0.5),
    },
  }),
  { name: "BoardColumn" },
);
