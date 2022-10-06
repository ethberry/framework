import { Theme } from "@mui/material/styles";
import { makeStyles } from "@mui/styles";

export const useStyles = makeStyles<Theme>(
  theme => ({
    price: {
      paddingLeft: 0,
      listStylePosition: "inside",
    },
  }),
  { name: "Erc721Token" },
);
