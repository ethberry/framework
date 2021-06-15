import {createStyles, makeStyles} from "@material-ui/core";

export default makeStyles(
  theme =>
    createStyles({
      title: {
        marginTop: theme.spacing(7),
      },
    }),
  {name: "NewProducts"},
);
