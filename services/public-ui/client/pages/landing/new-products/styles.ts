import {createStyles, makeStyles} from "@material-ui/core";

export default makeStyles(
  theme =>
    createStyles({
      title: {
        marginTop: theme.spacing(7),
        color: "#cfab88",
      },
    }),
  {name: "NewProducts"},
);
