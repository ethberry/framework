import { Theme } from "@mui/material/styles";
import { makeStyles } from "@mui/styles";

export const useStyles = makeStyles<Theme>(
  () => ({
    logo: {
      margin: "0 auto",
      width: 800,
    },
  }),
  { name: "Landing" },
);
