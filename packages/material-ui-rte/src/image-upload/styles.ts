import {createStyles, makeStyles} from "@material-ui/core";

export default makeStyles(
  () =>
    createStyles({
      root: {
        maxWidth: 345,
      },
      media: {
        height: 0,
        paddingTop: "56.25%",
      },
      avatar: {
        backgroundColor: "tomato",
      },
    }),
  {name: "UserEdit"},
);
