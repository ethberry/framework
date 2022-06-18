import { Theme } from "@mui/material/styles";
import { makeStyles } from "@mui/styles";

export const useStyles = makeStyles<Theme>(
  () => ({
    toolbar: {
      height: 36,
    },
    media: {
      height: 140,
    },
  }),
  { name: "Token" },
);
