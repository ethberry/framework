import {createStyles, makeStyles} from "@material-ui/core";

export default makeStyles(
  theme =>
    createStyles({
      container: {
        margin: theme.spacing(0, -1, 0, -1),
      },
      item: {
        padding: theme.spacing(2, 1, 2, 1),
      },
    }),
  {name: "MultiCarousel"},
);
