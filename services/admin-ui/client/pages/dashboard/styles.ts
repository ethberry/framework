import {createStyles, makeStyles} from "@material-ui/core";

export default makeStyles(
  theme =>
    createStyles({
      root: {
        width: "100%",
        backgroundColor: theme.palette.background.paper,
      },
    }),
  {name: "Dashboard"},
);
