import { createStyles, makeStyles } from "@material-ui/core";

export default makeStyles(
  () =>
    createStyles({
      toolbar: {
        height: 36,
      },
      media: {
        height: 140,
      },
    }),
  { name: "Product" },
);
