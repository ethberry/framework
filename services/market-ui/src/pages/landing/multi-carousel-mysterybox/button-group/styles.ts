import { Theme } from "@mui/material/styles";
import { makeStyles } from "@mui/styles";

export const useStyles = makeStyles<Theme>(
  theme => ({
    buttonGroup: {
      display: "flex",
      justifyContent: "space-between",
      position: "absolute",
      top: "50%",
      width: "calc(100% - 16px)",
      marginLeft: theme.spacing(1),
      marginRight: theme.spacing(1),
      [theme.breakpoints.up("sm")]: {
        width: "calc(100% + 100px)",
        marginLeft: theme.spacing(-7),
        marginRight: theme.spacing(-7),
      },
    },
    button: {
      [theme.breakpoints.down("sm")]: {
        color: theme.palette.common.white,
        backgroundColor: "rgba(0, 0, 0, 0.3)",
        "&:hover": {
          backgroundColor: "rgba(0, 0, 0, 0.5)",
        },
      },
    },
  }),
  { name: "MultiCarouselButtonGroup" },
);
