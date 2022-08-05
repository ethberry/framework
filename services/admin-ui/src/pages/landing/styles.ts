import { Theme } from "@mui/material/styles";
import { makeStyles } from "@mui/styles";

export const useStyles = makeStyles<Theme>(
  () => ({
    logo: {
      display: "block",
      height: "calc(100vh - 94px)",
      margin: "0 auto",
    },
  }),
  { name: "Landing" },
);
