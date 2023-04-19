import { Theme } from "@mui/material/styles";
import { makeStyles } from "@mui/styles";

export const useStyles = makeStyles<Theme>(theme => ({
  root: {
    flexDirection: "column",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    color: theme.palette.common.white,
    maxWidth: "1150px",
    height: 450,
  },
  stepper: {
    width: "100%",
  },
  img: {
    backgroundRepeat: "no-repeat",
    backgroundSize: "contain",
    backgroundPosition: "center",
    cursor: "pointer",
    overflow: "hidden",
    display: "block",
    height: 750,
    width: "100%",
  },
}));
