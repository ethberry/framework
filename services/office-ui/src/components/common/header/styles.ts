import { Theme } from "@mui/material/styles";
import { createStyles, makeStyles } from "@mui/styles";

export const useStyles = makeStyles<Theme>(
  theme =>
    createStyles({
      toolbar: {
        minHeight: 64,
      },
      grow: {
        flexGrow: 1,
      },
      title: {
        color: theme.palette.common.white,
        textDecoration: "none",
        fontWeight: 500,
        fontSize: 36,
        "&:hover": {
          textDecoration: "none",
        },
        [theme.breakpoints.down("md")]: {
          fontSize: 22,
        },
      },
      logo: {
        display: "inline-block",
        verticalAlign: "middle",
        height: 40,
        width: 62,
        marginRight: theme.spacing(1),
      },
    }),
  { name: "Header" },
);
