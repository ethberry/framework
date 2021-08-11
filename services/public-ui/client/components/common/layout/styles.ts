import { createStyles, makeStyles } from "@material-ui/core";

export default makeStyles(
  theme =>
    createStyles({
      root: {
        overflowY: "auto",
        overflowX: "hidden",
        display: "flex",
        minHeight: "100vh",
        position: "relative",
      },
      container: theme.mixins.gutters({
        paddingTop: theme.spacing(11),
      }),
    }),
  { name: "Layout" },
);
