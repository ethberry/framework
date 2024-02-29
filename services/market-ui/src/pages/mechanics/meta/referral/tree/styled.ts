import { Alert, Box, TextField } from "@mui/material";
import { styled } from "@mui/material/styles";

export const StyledAlert = styled(Alert)({
  "& .MuiAlert-icon": {
    alignItems: "center",
  },
});

export const StyledCopyRefLinkWrapper = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(2),
}));

export const StyledTextField = styled(TextField)({
  width: "100%",
});
