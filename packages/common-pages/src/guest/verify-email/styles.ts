import { Theme } from "@mui/material/styles";
import { makeStyles } from "@mui/styles";

export const useStyles = makeStyles<Theme>(
  () => ({
    popup: {
      width: 400,
      margin: "auto",
    },
  }),
  { name: "VerifyEmail" },
);
