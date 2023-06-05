import { Theme } from "@mui/material/styles";
import { makeStyles } from "@mui/styles";

export const useStyles = makeStyles<Theme>(
  theme => ({
    container: {
      marginBottom: theme.spacing(1),
    },
    id: {},
    addr: {},
  }),
  { name: "BoardItem" },
);
