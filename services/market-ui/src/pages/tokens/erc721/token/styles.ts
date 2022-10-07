import { Theme } from "@mui/material/styles";
import { makeStyles } from "@mui/styles";

export const useStyles = makeStyles<Theme>(
  theme => ({
    paper: {
      padding: theme.spacing(2),
      marginBottom: theme.spacing(2),
    },
    price: {
      paddingLeft: 0,
      listStylePosition: "inside",
    },
  }),
  { name: "Erc721Token" },
);
