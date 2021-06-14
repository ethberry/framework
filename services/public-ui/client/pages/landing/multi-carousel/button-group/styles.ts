import {createStyles, makeStyles} from "@material-ui/core";

export default makeStyles(
  theme =>
    createStyles({
      buttonGroup: {
        display: "flex",
        justifyContent: "space-between",
        position: "absolute",
        marginTop: -205,
        width: "calc(100% + 100px)",
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
        [theme.breakpoints.up("sm")]: {
          marginLeft: -48 - theme.spacing(1),
          marginRight: -48 - theme.spacing(1),
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
  {name: "MultiCarouselButtonGroup"},
);
