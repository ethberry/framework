import { Theme } from "@mui/material/styles";
import { makeStyles } from "@mui/styles";

export const useStyles = makeStyles<Theme>(
  theme => ({
    container: {
      borderRadius: 4,
      border: `solid 1px ${theme.palette.grey[300]}`,
      boxShadow: "0 0 0 rgba(0, 0, 0, 0)",
      backgroundColor: theme.palette.common.white,
      padding: theme.spacing(1),
      marginBottom: theme.spacing(0.5),
      userSelect: "none",
      display: "block",
      color: theme.palette.grey.A400,
      fontSize: 14,
      transition: "all 300ms cubic-bezier(0.4, 0, 0.2, 1)",

      "&:hover": {
        textDecoration: "none",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.12)",
      },
    },

    id: {
      ...theme.typography.h6,
    },
    addr: {},
  }),
  { name: "BoardItem" },
);
