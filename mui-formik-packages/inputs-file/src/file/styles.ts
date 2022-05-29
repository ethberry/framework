import { Theme } from "@mui/material/styles";
import { makeStyles } from "@mui/styles";

export const useStyles = makeStyles<Theme>(
  () => ({
    placeholder: {
      width: 200,
      height: 150,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    icon: {
      width: "100% !important",
      height: "100% !important",
      border: "#D7D7D7 3px dashed",
      color: "#D7D7D7",
    },
  }),
  { name: "InputFile" },
);
