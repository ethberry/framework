import { Theme } from "@mui/material/styles";
import { makeStyles } from "@mui/styles";

export const useStyles = makeStyles<Theme>(
  () => ({
    root: {
      width: "100%",
    },
  }),
  { name: "CollectionUploadForm" },
);
