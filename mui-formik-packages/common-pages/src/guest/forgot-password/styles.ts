import { Theme } from "@mui/material/styles";
import { makeStyles } from "@mui/styles";

export const useStyles = makeStyles<Theme>(
  () => ({
    section: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      maxWidth: 500,
      margin: "0 auto",
    },
  }),
  { name: "ForgotPassword" },
);
