import {makeStyles} from "@material-ui/core";

export default makeStyles(
  theme => ({
    header: {
      width: "100%",
      border: 0,
      textAlign: "center",
    },
    main: {
      width: 600,
      maxWidth: "600px !important",
      margin: "0 auto !important",
      clear: "both",
      display: "block !important",
    },
    footer: {
      paddingTop: theme.spacing(5),
      textAlign: "center",
    },
  }),
  {name: "Layout"},
);
