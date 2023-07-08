import { Box } from "@mui/material";
import { styled } from "@mui/material/styles";

export const DataViewWrapper = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2.5),
}));

export const DataViewItemWrapper = styled(Box)(({ theme }) => ({
  display: "flex",
  marginBottom: theme.spacing(1),
  "&:last-of-type": {
    marginBottom: 0,
  },
}));

export const DataViewItemContentWrapper = styled(Box)(({ theme }) => ({
  marginLeft: theme.spacing(1),
}));

export const DataViewAddressLinkWrapper = styled(Box)({
  fontSize: 16,
  lineHeight: "24px",
});
