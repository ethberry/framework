import { Theme } from "@mui/material/styles";
import { makeStyles } from "@mui/styles";

export const useStyles = makeStyles<Theme>(
  () => ({
    popup: {
      width: 400,
      margin: "auto",
    },
    section: {
      alignItems: "center",
      maxWidth: 500,
      margin: "0 auto",
    },
  }),
  { name: "Resend" },
);
