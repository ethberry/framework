import { Theme } from "@mui/material/styles";
import { makeStyles } from "@mui/styles";

export const useStyles = makeStyles<Theme>(
  theme => ({
    label: {
      width: "100%",
      marginLeft: 0,
      marginRight: 0,
    },
    slider: {
      marginLeft: theme.spacing(2),
    },
  }),
  { name: "SliderInput" },
);
