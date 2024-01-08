import { Box, Grid } from "@mui/material";
import { styled } from "@mui/material/styles";

export const StyledContainer = styled(Grid)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  height: "calc(100vh - 64px)",
  maxWidth: 900,
  margin: "0 auto",
  textAlign: "center",
  "& #firebaseui-auth-container": {
    transition: "all 1s ease-out",
    marginBottom: theme.spacing(2),
  },
}));

export interface IStyledFirebaseAuthFormProps {
  withEmail?: boolean;
}

export const StyledFirebaseAuthForm = styled(Box, {
  shouldForwardProp: prop => prop !== "withEmail",
})<IStyledFirebaseAuthFormProps>(({ theme, withEmail }) => ({
  display: withEmail ? "flex" : "none",
  transition: "all 1s ease-out",
  marginBottom: theme.spacing(2),
}));
