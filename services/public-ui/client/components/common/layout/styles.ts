import {createStyles, makeStyles} from "@material-ui/core";

export default makeStyles(
  theme =>
    createStyles({
      root: {
        overflowY: "auto",
        overflowX: "hidden",
        display: "flex",
        minHeight: "100vh",
        position: "relative",
        backgroundColor: "#313131",
      },
      container: theme.mixins.gutters({
        paddingTop: theme.spacing(11),
      }),
    }),
  {name: "Layout"},
);
