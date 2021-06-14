import {createStyles, makeStyles} from "@material-ui/core/styles";

export const useStyles = makeStyles(
  () =>
    createStyles({
      root: {
        margin: "5px 0 1px",
        outline: "none",
      },
      centered: {
        textAlign: "center",
      },
      leftAligned: {
        textAlign: "left",
      },
      rightAligned: {
        textAlign: "right",
      },
    }),
  {name: "RichTextDisplay-Media"},
);
