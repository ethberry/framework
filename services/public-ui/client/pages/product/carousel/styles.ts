import { Theme } from "@mui/material/styles";
import { makeStyles } from "@mui/styles";

export const useStyles = makeStyles<Theme>(theme => ({
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
}));
