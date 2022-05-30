import { Theme } from "@mui/material/styles";
import { makeStyles } from "@mui/styles";

export const useStyles = makeStyles<Theme>(
  () => ({
    section: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      height: "calc(100vh - 64px)",
      maxWidth: 500,
      margin: "0 auto",
    },
  }),
  { name: "Login" },
);
