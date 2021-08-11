import { createStyles, makeStyles } from "@material-ui/core";

export default makeStyles(
  theme =>
    createStyles({
      toolbar: {
        height: 36,
      },
      media: {
        height: 140,
      },
      preview: {
        height: theme.spacing(10),
        overflow: "hidden",
      },
    }),
  { name: "Product" },
);
