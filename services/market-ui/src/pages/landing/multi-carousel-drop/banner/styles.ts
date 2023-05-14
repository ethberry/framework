import { Theme } from "@mui/material/styles";
import { makeStyles } from "@mui/styles";

export const useStyles = makeStyles<Theme>(
  theme => {
    return {
      container: {
        flexDirection: "row-reverse",
        [theme.breakpoints.down("sm")]: {
          flexDirection: "row",
        },
        height: "100%",
      },
      wrapper: {
        marginTop: theme.spacing(6),
        marginBottom: theme.spacing(6),
      },
      image: {
        margin: "0 auto",
        display: "block",
        height: "100%",
        maxWidth: "100%",
        minWidth: 260,
        minHeight: 260,
        [theme.breakpoints.down("sm")]: {
          minWidth: 180,
          minHeight: 180,
        },
      },
    };
  },
  { name: "DropBanner" },
);
