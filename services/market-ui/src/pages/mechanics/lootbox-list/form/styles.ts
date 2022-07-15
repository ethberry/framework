import { Theme } from "@mui/material/styles";
import { makeStyles } from "@mui/styles";

export const useStyles = makeStyles<Theme>(
  theme => ({
    root: {
      margin: theme.spacing(3, 0),
    },
  }),
  { name: "Erc721LootboxSearchForm" },
);
