import { Theme } from "@mui/material/styles";
import { makeStyles } from "@mui/styles";

export const useStyles = makeStyles<Theme>(
  () => ({
    container: {
      height: "calc(100vh - 80px)",
      overflowY: "hidden",

      display: "flex",
      flexDirection: "column",
      justifyContent: "flex-start",
      alignItems: "stretch",
    },
  }),
  { name: "Kanban" },
);
