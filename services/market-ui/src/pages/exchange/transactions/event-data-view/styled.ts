import { Box } from "@mui/material";
import { styled } from "@mui/material/styles";

export const StyledDataViewWrapper = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2.5),
  borderBottom: "1px solid rgba(224, 224, 224, 1)",
}));

export const StyledDataViewItemWrapper = styled(Box)(({ theme }) => ({
  display: "flex",
  marginBottom: theme.spacing(1),
  "&:last-of-type": {
    marginBottom: 0,
  },
}));

export const StyledDataViewItemContentWrapper = styled(Box)(({ theme }) => ({
  marginLeft: theme.spacing(1),
}));

export const StyledDataViewAddressLinkWrapper = styled(Box)({
  fontSize: 16,
  lineHeight: "24px",
});
