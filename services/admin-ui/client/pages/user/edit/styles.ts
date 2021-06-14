import {createStyles, makeStyles} from "@material-ui/core";

export default makeStyles(
  () =>
    createStyles({
      section: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "calc(100vh - 64px)",
        width: 250,
        margin: "0 auto",
      },
    }),
  {name: "UserEdit"},
);
