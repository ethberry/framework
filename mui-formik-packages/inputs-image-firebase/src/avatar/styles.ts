import { Theme } from "@mui/material/styles";
import { makeStyles } from "@mui/styles";

export const useStyles = makeStyles<Theme>(
  theme => ({
    root: {
      height: 200,
      width: 200,
      position: "relative",
    },
    container: {
      marginTop: theme.spacing(1),
    },
    button: {
      position: "absolute",
      top: 0,
      right: 0,
    },
    image: {
      height: 200,
      width: 200,
      borderRadius: "50%",
      borderColor: "#fff",
      borderStyle: "solid",
      borderWidth: 0,
      overflow: "hidden",
      backgroundSize: "contain",
      backgroundRepeat: "no-repeat",
      backgroundPosition: "center",
    },
  }),
  { name: "AvatarInput" },
);
