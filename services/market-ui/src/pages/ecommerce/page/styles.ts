import { makeStyles } from "@mui/styles";
import { Theme } from "@mui/material";

export const useStyles = makeStyles<Theme>(
  () => ({
    content: {
      width: "100%",
      maxWidth: "1150px",
      margin: "0 auto",
      padding: "40px 20px",
    },
    spinner: {
      position: "absolute",
      right: 0,
      left: 0,
      margin: "0 auto",
      top: "calc(50% - 100px)",
    },
  }),
  { name: "Pages" },
);
