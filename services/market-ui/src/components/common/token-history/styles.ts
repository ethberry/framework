import { Theme } from "@mui/material/styles";
import { makeStyles } from "@mui/styles";

export const useStyles = makeStyles<Theme>(
  () => ({
    price: {
      paddingLeft: 0,
      listStylePosition: "inside",
    },
  }),
  { name: "TokenHistory" },
);
