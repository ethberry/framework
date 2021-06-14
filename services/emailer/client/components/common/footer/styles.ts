/* eslint camelcase: 0 */
import {makeStyles} from "@material-ui/core";

export default makeStyles(
  () => ({
    root: {
      width: "100%",
      border: 0,
      textAlign: "center",
    },
    unsubscribe: {
      fontSize: "12px",
    },
    copyright: {
      fontSize: "10px",
    },
    link: {
      color: "#ABACAE",
    },
  }),
  {name: "Footer"},
);
