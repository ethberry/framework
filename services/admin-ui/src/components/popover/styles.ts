import { Theme } from "@mui/material/styles";
import { makeStyles } from "@mui/styles";

export const useStyles = makeStyles<Theme>(
  () => ({
    button: {
      position: "absolute",
      right: 0,
      zIndex: 1000,
    },
  }),
  { name: "Erc20EditPopover" },
);
