import { Theme } from "@mui/material/styles";
import { makeStyles, createStyles } from "@mui/styles";

export const useStyles = makeStyles<Theme>(
  theme =>
    createStyles({
      login: {
        color: theme.palette.common.white,
        borderColor: theme.palette.common.white,
      },
      active: {
        backgroundColor: "#f0f0f0",
      },
    }),
  { name: "HeaderSections" },
);
