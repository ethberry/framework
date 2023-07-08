import { Box } from "@mui/material";
import { styled } from "@mui/material/styles";

export const AssetsWrapper = styled(Box)(({ theme }) => ({
  marginLeft: theme.spacing(1),
}));

export const DataViewAddressLinkWrapper = styled(Box)({
  fontSize: 16,
  lineHeight: "24px",
});

export const DataViewItemWrapper = styled(Box)(({ theme }) => ({
  display: "flex",
  marginBottom: theme.spacing(1),
  "&:last-of-type": {
    marginBottom: 0,
  },
}));
