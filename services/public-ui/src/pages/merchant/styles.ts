import { Theme } from "@mui/material/styles";
import { makeStyles } from "@mui/styles";

export const useStyles = makeStyles<Theme>(
  () => ({
    avatar: {
      width: 200,
      height: 200,
    },
  }),
  { name: "Merchant" },
);
