import { Theme } from "@mui/material/styles";
import { makeStyles } from "@mui/styles";

export const useStyles = makeStyles<Theme>(
  theme => ({
    container: {
      height: 480,
      margin: theme.spacing(0, -1, 0, -1),
    },
    item: {
      padding: theme.spacing(2, 1, 2, 1),
    },
  }),
  { name: "MultiCarouselHierarchy" },
);
