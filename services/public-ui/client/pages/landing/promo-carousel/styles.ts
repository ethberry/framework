import { Theme } from "@mui/material/styles";
import { makeStyles } from "@mui/styles";

export const useStyles = makeStyles<Theme>(theme => ({
  root: {
    marginTop: -theme.spacing(3),
    flexDirection: "column",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    color: theme.palette.common.white,
  },
  stepper: {
    width: "100%",
  },
  img: {
    overflow: "hidden",
    display: "block",
    height: 750,
    width: "100vw",
  },
}));
