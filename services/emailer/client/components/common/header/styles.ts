import { makeStyles } from "@material-ui/core";

export default makeStyles(
  theme => ({
    link: {
      color: "#ffffff",
      fontSize: "34px",
      fontWeight: "bold",
      textDecoration: "none",
      lineHeight: "64px",
    },
    image: {
      paddingTop: theme.spacing(2),
    },
  }),
  { name: "Header" },
);
