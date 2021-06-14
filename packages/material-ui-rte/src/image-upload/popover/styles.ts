import {createStyles, makeStyles} from "@material-ui/core";

export default makeStyles(
  () =>
    createStyles({
      root: {
        padding: 10,
        maxWidth: 350,
      },
      textField: {
        width: "100%",
      },
    }),
  {name: "MyCardPopover"},
);
