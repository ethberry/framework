import { Button } from "@mui/material";
import { styled } from "@mui/material/styles";

export const StyledButton = styled(Button)(({ theme }) => ({
  justifyContent: "flex-start",
  boxShadow: "0 2px 2px 0 rgb(0 0 0 / 14%), 0 3px 1px -2px rgb(0 0 0 / 20%), 0 1px 5px 0 rgb(0 0 0 / 12%)",
  color: theme.palette.text.primary,
  fontWeight: 500,
  height: "auto",
  lineHeight: "normal",
  letterSpacing: "normal",
  maxWidth: 220,
  minHeight: 40,
  padding: theme.spacing(1),
  marginTop: theme.spacing(2),
  textTransform: "none",
  "& .MuiButton-startIcon": {
    marginRight: theme.spacing(1),
    marginLeft: theme.spacing(1),
  },
  "& .MuiButton-startIcon svg": {
    fontSize: theme.spacing(3),
    marginRight: 2,
    marginLeft: -4,
  },
}));
