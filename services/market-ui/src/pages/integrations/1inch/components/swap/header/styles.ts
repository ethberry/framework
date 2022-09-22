import { Theme } from "@mui/material/styles";
import { makeStyles } from "@mui/styles";

export const useStyles = makeStyles<Theme>(
  theme => ({
    toolbar: {
      width: "100%",
      padding: 0,
      minHeight: theme.spacing(5),
    },
    title: {
      margin: "0 auto",
      display: "flex",
    },
  }),
  { name: "SwapHeader" },
);
