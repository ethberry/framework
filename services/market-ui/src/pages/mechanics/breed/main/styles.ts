import { Theme } from "@mui/material/styles";
import { makeStyles } from "@mui/styles";

export const useStyles = makeStyles<Theme>(
  theme => ({
    title: {
      marginTop: theme.spacing(7),
    },
    select: {
      marginTop: theme.spacing(1),
    },
  }),
  { name: "NewTokens" },
);
