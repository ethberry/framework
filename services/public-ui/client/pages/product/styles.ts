import { createStyles, makeStyles } from "@material-ui/core";

export default makeStyles(
  theme =>
    createStyles({
      paper: {
        padding: theme.spacing(2),
      },
    }),
  { name: "Product" },
);
