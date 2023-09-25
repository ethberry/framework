import { Box, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";

export const StyledAssetsWrapper = styled(Box)(({ theme }) => ({
  marginLeft: theme.spacing(1),
}));

export const StyledDataViewAddressLinkWrapper = styled(Box)({
  fontSize: 16,
  lineHeight: "24px",
});

export const StyledDataViewItemWrapper = styled(Box)(({ theme }) => ({
  display: "flex",
  marginBottom: theme.spacing(1),
  "&:last-of-type": {
    marginBottom: 0,
  },
}));

export const StyledTitle = styled(Typography)({
  fontWeight: 500,
});
