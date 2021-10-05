import { Theme } from "@mui/material/styles";
import { makeStyles } from "@mui/styles";

export const useStyles = makeStyles<Theme>(
  theme => ({
    toolbar: {
      height: 36,
    },
    media: {
      height: 200,
    },
    preview: {
      height: theme.spacing(10),
      overflow: "hidden",
    },
  }),
  { name: "Product" },
);
