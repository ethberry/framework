import { Theme } from "@mui/material/styles";
import { makeStyles } from "@mui/styles";

export const useStyles = makeStyles<Theme>(
  theme => {
    return {
      wrapper: {
        marginTop: theme.spacing(6),
        marginBottom: theme.spacing(6),
      },
      image: {
        margin: "0 auto",
        display: "block",
        height: "100%",
      },
    };
  },
  { name: "DropBanner" },
);
