import {createStyles, makeStyles} from "@material-ui/core";

export default makeStyles(theme =>
  createStyles({
    root: {
      flexGrow: 1,
      maxWidth: 400,
    },
    header: {
      display: "flex",
      alignItems: "center",
      height: 50,
      paddingLeft: theme.spacing(4),
      backgroundColor: theme.palette.background.default,
    },
    img: {
      maxWidth: 400,
      overflow: "hidden",
      display: "block",
      width: "100%",
    },
  }),
);
