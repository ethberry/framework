import { Theme } from "@mui/material/styles";
import { makeStyles } from "@mui/styles";

export const useStyles = makeStyles<Theme>(
  () => ({
    container: {
      display: "flex",
      flexDirection: "row",
      flexWrap: "nowrap",
      justifyContent: "flex-start",
      alignItems: "stretch",
      width: "100%",
      overflowX: "auto",
      height: "100%",
    },
  }),
  { name: "Board" },
);
