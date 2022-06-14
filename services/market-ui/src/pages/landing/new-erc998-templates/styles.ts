import { Theme } from "@mui/material/styles";
import { makeStyles } from "@mui/styles";

export const useStyles = makeStyles<Theme>(
  theme => ({
    title: {
      marginTop: theme.spacing(7),
    },
  }),
  { name: "NewTokens" },
);
